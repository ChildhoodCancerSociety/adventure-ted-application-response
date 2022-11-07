import * as dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import open from "open";

dotenv.config();


export const port = process.env.PORT ?? 3840;
export const env = process.env.NODE_ENV ?? "development";
export const clientId =
  process.env.API_CLIENT_ID ??
  (() => {
    console.warn("NO CLIENT ID PRESENT");
    return "";
  })();

export const clientSecret =
  process.env.API_SECRET ??
  (() => {
    console.warn("NO CLIENT SECRET PRESENT");
    return "";
  })();

export const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "http://localhost:3000");
const scopes = ["https://www.googleapis.com/auth/forms.responses.readonly"];

let auth: null | OAuth2Client = null;
export const getAuth = () => auth;
export const setAuth = async (token: string) => {
  console.log(token);
  const { tokens } = await oauth2Client.getToken(token);
  console.log(tokens);
  oauth2Client.setCredentials(tokens);
  auth = oauth2Client;
  return auth;
};

export const grabFormResponses = async () => {
  const d = await google.forms({ version: "v1", auth: oauth2Client }).forms.get({ formId: "1pQYGjtpwl6MBc16MbzONI6_dkXHsxeIfN7T0Fr1ZRTk" }).catch(e => {
    return e;
  });
  console.log(d);
}

export const login = async () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  open(url);
};

export const createAuthAurl = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  return url;
};
