
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const { submitAndWait } = require("../services/judge0Service");

const submitCode = async (req, res) => {
  try {
    const { source_code, language_id, problem_id } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to submit code.",
      });
    }

    if (!source_code?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Source code is required.",
      });
    }

    const languageId = Number(language_id);

    const languages = {
      62: "Java",
      63: "JavaScript",
      71: "Python",
    };

    if (!languages[languageId]) {
      return res.status(400).json({
        success: false,
        message: "Only JavaScript, Python, and Java are supported.",
      });
    }

    // Find the actual MongoDB problem document.
    const problem = await Problem.findOne({
      $or: [
        ...(mongooseIsObjectId(problem_id)
          ? [{ _id: problem_id }]
          : []),
        { slug: String(problem_id) },
      ],
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found in database.",
      });
    }

    const testCases = problem.testCases || [];

    if (testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases configured for this problem.",
      });
    }

    const outcomes = await Promise.all(
      testCases.map(async (testCase) => {
        const result = await submitAndWait({
          source_code,
          language_id: languageId,
          stdin: testCase.input || "",
        });
        const executionError =
          result.status?.id !== 3 ||
          Boolean(result.stderr) ||
          Boolean(result.compile_output);
        const actual = (result.stdout || "").trim();
        const passed =
          !executionError &&
          normalizeOutput(actual) === normalizeOutput(testCase.output);

        return { testCase, result, actual, executionError, passed };
      })
    );

    const passedTests = outcomes.filter((outcome) => outcome.passed).length;
    const firstFailure = outcomes.find((outcome) => !outcome.passed);
    const status = firstFailure
      ? firstFailure.executionError
        ? firstFailure.result.status?.description || "Execution Error"
        : "Wrong Answer"
      : "Accepted";
    const errorMessage = firstFailure?.executionError
      ? firstFailure.result.stderr ||
        firstFailure.result.compile_output ||
        firstFailure.result.message ||
        firstFailure.result.status?.description ||
        "Execution did not complete successfully."
      : firstFailure
        ? "Output did not match the expected result."
        : "";
    const testResults = outcomes.map((outcome) => ({
      passed: outcome.passed,
      hidden: Boolean(outcome.testCase.hidden),
      ...(!outcome.testCase.hidden
        ? {
            expected: outcome.testCase.output,
            actual: outcome.actual,
          }
        : {}),
      ...(outcome.executionError
        ? {
            error:
              outcome.result.stderr ||
              outcome.result.compile_output ||
              outcome.result.status?.description ||
              "Execution did not complete successfully.",
          }
        : {}),
    }));

    await Submission.create({
      user: userId,
      problem: problem._id,
      language: languages[languageId],
      languageId,
      code: source_code,
      status,
      passedTests,
      totalTests: testCases.length,
      error: errorMessage,
    });

    return res.json({
      success: true,
      status,
      passedTests,
      totalTests: testCases.length,
      ...(errorMessage ? { message: errorMessage } : {}),
      testResults,
    });
  } catch (error) {
    console.error("Submission error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Submission failed.",
    });
  }
};

function normalizeOutput(output) {
  return String(output)
    .trim()
    .replace(/\s*([,\[\]\{\}:])\s*/g, "$1")
    .replace(/\s+/g, " ");
}

function mongooseIsObjectId(value) {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}

const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to view submissions.",
      });
    }

    const submissions = await Submission.find({ user: userId })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 });

    return res.json({ success: true, submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not load submission history.",
    });
  }
};

module.exports = {
  submitCode,
  getMySubmissions,
};