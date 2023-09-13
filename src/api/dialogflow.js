import axios from "axios";
import { gapi } from "gapi-script";

// DialogFlow API endpoint URL
const { REACT_APP_DIALOG_FLOW_URL: dialogflowUrl } = process.env;
// let { REACT_APP_SECRET_KEY: SECRET_KEY } = process.env;

async function getAccessToken() {
  const auth2 = await gapi.auth2.getAuthInstance();

  await auth2.signIn();
  const user = auth2.currentUser.get();
  const { access_token: accessToken } = user.getAuthResponse();
  return accessToken;
}

async function detectIntent({
  token_exist,
  projectId,
  sessionId,
  queryInput,
  token,
}) {
  const URL = `${dialogflowUrl}/${projectId}/agent/sessions/${sessionId}:detectIntent`;
  const accessToken = token_exist ? token : await getAccessToken();

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const response = await axios.post(URL, queryInput, { headers });
    return { data: response.data, token: accessToken };
  } catch (err) {
    return detectIntent({
      token_exist: false,
      projectId,
      sessionId,
      queryInput,
      token,
    });
  }
}

export default detectIntent;
