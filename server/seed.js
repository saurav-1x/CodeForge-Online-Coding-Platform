require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],

    description:
      "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",

    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] = 2 + 7 = 9."
      }
    ],

    starterCode: {
      javascript: `const fs = require("fs");

function twoSum(nums, target) {
  // Write your solution here
}

const input = fs.readFileSync(0, "utf8").trim().split("\\n");

const nums = input[0].trim().split(/\\s+/).map(Number);
const target = Number(input[1]);

console.log(JSON.stringify(twoSum(nums, target)));`,

      python: `def twoSum(nums, target):
    # Write your solution here
    pass

import sys
import json

lines = sys.stdin.read().strip().splitlines()

nums = list(map(int, lines[0].split()))
target = int(lines[1])

print(json.dumps(twoSum(nums, target), separators=(",", ":")))`
    },

    testCases: [
      {
        input: "2 7 11 15\n9",
        output: "[0,1]",
        hidden: false
      },
      {
        input: "3 2 4\n6",
        output: "[1,2]",
        hidden: true
      }
    ]
  },

  {
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],

    description:
      "Given a string, return the string in reverse order.",

    examples: [
      {
        input: "hello",
        output: "olleh",
        explanation: "The characters are reversed."
      }
    ],

    starterCode: {
      javascript: `const fs = require("fs");

function reverseString(s) {
  // Write your solution here
}

const input = fs.readFileSync(0, "utf8").trim();

console.log(reverseString(input));`,

      python: `def reverseString(s):
    # Write your solution here
    pass

import sys

s = sys.stdin.read().strip()

print(reverseString(s))`
    },

    testCases: [
      {
        input: "hello",
        output: "olleh",
        hidden: false
      },
      {
        input: "code",
        output: "edoc",
        hidden: true
      }
    ]
  },

  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Medium",
    tags: ["String", "Stack"],

    description:
      "Given a string containing parentheses, determine if the input string is valid. An input is valid if every opening bracket has a corresponding closing bracket in the correct order.",

    examples: [
      {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are correctly closed."
      },
      {
        input: "([)]",
        output: "false",
        explanation: "The brackets are not closed in the correct order."
      }
    ],

    starterCode: {
      javascript: `const fs = require("fs");

function isValid(s) {
  // Write your solution here
}

const input = fs.readFileSync(0, "utf8").trim();

console.log(isValid(input));`,

      python: `def isValid(s):
    # Write your solution here
    pass

import sys

s = sys.stdin.read().strip()

print(str(isValid(s)).lower())`
    },

    testCases: [
      {
        input: "()[]{}",
        output: "true",
        hidden: false
      },
      {
        input: "([)]",
        output: "false",
        hidden: true
      }
    ]
  },

  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],

    description:
      "Given a sorted array of integers and a target value, return the index of the target. Return -1 if the target does not exist.",

    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "The value 9 is present at index 4."
      }
    ],

    starterCode: {
      javascript: `const fs = require("fs");

function search(nums, target) {
  // Write your solution here
}

const input = fs.readFileSync(0, "utf8").trim().split("\\n");

const nums = input[0].split(/\\s+/).map(Number);
const target = Number(input[1]);

console.log(search(nums, target));`,

      python: `def search(nums, target):
    # Write your solution here
    pass

import sys

lines = sys.stdin.read().strip().splitlines()

nums = list(map(int, lines[0].split()))
target = int(lines[1])

print(search(nums, target))`
    },

    testCases: [
      {
        input: "-1 0 3 5 9 12\n9",
        output: "4",
        hidden: false
      },
      {
        input: "-1 0 3 5 9 12\n2",
        output: "-1",
        hidden: true
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Problem.deleteMany({});

    await Problem.insertMany(problems);

    console.log(`${problems.length} problems inserted successfully`);

    await mongoose.disconnect();

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seedDatabase();