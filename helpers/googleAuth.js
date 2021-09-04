const {OAuth2Client} = require('google-auth-library');
const { model } = require('mongoose');

//To get access to local .env file's variable
require('dotenv').config();

const client = new OAuth2Client(process.env.CLIENT_ID);
async function verifyAccount(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  
      
  });
  const payload = ticket.getPayload();
  const emailid = payload['email'];
  return emailid; 
}

module.exports={verifyAccount};