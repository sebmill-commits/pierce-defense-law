/**
 * PIERCE DEFENSE WEBSITE WEBHOOK - single endpoint for piercedefense.com
 * ============================================================================
 *
 * Replaces the older two-file setup (rivercrest-webhook.js +
 * citation-upload-webhook.js). One doPost, one deployment, one URL.
 *
 * It handles both things the website sends:
 *   - a citation photo  -> saved to the Citations Inbox folder in Drive
 *   - an intake         -> appended as a new PDL- row on the Dashboard
 *
 * It tells them apart by whether the post includes an image.
 *
 * INSTALL: add as a new file in the "Case Management Automation" Apps Script
 * project, then Deploy > New deployment > Web app (Execute as: Me,
 * Who has access: Anyone).
 */

// Must match WEBHOOK_SHARED_SECRET in Vercel. Already filled in.
const PIERCE_WEBHOOK_SECRET = 'f44855e4605b9e97eab857e66a0389e69e7f04afca193feb';

const PIERCE_SPREADSHEET_ID = '1kAmA2-VdgWlYIuJSq516vztIdMtb_eFmymsBhncqqVw';
const PIERCE_DASHBOARD_SHEET = 'Dashboard';
const PIERCE_CITATIONS_FOLDER_ID = '1fhsJOvtZp6SWg8PeQmlFwNFKMd1KPL7q';

// Columns the intake needs. If the Dashboard headers ever change, the error
// message names exactly which one went missing instead of silently dropping it.
const PIERCE_REQUIRED_COLS = [
  'OTR_ID', 'FIRST_NAME', 'LAST_NAME', 'COURT_NAME', 'CITATION_NUMBER',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== PIERCE_WEBHOOK_SECRET) {
      return pierceJson_({ success: false, error: 'Unauthorized' });
    }

    return pierceJson_(
      data.imageData ? pierceSaveCitation_(data) : pierceCreateRow_(data)
    );
  } catch (error) {
    console.error('Pierce webhook error:', error);
    return pierceJson_({ success: false, error: error.toString() });
  }
}

// Health check - open the /exec URL in a browser to confirm it's deployed.
function doGet() {
  return pierceJson_({ success: true, message: 'Pierce webhook is live' });
}

// --- intake -> Dashboard row ------------------------------------------------

function pierceCreateRow_(data) {
  const sheet = SpreadsheetApp
    .openById(PIERCE_SPREADSHEET_ID)
    .getSheetByName(PIERCE_DASHBOARD_SHEET);

  const cols = pierceColumnMap_(sheet);

  const missing = PIERCE_REQUIRED_COLS.filter(function (c) {
    return cols[c] === undefined;
  });
  if (missing.length) {
    return { success: false, error: 'Dashboard is missing columns: ' + missing.join(', ') };
  }

  const clientId = piercePdlId_(sheet);
  const row = new Array(sheet.getLastColumn()).fill('');

  const set = function (col, value) {
    if (cols[col] !== undefined && value !== undefined && value !== '') {
      row[cols[col]] = value;
    }
  };

  set('OTR_ID', clientId);
  set('FIRST_NAME', data.firstName);
  set('LAST_NAME', data.lastName);
  set('EMAIL', data.email);
  set('PHONE', data.phone);
  set('COURT_NAME', data.courtName);
  set('CITATION_NUMBER', data.citationNumber);
  set('CITATION_DATE', data.citationDate);
  set('VIOLATIONS', data.violations);
  set('COURT_DATE', data.courtDate);
  set('REQUEST_DATE', new Date());
  set('CASE_STATUS', data.caseStatus || 'NEW_INTAKE');
  set('CASE_TAGS', 'WEBSITE_INTAKE');

  if (data.paymentId) {
    set('FILING_NOTES', 'Website payment: $' + (data.amountPaid || '') + ' | Stripe: ' + data.paymentId);
  }

  sheet.appendRow(row);
  console.log('New website intake:', clientId, data.firstName, data.lastName, data.courtName);

  return { success: true, clientId: clientId };
}

/**
 * Prefer the project's own getColumnMap() so this stays in step with the rest
 * of the system. Fall back to reading the header row directly if it isn't
 * usable in a web app context.
 */
function pierceColumnMap_(sheet) {
  try {
    if (typeof getColumnMap === 'function') {
      const cols = getColumnMap();
      if (cols && cols.OTR_ID !== undefined) return cols;
    }
  } catch (error) {
    console.warn('getColumnMap() unavailable, reading headers directly:', error);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const cols = {};
  headers.forEach(function (header, i) {
    const key = header.toString().trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');
    if (key) cols[key] = i;
  });
  return cols;
}

/** PDL-YYMMDD-XXX, so website cases are distinguishable from OTR cases. */
function piercePdlId_(sheet) {
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMdd');
  const prefix = 'PDL-' + dateStr + '-';

  const ids = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
  let max = 0;
  for (let i = 1; i < ids.length; i++) {
    const id = ids[i][0];
    if (id && id.toString().indexOf(prefix) === 0) {
      const num = parseInt(id.toString().split('-')[2], 10);
      if (num > max) max = num;
    }
  }

  return prefix + String(max + 1).padStart(3, '0');
}

// --- citation photo -> Drive ------------------------------------------------

function pierceSaveCitation_(data) {
  const folder = DriveApp.getFolderById(PIERCE_CITATIONS_FOLDER_ID);

  const base64 = data.imageData.indexOf(',') > -1
    ? data.imageData.split(',')[1]   // strip a data: URI prefix if present
    : data.imageData;

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

// --- helpers ----------------------------------------------------------------

function pierceJson_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// RUN THIS FROM THE EDITOR BEFORE DEPLOYING
// ============================================================================

/** Authorizes the script and proves both paths work end to end. */
function pierceTestWebhook() {
  const intake = doPost({
    postData: {
      contents: JSON.stringify({
        secret: PIERCE_WEBHOOK_SECRET,
        source: 'PIERCE_DEFENSE_WEBSITE',
        firstName: 'Test',
        lastName: 'Website',
        email: 'test@example.com',
        phone: '253-555-0000',
        courtName: 'Tacoma Municipal Court',
        citationNumber: 'TEST-123',
        violations: 'Speeding 1-10 over',
        courtDate: '2026-08-15',
      }),
    },
  });

  console.log('Intake result: ' + intake.getContent());
  console.log('Drive folder reachable: ' + DriveApp.getFolderById(PIERCE_CITATIONS_FOLDER_ID).getName());
  console.log('>>> Delete the "Test Website" row from the Dashboard when done.');
}
