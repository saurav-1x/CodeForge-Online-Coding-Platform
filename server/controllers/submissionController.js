
const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

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

    if (![71, 62].includes(languageId)) {
      return res.status(400).json({
        success: false,
        message: "Only Python and Java are supported.",
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

    // This runner currently supports the Two Sum problem only.
    if (problem.slug !== "two-sum") {
      return res.status(400).json({
        success: false,
        message: "Automated submission is currently enabled for Two Sum only.",
      });
    }

    let allPassed = true;
    let passedTests = 0;
    let errorMessage = "";
    const testResults = [];

    // Use known test cases for Two Sum.
    const twoSumCases = [
      { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
      { nums: [3, 2, 4], target: 6, expected: [1, 2] },
    ];

    for (const testCase of twoSumCases) {
      let testCode;

      if (languageId === 71) {
        testCode = `
import json
${source_code}

result = two_sum(${JSON.stringify(testCase.nums)}, ${testCase.target})
print(json.dumps(result))
`;
      } else {
        testCode = `
import java.util.*;
${source_code}

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {${testCase.nums.join(",")}};
        int target = ${testCase.target};
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}
`;
      }

      const judgeResponse = await axios.post(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: testCode,
          language_id: languageId,
          stdin: "",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = judgeResponse.data;

      if (
        !result.status ||
        result.status.id !== 3 ||
        result.stderr ||
        result.compile_output
      ) {
        allPassed = false;
        errorMessage =
          result.stderr ||
          result.compile_output ||
          result.status?.description ||
          "Execution did not complete successfully.";

        testResults.push({
          expected: testCase.expected,
          actual: result.stdout?.trim() || "",
          passed: false,
          error: errorMessage,
        });

        continue;
      }

      const output = (result.stdout || "").trim();
      let actual;

      try {
        actual = JSON.parse(output);
      } catch {
        const cleaned = output.replace(/^\[/, "").replace(/\]$/, "").trim();
        actual = cleaned
          ? cleaned.split(",").map((value) => Number(value.trim()))
          : [];
      }

      const passed =
        Array.isArray(actual) &&
        actual.length === testCase.expected.length &&
        actual.every((value, index) => value === testCase.expected[index]);

      if (passed) {
        passedTests++;
      } else {
        allPassed = false;
      }

      testResults.push({
        expected: testCase.expected,
        actual,
        passed,
      });
    }

    const status = allPassed ? "Accepted" : "Wrong Answer";

    await Submission.create({
      user: userId,
      problem: problem._id,
      language: languageId === 71 ? "Python" : "Java",
      languageId,
      code: source_code,
      status,
      passedTests,
      totalTests: twoSumCases.length,
      error: errorMessage,
    });

    return res.json({
      success: true,
      status,
      passedTests,
      totalTests: twoSumCases.length,
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