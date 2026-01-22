/**
 * Google Apps Script - Citation Upload Webhook
 *
 * Deploy this as a Web App to receive citation images from the Pierce Defense website
 * and save them to your Google Drive citations folder.
 *
 * SETUP:
 * 1. Go to script.google.com and create a new project
 * 2. Paste this code
 * 3. Update the CITATIONS_FOLDER_ID below with your folder ID
 * 4. Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and add it to Vercel as CITATION_UPLOAD_WEBHOOK_URL
 */

// Your citations folder ID
const CITATIONS_FOLDER_ID = '1fhsJOvtZp6SWg8PeQmlFwNFKMd1KPL7q';

/**
 * Handle POST requests from the website
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const {
      imageData,      // base64 encoded image
      fileName,       // suggested filename
      clientName,     // client's name
      courtName,      // court name
      citationNumber, // citation number if available
      source,         // PIERCE_DEFENSE_WEBSITE or SEATTLE_DEFENSE_WEBSITE
      uploadedAt      // timestamp
    } = data;

    if (!imageData) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'No image data provided' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get the citations folder
    const folder = DriveApp.getFolderById(CITATIONS_FOLDER_ID);

    // Decode base64 image
    const decodedImage = Utilities.base64Decode(imageData);
    const blob = Utilities.newBlob(decodedImage, 'image/jpeg', fileName);

    // Create the file in Drive
    const file = folder.createFile(blob);

    // Add description with metadata
    const description = [
      `Client: ${clientName || 'Unknown'}`,
      `Court: ${courtName || 'Unknown'}`,
      `Citation #: ${citationNumber || 'N/A'}`,
      `Source: ${source || 'Website'}`,
      `Uploaded: ${uploadedAt || new Date().toISOString()}`
    ].join('\n');

    file.setDescription(description);

    // Log the upload
    console.log(`Citation uploaded: ${fileName} for ${clientName}`);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileName: file.getName(),
        fileUrl: file.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Citation upload error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString(),
        success: false
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Citation Upload Webhook is running',
      folderId: CITATIONS_FOLDER_ID
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify folder access
 */
function testFolderAccess() {
  try {
    const folder = DriveApp.getFolderById(CITATIONS_FOLDER_ID);
    console.log('Folder name:', folder.getName());
    console.log('Folder access OK');
  } catch (error) {
    console.error('Cannot access folder:', error);
  }
}
