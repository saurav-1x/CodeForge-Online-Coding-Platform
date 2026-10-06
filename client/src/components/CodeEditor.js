
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import API from "../services/api";

const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  java: 62,
};

function CodeEditor({ problem }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(
    "Run your code to see the output here."
  );
  const [loading, setLoading] = useState(false);

  // Load starter code when problem or language changes
  useEffect(() => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    } else if (language === "python") {
      setCode('print("Hello from CodeForge")');
    } else if (language === "javascript") {
      setCode('console.log("Hello from CodeForge");');
    } else {
      setCode(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from CodeForge");
    }
}`);
    }
  }, [problem, language]);

  // Run code without submitting it
  const handleRun = async () => {
    try {
      setLoading(true);
      setOutput("Running your code...");

      const response = await API.post("/code/run", {
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        stdin:
          problem?.testCases?.find((testCase) => !testCase.hidden)?.input ||
          "",
      });

      const result = response.data?.result;

      if (!result) {
        setOutput(
          response.data?.message || "No execution result received."
        );
      } else if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(result.stderr);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
      } else if (result.message) {
        setOutput(result.message);
      } else if (result.status?.description) {
        setOutput(result.status.description);
      } else {
        setOutput("Code executed but produced no output.");
      }
    } catch (error) {
      console.error("Run code error:", error);

      setOutput(
        error.response?.data?.message ||
          (error.response?.status === 401
            ? "Please login again."
            : "Could not run code. Check that the backend is running.")
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit solution for test-case evaluation
  const handleSubmit = async () => {
    if (!problem) {
      setOutput("Problem details are missing.");
      return;
    }

    try {
      setLoading(true);
      setOutput("Submitting your solution...");

      const problemId = problem.slug || problem._id || problem.id;

      const response = await API.post("/submissions/submit", {
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        problem_id: problemId,
      });

      const data = response.data;

      if (!data.success) {
        setOutput(data.message || "Submission failed.");
        return;
      }

      window.dispatchEvent(new Event("codeforge:submission-updated"));

      const status = data.status || "Pending";
      const passed = data.passedTests ?? 0;
      const total = data.totalTests ?? 0;

      if (status === "Accepted") {
        setOutput(
          `✅ Accepted\n\nAll ${passed}/${total} test cases passed!`
        );
      } else {
        const failedCase = data.testResults?.find(
          (testResult) => !testResult.passed
        );
        const failedCaseNumber = failedCase
          ? data.testResults.indexOf(failedCase) + 1
          : null;
        const details = failedCase
          ? failedCase.hidden
            ? `\n\nHidden test case ${failedCaseNumber} failed.`
            : `\n\nTest case ${failedCaseNumber}` +
              `\nExpected: ${failedCase.expected || "(no output)"}` +
              `\nYour output: ${failedCase.actual || "(no output)"}`
          : "";

        setOutput(
          `❌ ${status}\n\nPassed test cases: ${passed}/${total}` +
            details +
            (data.message ? `\n\n${data.message}` : "")
        );
      }
    } catch (error) {
      console.error("Submit code error:", error);

      setOutput(
        error.response?.data?.message ||
          (error.response?.status === 401
            ? "Please login again to submit your solution."
            : "Submission failed. Check the backend server and problem details.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-header">
        <div className="editor-language">
          <span>Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            disabled={loading}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="editor-status">
          <span className="status-dot"></span>
          {loading ? "Processing..." : "Ready"}
        </div>
      </div>

      <div className="monaco-container">
        <Editor
          height="520px"
          language={language}
          theme="vs"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            padding: { top: 15 },
            automaticLayout: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            readOnly: loading,
          }}
        />
      </div>

      <div className="editor-action-bar">
        <button
          className="run-button"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? "⏳ Running..." : "▶ Run Code"}
        </button>

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Submitting..." : "✓ Submit"}
        </button>
      </div>

      <div className="output-panel">
        <div className="output-header">
          <span>Output</span>
          <span className="output-label">Console</span>
        </div>

        <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
      </div>
    </div>
  );
}

export default CodeEditor;