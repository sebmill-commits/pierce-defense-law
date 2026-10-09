/**
 * PIERCE DEFENSE WEBSITE WEBHOOK v2 (2026-10-08)
 * ============================================================================
 * Single Apps Script endpoint behind piercedefense.com and
 * defense.rivercrestlaw.com. One doPost, one deployment, one URL
 * (Vercel env GOOGLE_SCRIPT_WEBHOOK_URL / CITATION_UPLOAD_WEBHOOK_URL).
 *
 * The site sends three kinds of post, told apart by their fields:
 *   - citation photo   (imageData present)      -> Citations Inbox folder in Drive
 *   - paid traffic case (Stripe webhook, paymentId) -> new PDL- row on the Dashboard
 *   - DUI consult form (source contains "DUI")   -> new DUI- row on the Dashboard
 *
 * v2 changes (why):
 *   1. Attorney notification on EVERY intake (paid, DUI, duplicate) — Sebastian
 *      had no signal that someone signed up except the client emailing to ask.
 *   2. Client receipt / welcome email on every PAID intake, sent from this
 *      Gmail account with the representation agreement attached. Replaces the
 *      Resend path in the Next.js webhook, which never had an API key.
 *   3. DUI consults were being written as blank traffic rows (no citation, no
 *      court, arrest details dropped). They now get a DUI- id, their own status
 *      and tag, and the arrest details land in Filing Notes.
 *   4. PDL ids were always "-001": the id scan read column A (First Name)
 *      instead of the OTRI-ID column, so two same-day signups collided
 *      (PDL-261005-001 x2, PDL-261008-001 x2). Fixed + LockService.
 *   5. Duplicate-payment guard: same email + same citation (or same email
 *      within 2 h) does NOT create a second row — it annotates the first and
 *      sends a DUPLICATE alert so the second charge can be refunded (Park 10/3).
 *
 * HOME: this file lives in ~/rivercrest-appscript (Case Management Automation
 * project). The live URL is deployment AKfycbz6-k2w4...BGaFjHDV7 ("piercedefense").
 * It was pinned to version @140 after a later `clasp push` dropped this file
 * from HEAD, so the deployed code and HEAD drifted (found 2026-10-08).
 * DEPLOY: clasp push && clasp deploy -i AKfycbz6-k2w4OPkVkkdeqfuoAo4I0I_r7W7MWmtSuTeudXfJH_yfj6BnuemoTJBGaFjHDV7 -d "piercedefense vN"
 * The deployment id (and therefore the Vercel URL) never changes.
 */

// Must match WEBHOOK_SHARED_SECRET in Vercel. Already filled in.
const PIERCE_WEBHOOK_SECRET = 'f44855e4605b9e97eab857e66a0389e69e7f04afca193feb';

const PIERCE_SPREADSHEET_ID = '1kAmA2-VdgWlYIuJSq516vztIdMtb_eFmymsBhncqqVw';
const PIERCE_DASHBOARD_SHEET = 'Dashboard';
const PIERCE_CITATIONS_FOLDER_ID = '1fhsJOvtZp6SWg8PeQmlFwNFKMd1KPL7q';

// Who hears about every signup. Comma-separated.
const PIERCE_NOTIFY_TO = 'support@rivercrestlaw.info, sebastian@rivercrestlaw.info';

// Representation agreement attached to the client welcome email.
// Preferred: a Drive file id (upload the PDF once, paste the id here).
// Fallback: fetched from the live site (only works once the 8/4 site changes
// that add /documents/representation-agreement.pdf are deployed).
const PIERCE_AGREEMENT_FILE_ID = '1xZzsaPY-WaaDcpRX8lLxotbBGavsN__a'; // OTR Cases/_Website/Representation_Agreement_Traffic_Website.pdf (one-page letterhead, 2026-10-09)
const PIERCE_AGREEMENT_URL = 'https://piercedefense.com/documents/representation-agreement.pdf';

// Set true to send the client welcome email on paid intakes. Leave false until
// Sebastian has approved the email body + agreement (see docs/STATUS_2026-10-08).
const PIERCE_SEND_CLIENT_WELCOME = false;

const PIERCE_BRANDS = {
  PIERCE: {
    name: 'Pierce Defense Law',
    email: 'sebastian@piercedefense.com',
    phone: '(253) 238-7444',
    site: 'https://piercedefense.com',
  },
  SEATTLE: {
    name: 'Rivercrest Law',
    email: 'sebastian@rivercrestlaw.com',
    phone: '(206) 414-1964',
    site: 'https://defense.rivercrestlaw.com',
  },
};

// Dashboard header names (exact live text; aliases cover the July 2026 rename).
const PIERCE_HEADERS = {
  OTR_ID: ['OTRI-ID', 'OTR ID', 'OTR-ID'],
  FIRST_NAME: ['First Name'],
  LAST_NAME: ['Last Name'],
  EMAIL: ['Email'],
  PHONE: ['Phone'],
  COURT_NAME: ['Court Name'],
  CITATION_NUMBER: ['Citation Number'],
  CITATION_DATE: ['Citation Date'],
  VIOLATIONS: ['Violations'],
  COURT_DATE: ['Court Date'],
  REQUEST_DATE: ['Request Date'],
  CASE_STATUS: ['Case Status'],
  CASE_TAGS: ['Case Tags'],
  FILING_NOTES: ['Filing Notes'],
};
const PIERCE_REQUIRED_COLS = ['OTR_ID', 'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'CASE_STATUS'];

// ============================================================================
// ENTRY POINTS
// ============================================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== PIERCE_WEBHOOK_SECRET) {
      return pierceJson_({ success: false, error: 'Unauthorized' });
    }

    if (data.imageData) return pierceJson_(pierceSaveCitation_(data));

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const kind = pierceIsDui_(data) ? 'DUI' : 'PAID';
      return pierceJson_(pierceCreateRow_(data, kind));
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('Pierce webhook error:', error);
    pierceSafeNotify_('⚠️ Website webhook ERROR', '<pre>' + pierceEsc_(String(error && error.stack || error)) +
      '</pre><p>Raw post:</p><pre>' + pierceEsc_((e && e.postData && e.postData.contents || '').slice(0, 4000)) + '</pre>');
    return pierceJson_({ success: false, error: error.toString() });
  }
}

// NOTE: no doGet() here. Code.js owns doGet (context bridge / MCP web app); a
// second definition in this flat namespace would override it on the next
// version. Health check = `clasp deployments` shows the piercedefense
// deployment on the current version, or POST a test intake.

function pierceIsDui_(data) {
  return /DUI/i.test(String(data.source || '')) || data.arrestDate !== undefined || data.bacLevel !== undefined;
}

// ============================================================================
// INTAKE -> DASHBOARD ROW
// ============================================================================

function pierceCreateRow_(data, kind) {
  const sheet = SpreadsheetApp.openById(PIERCE_SPREADSHEET_ID).getSheetByName(PIERCE_DASHBOARD_SHEET);
  const cols = pierceColumnMap_(sheet);

  const missing = PIERCE_REQUIRED_COLS.filter(function (c) { return cols[c] === undefined; });
  if (missing.length) {
    return { success: false, error: 'Dashboard is missing columns: ' + missing.join(', ') };
  }

  const brand = pierceBrand_(data.source);
  const name = ((data.firstName || '') + ' ' + (data.lastName || '')).trim();

  // --- duplicate guard (paid intakes only) ---------------------------------
  if (kind === 'PAID') {
    const dup = pierceFindDuplicate_(sheet, cols, data);
    if (dup) {
      const note = '[' + pierceStamp_() + '] DUPLICATE website submission — Stripe: ' + (data.paymentId || '?') +
        ' | $' + (data.amountPaid || '?') + ' | citation given: ' + (data.citationNumber || '(none)') +
        ' — same ticket? REFUND the second charge in Stripe.';
      pierceAppendNote_(sheet, cols, dup.row, note);
      pierceNotifyAttorney_('DUPLICATE', data, dup.id, brand, dup.row);
      console.warn('Duplicate website intake for', name, '-> row', dup.row, dup.id);
      return { success: true, clientId: dup.id, duplicate: true };
    }
  }

  const clientId = pierceNextId_(sheet, cols, kind === 'DUI' ? 'DUI' : 'PDL');
  const row = new Array(sheet.getLastColumn()).fill('');
  const set = function (col, value) {
    if (cols[col] !== undefined && value !== undefined && value !== null && value !== '') row[cols[col]] = value;
  };

  set('OTR_ID', clientId);
  set('FIRST_NAME', data.firstName);
  set('LAST_NAME', data.lastName);
  set('EMAIL', data.email);
  set('PHONE', data.phone);
  set('COURT_NAME', data.courtName);
  set('REQUEST_DATE', new Date());

  if (kind === 'DUI') {
    set('CASE_STATUS', 'DUI_CONSULT');
    set('CASE_TAGS', 'WEBSITE_DUI_CONSULT');
    set('VIOLATIONS', 'DUI (consult request)');
    set('FILING_NOTES', '[' + pierceStamp_() + '] WEBSITE DUI CONSULT REQUEST — call back\n' + pierceDuiDetails_(data));
  } else {
    set('CITATION_NUMBER', data.citationNumber);
    set('CITATION_DATE', data.citationDate);
    set('VIOLATIONS', data.violations);
    set('COURT_DATE', data.courtDate);
    set('CASE_STATUS', data.caseStatus || (data.paymentId ? 'PAID' : 'NEW_INTAKE'));
    set('CASE_TAGS', 'WEBSITE_INTAKE');
    if (data.paymentId) {
      set('FILING_NOTES', 'Website payment: $' + (data.amountPaid || '') + ' | Stripe: ' + data.paymentId +
        ' | via ' + brand.name);
    }
  }

  sheet.appendRow(row);
  const newRow = sheet.getLastRow();
  console.log('New website intake:', kind, clientId, name, data.courtName);

  // --- notifications (never let an email failure fail the intake) ----------
  pierceNotifyAttorney_(kind, data, clientId, brand, newRow);

  let welcome = 'not sent';
  if (kind === 'PAID' && data.paymentId && data.email) {
    if (PIERCE_SEND_CLIENT_WELCOME) {
      try {
        pierceSendClientWelcome_(data, clientId, brand);
        welcome = 'sent';
        pierceAppendNote_(sheet, cols, newRow, '[' + pierceStamp_() + '] Welcome/receipt email sent to ' + data.email);
      } catch (err) {
        welcome = 'FAILED: ' + err;
        console.error('Welcome email failed:', err);
        pierceAppendNote_(sheet, cols, newRow, '[' + pierceStamp_() + '] ⚠️ Welcome email FAILED: ' + err);
      }
    } else {
      welcome = 'disabled (PIERCE_SEND_CLIENT_WELCOME=false)';
    }
  }

  return { success: true, clientId: clientId, welcomeEmail: welcome };
}

function pierceDuiDetails_(d) {
  const lines = [
    'Arrest date: ' + (d.arrestDate || '?'),
    'Arrest location: ' + (d.arrestLocation || '?'),
    'Court: ' + (d.courtName || '?'),
    'BAC: ' + (d.bacLevel || '?'),
    'Refusal: ' + (d.refusal || '?'),
    'Prior DUIs: ' + (d.priorDuis || '0'),
    'License status: ' + (d.licenseStatus || '?'),
    'Phone: ' + (d.phone || '?') + ' | Email: ' + (d.email || '?'),
  ];
  if (d.arrestDate) {
    const dol = new Date(d.arrestDate);
    if (!isNaN(dol)) {
      dol.setDate(dol.getDate() + 7);
      lines.push('DOL hearing request deadline (arrest + 7 days): ' +
        Utilities.formatDate(dol, Session.getScriptTimeZone(), 'EEE M/d/yyyy'));
    }
  }
  if (d.notes) lines.push('Client notes: ' + d.notes);
  return lines.join('\n');
}

/** Same email + same citation, or same email within the last 2 hours (Park 10/3 double-charge). */
function pierceFindDuplicate_(sheet, cols, data) {
  const email = String(data.email || '').trim().toLowerCase();
  if (!email || cols.EMAIL === undefined) return null;
  const cit = String(data.citationNumber || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const values = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();
  const now = Date.now();
  for (let i = values.length - 1; i >= 0; i--) {
    const r = values[i];
    if (String(r[cols.EMAIL] || '').trim().toLowerCase() !== email) continue;
    const rowCit = cols.CITATION_NUMBER !== undefined ? String(r[cols.CITATION_NUMBER] || '').replace(/[^A-Z0-9]/gi, '').toUpperCase() : '';
    const req = cols.REQUEST_DATE !== undefined ? r[cols.REQUEST_DATE] : null;
    const reqMs = req instanceof Date ? req.getTime() : Date.parse(req);
    const recent = !isNaN(reqMs) && (now - reqMs) < 2 * 60 * 60 * 1000;
    if ((cit && rowCit && cit === rowCit) || recent) {
      return { row: i + 2, id: String(r[cols.OTR_ID] || '') };
    }
  }
  return null;
}

/**
 * PDL-YYMMDD-NNN (website traffic) / DUI-YYMMDD-NNN (DUI consult).
 * Scans the OTRI-ID column — v1 scanned column A (First Name), so every id was -001.
 */
function pierceNextId_(sheet, cols, prefixWord) {
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMdd');
  const prefix = prefixWord + '-' + dateStr + '-';
  const last = sheet.getLastRow();
  let max = 0;
  if (last >= 2) {
    const ids = sheet.getRange(2, cols.OTR_ID + 1, last - 1, 1).getValues();
    ids.forEach(function (r) {
      const id = String(r[0] || '');
      if (id.indexOf(prefix) === 0) {
        const n = parseInt(id.slice(prefix.length), 10);
        if (n > max) max = n;
      }
    });
  }
  return prefix + String(max + 1).padStart(3, '0');
}

/** Header map keyed by PIERCE_HEADERS; uses the project's getColumnMap() when this file lives in the main project. */
function pierceColumnMap_(sheet) {
  try {
    if (typeof getColumnMap === 'function') {
      const cm = getColumnMap();
      if (cm && cm.OTR_ID !== undefined && cm.OTR_ID > -1) return cm;
    }
  } catch (err) {
    console.warn('getColumnMap() unavailable, reading headers directly:', err);
  }
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });
  const cols = {};
  Object.keys(PIERCE_HEADERS).forEach(function (key) {
    for (let a = 0; a < PIERCE_HEADERS[key].length; a++) {
      const idx = headers.indexOf(PIERCE_HEADERS[key][a].toLowerCase());
      if (idx > -1) { cols[key] = idx; return; }
    }
  });
  return cols;
}

function pierceAppendNote_(sheet, cols, row, note) {
  if (cols.FILING_NOTES === undefined) return;
  const cell = sheet.getRange(row, cols.FILING_NOTES + 1);
  const cur = String(cell.getValue() || '');
  cell.setValue(cur ? cur + '\n' + note : note);
}

// ============================================================================
// ATTORNEY NOTIFICATION
// ============================================================================

function pierceNotifyAttorney_(kind, d, clientId, brand, row) {
  const name = ((d.firstName || '') + ' ' + (d.lastName || '')).trim() || '(no name)';
  const amount = d.amountPaid ? '$' + d.amountPaid : '';
  let subject, lead;
  if (kind === 'DUI') {
    subject = '🚨 DUI consult request: ' + name + ' — call back (' + clientId + ')';
    lead = 'Someone filled out the DUI consultation form. The site told them you will call shortly.';
  } else if (kind === 'DUPLICATE') {
    subject = '⚠️ DUPLICATE website payment: ' + name + ' ' + amount + ' — refund? (' + clientId + ')';
    lead = 'A second Stripe payment came in for an email already on the Dashboard. No new row was created. ' +
      'If it is the same ticket, refund the second charge in Stripe.';
  } else {
    subject = '💵 Website signup: ' + name + ' — ' + (d.courtName || 'court ?') + ' ' + amount + ' (' + clientId + ')';
    lead = 'Paid signup through ' + brand.name + '. Row created on the Dashboard. ' +
      'To decline: refund in Stripe, then close the row.';
  }

  const rows = [
    ['Client', name], ['Email', d.email], ['Phone', d.phone], ['Court', d.courtName],
    ['Citation #', d.citationNumber], ['Citation date', d.citationDate], ['Violation', d.violations],
    ['Hearing date given', d.courtDate], ['Amount', amount], ['Stripe session', d.paymentId],
    ['Source', d.source], ['Dashboard row', row ? String(row) : ''], ['Case id', clientId],
  ];
  if (kind === 'DUI') rows.push(['DUI details', pierceDuiDetails_(d).replace(/\n/g, '<br>')]);

  const table = rows.filter(function (r) { return r[1]; }).map(function (r) {
    return '<tr><td style="padding:3px 10px 3px 0;color:#555;white-space:nowrap">' + r[0] +
      '</td><td style="padding:3px 0">' + (r[0] === 'DUI details' ? r[1] : pierceEsc_(String(r[1]))) + '</td></tr>';
  }).join('');

  const html = '<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;max-width:640px">' +
    '<p>' + pierceEsc_(lead) + '</p><table>' + table + '</table>' +
    '<p style="margin-top:14px">' +
    '<a href="https://docs.google.com/spreadsheets/d/' + PIERCE_SPREADSHEET_ID + '">Open the Dashboard</a> · ' +
    (d.email ? '<a href="https://dashboard.stripe.com/payments?query=' + encodeURIComponent(d.email) + '">Stripe payments for this email</a> · ' : '') +
    (d.email ? '<a href="mailto:' + pierceEsc_(d.email) + '">Email the client</a>' : '') +
    '</p></div>';

  pierceSafeNotify_(subject, html);
}

function pierceSafeNotify_(subject, html) {
  try {
    MailApp.sendEmail({ to: PIERCE_NOTIFY_TO, subject: subject, htmlBody: html, name: 'Website intake' });
  } catch (err) {
    console.error('Attorney notification failed:', err);
  }
}

// ============================================================================
// CLIENT WELCOME / RECEIPT EMAIL  (paid intakes; gated by PIERCE_SEND_CLIENT_WELCOME)
// ============================================================================

function pierceSendClientWelcome_(d, clientId, brand) {
  const clientName = ((d.firstName || '') + ' ' + (d.lastName || '')).trim();
  const caseRef = clientId || d.citationNumber || '';
  const today = Utilities.formatDate(new Date(), 'America/Los_Angeles', 'MMMM d, yyyy');
  const amount = Number(d.amountPaid || 0).toFixed(2);

  const html = '<!DOCTYPE html><html><body style="font-family:Georgia,serif;line-height:1.6;color:#333;max-width:700px;margin:0 auto;padding:20px">' +
    '<div style="text-align:center;border-bottom:2px solid #1e3a5f;padding-bottom:16px;margin-bottom:24px">' +
    '<h1 style="color:#1e3a5f;margin:0;font-size:22px">' + pierceEsc_(brand.name.toUpperCase()) + '</h1>' +
    '<p style="color:#666;margin:4px 0 0">Rivercrest Law PLLC | Sebastian Miller, Attorney at Law | WSBA #50261</p></div>' +
    '<p><strong>Date:</strong> ' + today + '<br><strong>To:</strong> ' + pierceEsc_(clientName) +
    '<br><strong>Re:</strong> Payment receipt &amp; legal representation</p>' +
    '<div style="background:#f5f5f5;padding:14px;border-radius:5px">' +
    '<p style="margin:4px 0"><strong>Client:</strong> ' + pierceEsc_(clientName) + '</p>' +
    (caseRef ? '<p style="margin:4px 0"><strong>Your case number:</strong> ' + pierceEsc_(caseRef) + '</p>' : '') +
    '<p style="margin:4px 0"><strong>Court:</strong> ' + pierceEsc_(d.courtName || 'To be determined') + '</p>' +
    (d.citationNumber ? '<p style="margin:4px 0"><strong>Citation #:</strong> ' + pierceEsc_(d.citationNumber) + '</p>' : '') +
    (d.violations ? '<p style="margin:4px 0"><strong>Alleged violation:</strong> ' + pierceEsc_(d.violations) + '</p>' : '') +
    '<p style="margin:4px 0"><strong>Fee paid:</strong> $' + amount + '</p>' +
    '<p style="margin:4px 0"><strong>Payment confirmation #:</strong> ' + pierceEsc_(d.paymentId || '') + '</p></div>' +
    '<div style="background:#e8f4e8;padding:14px;border-left:4px solid #2d6a2d;margin:18px 0">' +
    '<strong>Thank you for retaining ' + pierceEsc_(brand.name) + '.</strong> Your payment has been received. ' +
    'This email is your receipt. The attached Representation Agreement sets out the terms of the engagement. Please save both.</div>' +
    '<h3 style="color:#1e3a5f;border-bottom:1px solid #ddd;padding-bottom:4px">Scope &amp; key terms (summary)</h3>' +
    '<ol style="font-size:14px">' +
    '<li><strong>Traffic infractions only.</strong> This representation covers your civil traffic infraction. It does not include criminal matters of any kind, including criminal traffic offenses (DUI, reckless driving, driving while license suspended). If your citation involves a criminal charge, contact us before relying on this engagement.</li>' +
    '<li><strong>Tickets submitted past the response deadline.</strong> If your ticket reached us after the court\'s response deadline had passed, the firm will either decline the case and refund your payment, or offer to proceed for an additional fee to address the late response. We will contact you before any additional fee is charged.</li>' +
    '<li><strong>Services included.</strong> Case review, discovery requests, negotiation with the prosecutor, and court appearances through final disposition of the infraction.</li>' +
    '<li><strong>Flat fee.</strong> The fee paid covers attorney services for this matter. Court-imposed fines, fees, or penalties remain your responsibility if the case is not dismissed.</li>' +
    '<li><strong>No guarantee.</strong> The firm will provide competent representation but cannot guarantee any particular outcome.</li></ol>' +
    '<div style="background:#fff8e1;padding:14px;border-left:4px solid #b8860b;margin:18px 0">' +
    '<strong>If you receive new insurance or vehicle registration information</strong> (for example, proof of insurance for an insurance citation), email it to ' +
    '<a href="mailto:' + brand.email + '">' + brand.email + '</a> and put <strong>your case number' + (caseRef ? ' (' + pierceEsc_(caseRef) + ')' : '') +
    '</strong> in the subject line.</div>' +
    '<h3 style="color:#1e3a5f;border-bottom:1px solid #ddd;padding-bottom:4px">Next steps</h3>' +
    '<ol style="font-size:14px"><li>I will file a Notice of Appearance with the court.</li>' +
    '<li>I will request discovery (the evidence) from the prosecutor.</li>' +
    '<li>You will receive an email when your hearing date is confirmed.</li>' +
    '<li>You do NOT need to appear in court. I will appear on your behalf.</li></ol>' +
    '<p style="margin-top:24px;border-top:1px solid #ddd;padding-top:14px">By making payment, you acknowledge receipt of this agreement and consent to representation under these terms.</p>' +
    '<p><strong>Sebastian Miller</strong><br>' + pierceEsc_(brand.name) + ' (Rivercrest Law PLLC)<br>WSBA #50261<br>' +
    pierceEsc_(brand.phone) + '<br>' + pierceEsc_(brand.email) + '</p>' +
    '<p style="font-size:12px;color:#666;border-top:2px solid #1e3a5f;padding-top:12px;margin-top:28px;text-align:center">' +
    pierceEsc_(brand.name) + ' | Washington State<br>This email serves as your receipt. The attached Representation Agreement governs the engagement.</p>' +
    '</body></html>';

  const attachments = [];
  const pdf = pierceAgreementBlob_(brand);
  if (pdf) attachments.push(pdf);

  const opts = {
    htmlBody: html,
    name: brand.name,
    replyTo: brand.email,
    cc: 'sebastian@rivercrestlaw.info',
    attachments: attachments,
  };
  // Send from the brand address when it is a verified send-as alias of this account.
  try {
    if (GmailApp.getAliases().indexOf(brand.email) > -1) opts.from = brand.email;
  } catch (err) { /* alias lookup needs the Gmail scope; fall back to the account address */ }

  GmailApp.sendEmail(
    d.email,
    'Payment received — your traffic infraction case' + (caseRef ? ' (' + caseRef + ')' : ''),
    'Your payment has been received. This email is your receipt; the representation agreement is attached.',
    opts
  );
  console.log('Welcome email sent to', d.email, 'attachment:', attachments.length ? 'yes' : 'NO');
}

function pierceAgreementBlob_(brand) {
  try {
    if (PIERCE_AGREEMENT_FILE_ID) {
      return DriveApp.getFileById(PIERCE_AGREEMENT_FILE_ID).getBlob().setName('Representation_Agreement.pdf');
    }
    const url = (brand && brand.site ? brand.site : 'https://piercedefense.com') + '/documents/representation-agreement.pdf';
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const type = String(res.getHeaders()['Content-Type'] || '');
    if (res.getResponseCode() === 200 && type.indexOf('pdf') > -1) {
      return res.getBlob().setName('Representation_Agreement.pdf');
    }
    console.warn('Agreement PDF not available at', url, res.getResponseCode(), type);
  } catch (err) {
    console.warn('Agreement PDF fetch failed:', err);
  }
  return null;
}

// ============================================================================
// CITATION PHOTO -> DRIVE
// ============================================================================

function pierceSaveCitation_(data) {
  const folder = DriveApp.getFolderById(PIERCE_CITATIONS_FOLDER_ID);
  const base64 = data.imageData.indexOf(',') > -1 ? data.imageData.split(',')[1] : data.imageData;
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64),
    'image/jpeg',
    data.fileName || ('citation_' + new Date().getTime() + '.jpg')
  );
  const file = folder.createFile(blob);
  file.setDescription(
    'Client: ' + (data.clientName || 'Unknown') + '\n' +
    'Court: ' + (data.courtName || 'Unknown') + '\n' +
    'Citation #: ' + (data.citationNumber || '') + '\n' +
    'Source: ' + (data.source || 'PIERCE_DEFENSE_WEBSITE') + '\n' +
    'Uploaded: ' + (data.uploadedAt || new Date().toISOString())
  );
  console.log('Citation saved:', file.getId(), data.clientName);
  return { success: true, fileId: file.getId() };
}

// ============================================================================
// HELPERS
// ============================================================================

function pierceBrand_(source) {
  return /SEATTLE/i.test(String(source || '')) ? PIERCE_BRANDS.SEATTLE : PIERCE_BRANDS.PIERCE;
}

function pierceStamp_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd HH:mm');
}

function pierceEsc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function pierceJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// RUN FROM THE EDITOR BEFORE DEPLOYING (authorizes scopes, exercises both paths)
// ============================================================================

function pierceTestWebhook() {
  const paid = doPost({ postData: { contents: JSON.stringify({
    secret: PIERCE_WEBHOOK_SECRET, source: 'PIERCE_DEFENSE_WEBSITE',
    firstName: 'Test', lastName: 'Website', email: 'support@rivercrestlaw.info', phone: '253-555-0000',
    courtName: 'Tacoma Municipal Court', citationNumber: 'TEST-123', citationDate: '2026-10-01',
    violations: 'Speeding 1-10 over', courtDate: '2026-11-15', paymentId: 'cs_test_FAKE', amountPaid: 199,
  }) } });
  console.log('Paid intake result: ' + paid.getContent());

  const dui = doPost({ postData: { contents: JSON.stringify({
    secret: PIERCE_WEBHOOK_SECRET, source: 'PIERCE_DEFENSE_DUI',
    firstName: 'Test', lastName: 'Dui', email: 'support@rivercrestlaw.info', phone: '253-555-0001',
    arrestDate: '2026-10-06', arrestLocation: 'Tacoma', bacLevel: '0.09', refusal: 'No', priorDuis: '0',
    licenseStatus: 'Valid', courtName: 'Pierce County District Court', notes: 'test notes',
  }) } });
  console.log('DUI intake result: ' + dui.getContent());
  console.log('Drive folder reachable: ' + DriveApp.getFolderById(PIERCE_CITATIONS_FOLDER_ID).getName());
  console.log('>>> Delete the two "Test" rows from the Dashboard when done.');
}

/** Sends the client welcome email to support@ only, so the body/attachment can be reviewed. */
function pierceTestWelcomeEmail() {
  pierceSendClientWelcome_({
    firstName: 'Test', lastName: 'Client', email: 'support@rivercrestlaw.info',
    courtName: 'Pierce County District Court', citationNumber: 'T00000000',
    violations: 'Speeding 11-15 over', paymentId: 'cs_test_FAKE', amountPaid: 199, source: 'PIERCE_DEFENSE_WEBSITE',
  }, 'PDL-TEST-001', PIERCE_BRANDS.PIERCE);
  console.log('Test welcome email sent to support@rivercrestlaw.info');
}
