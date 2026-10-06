import React from "react";
import { useParams, Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";

const problems = {
  "two-sum": {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],

    description: `
Given an array of integers nums and an integer target,
return the indices of the two numbers such that they add up to target.

You may assume that each input has exactly one solution.

You cannot use the same element twice.
`,

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],

    starterCode: {
      python: `def two_sum(nums, target):
    # Write your solution here
    pass
`,

      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
    },
  },

  "reverse-string": {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],

    description: `
Write a function that reverses a string.

The input string is given as an array of characters.
You must modify the input array in-place.
`,

    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
    ],

    starterCode: {
      python: `def reverse_string(s):
    # Write your solution here
    pass
`,

      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your solution here
    }
}`,
    },
  },

  "valid-parentheses": {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "String"],

    description: `
Given a string containing the characters '(', ')', '{', '}', '[' and ']',
determine if the input string is valid.

An input string is valid when every opening bracket
has the correct closing bracket.
`,

    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],

    starterCode: {
      python: `def is_valid(s):
    # Write your solution here
    return False
`,

      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
    },
  },

  "binary-tree-traversal": {
    id: 4,
    title: "Binary Tree Traversal",
    difficulty: "Hard",
    tags: ["Tree", "DFS"],

    description: `
Given the root of a binary tree, return the preorder traversal
of its nodes' values.

Preorder traversal visits:

1. Root
2. Left subtree
3. Right subtree
`,

    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,2,3]",
      },
    ],

    starterCode: {
      python: `def preorder_traversal(root):
    # Write your solution here
    return []
`,

      java: `import java.util.*;

class Solution {

    public List<Integer> preorderTraversal(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}`,
    },
  },
};

export default function Problem() {
  const { slug } = useParams();

  const problem = problems[slug];

  if (!problem) {
    return (
      <main className="problem-page">
        <div className="problem-not-found">
          <h1>Problem not found</h1>

          <p>
            The problem you are looking for does not exist.
          </p>

          <Link to="/problems">
            ← Back to Problems
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="problem-page">

      {/* LEFT SIDE */}
      <div className="problem-left">

        <div className="problem-title">

          <h1>
            {problem.id}. {problem.title}
          </h1>

          <span
            className={`difficulty ${problem.difficulty.toLowerCase()}`}
          >
            {problem.difficulty}
          </span>

        </div>

        <div className="tags">

          {problem.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}

        </div>

        <section className="question-section">

          <h2>Problem Description</h2>

          <p style={{ whiteSpace: "pre-line" }}>
            {problem.description}
          </p>

        </section>

        <section className="question-section">

          <h2>Examples</h2>

          {problem.examples.map((example, index) => (

            <div
              className="example-box"
              key={index}
            >

              <strong>
                Example {index + 1}
              </strong>

              <p>
                <b>Input:</b>
              </p>

              <pre>
                {example.input}
              </pre>

              <p>
                <b>Output:</b>
              </p>

              <pre>
                {example.output}
              </pre>

            </div>

          ))}

        </section>

      </div>

      {/* RIGHT SIDE */}
      <div className="problem-right">

        <CodeEditor problem={problem} />

      </div>

    </main>
  );
}