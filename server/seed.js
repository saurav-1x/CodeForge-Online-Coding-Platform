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
  },

  {
    title: "Merge Two Ordered Lists",
    slug: "merge-ordered-lists",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers", "Sorting"],
    description:
      "You are given two lists of integers, each already sorted from smallest to largest. Return one sorted list containing every value from both inputs.",
    examples: [
      {
        input: "1 3 5\n2 4 6",
        output: "[1,2,3,4,5,6]",
        explanation: "The values from both lists are combined in ascending order."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function mergeOrdered(first, second) {
  // Write your solution here
}

const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
const first = (lines[0] || "").split(/\\s+/).filter(Boolean).map(Number);
const second = (lines[1] || "").split(/\\s+/).filter(Boolean).map(Number);

console.log(JSON.stringify(mergeOrdered(first, second)));`,
      python: `def mergeOrdered(first, second):
    # Write your solution here
    pass

import sys
import json

lines = sys.stdin.read().strip().splitlines()
first = list(map(int, lines[0].split())) if lines else []
second = list(map(int, lines[1].split())) if len(lines) > 1 else []

print(json.dumps(mergeOrdered(first, second), separators=(",", ":")))`
    },
    testCases: [
      { input: "1 3 5\n2 4 6", output: "[1,2,3,4,5,6]", hidden: false },
      { input: "-4 0 8\n-2 3 9", output: "[-4,-2,0,3,8,9]", hidden: true }
    ]
  },

  {
    title: "Rotate a List Right",
    slug: "rotate-list-right",
    difficulty: "Medium",
    tags: ["Array", "Math"],
    description:
      "Shift every value in a list to the right by k positions. Values that pass the end wrap around to the beginning. If the list is empty, return an empty list.",
    examples: [
      {
        input: "1 2 3 4 5\n2",
        output: "[4,5,1,2,3]",
        explanation: "After two right shifts, the last two values move to the front."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function rotateRight(nums, k) {
  // Write your solution here
}

const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
const nums = (lines[0] || "").split(/\\s+/).filter(Boolean).map(Number);
const k = Number(lines[1] || 0);

console.log(JSON.stringify(rotateRight(nums, k)));`,
      python: `def rotateRight(nums, k):
    # Write your solution here
    pass

import sys
import json

lines = sys.stdin.read().strip().splitlines()
nums = list(map(int, lines[0].split())) if lines else []
k = int(lines[1]) if len(lines) > 1 else 0

print(json.dumps(rotateRight(nums, k), separators=(",", ":")))`
    },
    testCases: [
      { input: "1 2 3 4 5\n2", output: "[4,5,1,2,3]", hidden: false },
      { input: "1 2\n5", output: "[2,1]", hidden: true }
    ]
  },

  {
    title: "Largest Contiguous Sum",
    slug: "largest-contiguous-sum",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description:
      "For a non-empty list of integers, find the greatest sum obtainable from a contiguous, non-empty section of the list.",
    examples: [
      {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The section [4, -1, 2, 1] has the greatest sum."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function largestContiguousSum(nums) {
  // Write your solution here
}

const nums = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
console.log(largestContiguousSum(nums));`,
      python: `def largestContiguousSum(nums):
    # Write your solution here
    pass

import sys

nums = list(map(int, sys.stdin.read().strip().split()))
print(largestContiguousSum(nums))`
    },
    testCases: [
      {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        hidden: false
      },
      { input: "5 4 -1 7 8", output: "23", hidden: true }
    ]
  },

  {
    title: "Best Single Trade",
    slug: "best-single-trade",
    difficulty: "Easy",
    tags: ["Array", "Greedy"],
    description:
      "A list gives an item's price on each day. Choose one day to buy and a later day to sell, or make no trade. Return the largest possible positive gain, or 0 if no trade is profitable.",
    examples: [
      {
        input: "7 1 5 3 6 4",
        output: "5",
        explanation: "Buying at 1 and selling later at 6 gives a gain of 5."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function bestSingleTrade(prices) {
  // Write your solution here
}

const prices = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
console.log(bestSingleTrade(prices));`,
      python: `def bestSingleTrade(prices):
    # Write your solution here
    pass

import sys

prices = list(map(int, sys.stdin.read().strip().split()))
print(bestSingleTrade(prices))`
    },
    testCases: [
      { input: "7 1 5 3 6 4", output: "5", hidden: false },
      { input: "7 6 4 3 1", output: "0", hidden: true }
    ]
  },

  {
    title: "Missing Sequence Value",
    slug: "missing-sequence-value",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description:
      "A list contains distinct values chosen from 0 through n, with exactly one value missing. Return the missing value.",
    examples: [
      {
        input: "3 0 1",
        output: "2",
        explanation: "The values from 0 through 3 should include 2."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function findMissingValue(nums) {
  // Write your solution here
}

const nums = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
console.log(findMissingValue(nums));`,
      python: `def findMissingValue(nums):
    # Write your solution here
    pass

import sys

nums = list(map(int, sys.stdin.read().strip().split()))
print(findMissingValue(nums))`
    },
    testCases: [
      { input: "3 0 1", output: "2", hidden: false },
      { input: "0 1", output: "2", hidden: true }
    ]
  },

  {
    title: "Longest Distinct Window",
    slug: "longest-distinct-window",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Map"],
    description:
      "Given a string, return the length of its longest contiguous section in which no character appears more than once.",
    examples: [
      {
        input: "abcabcbb",
        output: "3",
        explanation: "The section 'abc' contains three distinct characters."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function longestDistinctWindow(s) {
  // Write your solution here
}

const s = fs.readFileSync(0, "utf8").trim();
console.log(longestDistinctWindow(s));`,
      python: `def longestDistinctWindow(s):
    # Write your solution here
    pass

import sys

s = sys.stdin.read().strip()
print(longestDistinctWindow(s))`
    },
    testCases: [
      { input: "abcabcbb", output: "3", hidden: false },
      { input: "bbbbb", output: "1", hidden: true }
    ]
  },

  {
    title: "Count Land Regions",
    slug: "count-land-regions",
    difficulty: "Medium",
    tags: ["Matrix", "Breadth-First Search", "Depth-First Search"],
    description:
      "A rectangular map uses 1 for land and 0 for water. Land cells belong to the same region when connected horizontally or vertically. Return the number of separate land regions.",
    examples: [
      {
        input: "4 5\n11000\n11000\n00100\n00011",
        output: "3",
        explanation: "The map contains three disconnected groups of land."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function countLandRegions(grid) {
  // Write your solution here
}

const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
const grid = lines.slice(1).map(line => line.trim().split("").map(Number));
console.log(countLandRegions(grid));`,
      python: `def countLandRegions(grid):
    # Write your solution here
    pass

import sys

lines = sys.stdin.read().strip().splitlines()
grid = [list(map(int, line.strip())) for line in lines[1:]]
print(countLandRegions(grid))`
    },
    testCases: [
      {
        input: "4 5\n11000\n11000\n00100\n00011",
        output: "3",
        hidden: false
      },
      { input: "2 3\n111\n010", output: "1", hidden: true }
    ]
  },

  {
    title: "Fewest Coins to Reach a Total",
    slug: "fewest-coins-to-total",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description:
      "Given coin values that may be used as often as needed and a target total, return the fewest coins required to make that total. Return -1 when it cannot be made.",
    examples: [
      {
        input: "1 2 5\n11",
        output: "3",
        explanation: "The total 11 can be made with 5 + 5 + 1."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function fewestCoins(coins, amount) {
  // Write your solution here
}

const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
const coins = (lines[0] || "").split(/\\s+/).filter(Boolean).map(Number);
const amount = Number(lines[1] || 0);
console.log(fewestCoins(coins, amount));`,
      python: `def fewestCoins(coins, amount):
    # Write your solution here
    pass

import sys

lines = sys.stdin.read().strip().splitlines()
coins = list(map(int, lines[0].split())) if lines else []
amount = int(lines[1]) if len(lines) > 1 else 0
print(fewestCoins(coins, amount))`
    },
    testCases: [
      { input: "1 2 5\n11", output: "3", hidden: false },
      { input: "2\n3", output: "-1", hidden: true }
    ]
  },

  {
    title: "Find a Value in a Rotated List",
    slug: "search-rotated-list",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description:
      "A sorted list has been shifted around an unknown pivot, with no duplicate values. Return the index of a target value, or -1 if it is absent.",
    examples: [
      {
        input: "4 5 6 7 0 1 2\n0",
        output: "4",
        explanation: "The target 0 is at index 4."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function searchRotated(nums, target) {
  // Write your solution here
}

const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
const nums = (lines[0] || "").split(/\\s+/).filter(Boolean).map(Number);
const target = Number(lines[1]);
console.log(searchRotated(nums, target));`,
      python: `def searchRotated(nums, target):
    # Write your solution here
    pass

import sys

lines = sys.stdin.read().strip().splitlines()
nums = list(map(int, lines[0].split())) if lines else []
target = int(lines[1])
print(searchRotated(nums, target))`
    },
    testCases: [
      { input: "4 5 6 7 0 1 2\n0", output: "4", hidden: false },
      { input: "4 5 6 7 0 1 2\n3", output: "-1", hidden: true }
    ]
  },

  {
    title: "Count Grid Routes",
    slug: "count-grid-routes",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Combinatorics"],
    description:
      "A robot starts in the top-left cell of a rows-by-columns grid and can move only one cell right or one cell down at a time. Return the number of distinct routes to the bottom-right cell.",
    examples: [
      {
        input: "3 7",
        output: "28",
        explanation: "There are 28 different sequences of right and down moves."
      }
    ],
    starterCode: {
      javascript: `const fs = require("fs");

function countGridRoutes(rows, columns) {
  // Write your solution here
}

const [rows, columns] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
console.log(countGridRoutes(rows, columns));`,
      python: `def countGridRoutes(rows, columns):
    # Write your solution here
    pass

import sys

rows, columns = map(int, sys.stdin.read().strip().split())
print(countGridRoutes(rows, columns))`
    },
    testCases: [
      { input: "3 7", output: "28", hidden: false },
      { input: "3 2", output: "3", hidden: true }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const result = await Problem.bulkWrite(
      problems.map((problem) => ({
        updateOne: {
          filter: { slug: problem.slug },
          update: { $setOnInsert: problem },
          upsert: true
        }
      }))
    );

    console.log(`${result.upsertedCount} new problems added`);

    await mongoose.disconnect();

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

module.exports = { problems, seedDatabase };

if (require.main === module) {
  seedDatabase();
}