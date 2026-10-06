const axios = require("axios");

const baseURL = process.env.JUDGE0_URL || "https://ce.judge0.com";

async function submitAndWait({ source_code, language_id, stdin }) {
  const response = await axios.post(
    `${baseURL}/submissions?base64_encoded=false&wait=true`,
    { source_code, language_id, stdin: stdin || "" },
    { headers: { "Content-Type": "application/json" }, timeout: 30000 }
  );

  return response.data;
}

async function getLanguages() {
  const response = await axios.get(`${baseURL}/languages`);
  return response.data;
}

module.exports = { submitAndWait, getLanguages };
