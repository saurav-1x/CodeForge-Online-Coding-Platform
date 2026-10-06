const { submitAndWait } = require("../services/judge0Service");

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

    const languageId = Number(language_id);

    if (![62, 63, 71].includes(languageId)) {
      return res.status(400).json({
        success: false,
        message: "Only JavaScript, Python, and Java are supported"
      });
    }

    const result = await submitAndWait({
      source_code,
      language_id: languageId,
      stdin: stdin || ""
    });

    return res.json({
      success: true,
      result
    });

  } catch (error) {
    console.error("Judge0 Error:", error.response?.data || error.message);

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