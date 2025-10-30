const { google } = require('googleapis');
const readline = require('readline');

const GMAIL_CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your client ID
const GMAIL_CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Replace with your client secret

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

// Generate the url that will be used for authorization
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/'],
  prompt: 'consent'
});

console.log('Authorize this app by visiting this url:', authorizeUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the code from that page here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\nHere are your tokens:\n');
    console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('GMAIL_ACCESS_TOKEN=' + tokens.access_token);
    console.log('\nAdd these to your environment variables.');
  } catch (error) {
    console.error('Error getting tokens:', error);
  }
  rl.close();
});