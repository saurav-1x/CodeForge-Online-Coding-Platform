const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const {
      source_code,
      language_id,
      stdin
    } = req.body;

    if (!source_code) {
      return res.status(400).json({
        success: false,
        message: "Source code is required"
      });
    }

    if (!language_id) {
      return res.status(400).json({
        success: false,
        message: "Language ID is required"
      });
    }

    console.log("Running code...");
    console.log("Language ID:", language_id);

    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: source_code,
        language_id: Number(language_id),
        stdin: stdin || ""
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Judge0 response:", response.data);

    return res.json({
      success: true,
      result: response.data
    });

  } catch (error) {

    console.error(
      "Judge0 Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Code execution failed"
    });
  }
};

module.exports = {
  runCode
};