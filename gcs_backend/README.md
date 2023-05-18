# Getting Started with Node JS App

This project was bootstrapped with express.

## Available Scripts

In the project directory, create a service_account_key.json file and put this code bellow with your GCS credentials:

```json
{
  "type": "service_account",
  "project_id": "**",
  "private_key_id": "**",
  "private_key": "**",
  "client_email": "**",
  "client_id": "**",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "**",
  "universe_domain": "googleapis.com"
}

```


In the project directory, you can run:

### `node file-upload.js`

Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view it in your browser.
