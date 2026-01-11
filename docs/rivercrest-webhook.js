/**
 * PIERCE DEFENSE WEBSITE WEBHOOK
 *
 * Handles traffic citation intakes from piercecountydefense.com
 * Adds new cases to Dashboard with PDL- prefix (distinct from OTR- cases)
 */

/**
 * Handles POST requests from Pierce Defense website
 * Traffic citations only - DUIs go to separate sheet
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Only accept requests from our website
    if (data.source !== 'PIERCE_DEFENSE_WEBSITE') {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid source'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get the Dashboard sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Dashboard');
    const cols = getColumnMap();

    // Generate unique PDL client ID (distinct from OTR IDs)
    const clientId = generatePDLClientId();

    // Prepare new row data
    const newRow = new Array(Object.keys(cols).length).fill('');

    // Client ID in column A (OTR_ID column) - PDL prefix distinguishes from OTR cases
    newRow[cols.OTR_ID] = clientId;

    // Core client info
    newRow[cols.FIRST_NAME] = data.firstName || '';
    newRow[cols.LAST_NAME] = data.lastName || '';
    newRow[cols.EMAIL] = data.email || '';
    newRow[cols.PHONE] = data.phone || '';

    // Citation info
    newRow[cols.COURT_NAME] = data.courtName || '';
    newRow[cols.CITATION_NUMBER] = data.citationNumber || '';
    newRow[cols.CITATION_DATE] = data.citationDate || '';
    newRow[cols.VIOLATIONS] = data.violations || '';

    // Dates
    newRow[cols.COURT_DATE] = data.courtDate || '';
    newRow[cols.REQUEST_DATE] = new Date();

    // Status
    newRow[cols.CASE_STATUS] = 'NEW_INTAKE';
    newRow[cols.CASE_TAGS] = 'WEBSITE_INTAKE';

    // Payment info in filing notes
    if (data.paymentId) {
      newRow[cols.FILING_NOTES] = `Website payment: $${data.amountPaid || ''} | Stripe: ${data.paymentId}`;
    }

    // Append the new row
    sheet.appendRow(newRow);

    console.log('New website intake:', clientId, data.firstName, data.lastName, data.courtName);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      clientId: clientId,
      message: 'Case added to Dashboard'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('doPost error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Generate unique PDL client ID
 * Format: PDL-YYMMDD-XXX (e.g., PDL-250109-001)
 */
function generatePDLClientId() {
  const now = new Date();
  const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyMMdd');

  // Get today's count from Dashboard
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Dashboard');
  const data = sheet.getDataRange().getValues();

  // Count existing PDL IDs from today
  const todayPrefix = `PDL-${dateStr}-`;
  let maxNum = 0;

  for (let i = 1; i < data.length; i++) {
    const id = data[i][0]; // Column A
    if (id && id.toString().startsWith(todayPrefix)) {
      const num = parseInt(id.toString().split('-')[2], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  const nextNum = String(maxNum + 1).padStart(3, '0');
  return `${todayPrefix}${nextNum}`;
}

/**
 * Test function - run from Apps Script editor to verify setup
 */
function testWebsiteIntake() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        source: 'PIERCE_DEFENSE_WEBSITE',
        firstName: 'Test',
        lastName: 'Website',
        email: 'test@example.com',
        phone: '253-555-0000',
        courtName: 'Tacoma Municipal Court',
        citationNumber: 'TEST-123',
        violations: 'Speeding 1-10 over',
        courtDate: '2025-02-15',
        paymentId: 'pi_test_123',
        amountPaid: 179
      })
    }
  };

  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
