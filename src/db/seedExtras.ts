// Coding problems, quizzes, achievements and previous-year-question seed content.

export type SeedTestCase = { input: string; expectedOutput: string; description: string };

export type SeedCodingProblem = {
  slug: string;
  title: string;
  language: "java" | "python" | "both";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  statement: string;
  starterCodeJava?: string;
  starterCodePython?: string;
  testCases: SeedTestCase[];
  sampleSolutionJava?: string;
  sampleSolutionPython?: string;
  // used by the mock judge (src/services/codingService.ts) — not persisted verbatim
  requiredKeywordsJava?: string[];
  requiredKeywordsPython?: string[];
};

export const codingProblemsSeed: SeedCodingProblem[] = [
  {
    slug: "sum-of-array",
    title: "Sum of Array Elements",
    language: "both",
    difficulty: "easy",
    category: "Arrays",
    statement:
      "Given an array of n integers, write a program to compute and print the sum of all elements.\n\nInput: [12, 45, 7, 23, 9]\nOutput: 96",
    starterCodeJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {12, 45, 7, 23, 9};\n        // write your logic here\n\n    }\n}",
    starterCodePython:
      "arr = [12, 45, 7, 23, 9]\n# write your logic here\n",
    testCases: [
      { input: "[12, 45, 7, 23, 9]", expectedOutput: "96", description: "Given sample array" },
      { input: "[1, 1, 1, 1]", expectedOutput: "4", description: "Uniform values" },
      { input: "[-5, 10, 5]", expectedOutput: "10", description: "Includes a negative number" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {12, 45, 7, 23, 9};\n        int sum = 0;\n        for (int i = 0; i < arr.length; i++) sum += arr[i];\n        System.out.println(sum);\n    }\n}",
    sampleSolutionPython: "arr = [12, 45, 7, 23, 9]\nprint(sum(arr))",
    requiredKeywordsJava: ["for", "sum"],
    requiredKeywordsPython: ["for", "sum"],
  },
  {
    slug: "reverse-string",
    title: "Reverse a String",
    language: "both",
    difficulty: "easy",
    category: "Strings",
    statement:
      "Write a program that reverses a given string without using a built-in reverse function.\n\nInput: \"mucodex\"\nOutput: \"xedocum\"",
    starterCodeJava:
      "public class Solution {\n    public static void main(String[] args) {\n        String str = \"mucodex\";\n        // write your logic here\n\n    }\n}",
    starterCodePython: "s = \"mucodex\"\n# write your logic here\n",
    testCases: [
      { input: "\"mucodex\"", expectedOutput: "xedocum", description: "Lowercase word" },
      { input: "\"Java\"", expectedOutput: "avaJ", description: "Mixed case word" },
      { input: "\"a\"", expectedOutput: "a", description: "Single character" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    public static void main(String[] args) {\n        String str = \"mucodex\";\n        String reversed = \"\";\n        for (int i = str.length() - 1; i >= 0; i--) {\n            reversed += str.charAt(i);\n        }\n        System.out.println(reversed);\n    }\n}",
    sampleSolutionPython: "s = \"mucodex\"\nprint(s[::-1])",
    requiredKeywordsJava: ["for", "charAt"],
    requiredKeywordsPython: ["for", "[::"],
  },
  {
    slug: "palindrome-number",
    title: "Check Palindrome Number",
    language: "both",
    difficulty: "easy",
    category: "Loops",
    statement:
      "Given an integer, check whether it is a palindrome (reads the same forwards and backwards).\n\nInput: 121\nOutput: true",
    starterCodeJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int num = 121;\n        // write your logic here\n\n    }\n}",
    starterCodePython: "num = 121\n# write your logic here\n",
    testCases: [
      { input: "121", expectedOutput: "true", description: "3-digit palindrome" },
      { input: "123", expectedOutput: "false", description: "Non-palindrome" },
      { input: "7", expectedOutput: "true", description: "Single digit" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int num = 121;\n        int original = num, reversed = 0;\n        while (num > 0) {\n            reversed = reversed * 10 + num % 10;\n            num /= 10;\n        }\n        System.out.println(reversed == original);\n    }\n}",
    sampleSolutionPython:
      "num = 121\nprint(str(num) == str(num)[::-1])",
    requiredKeywordsJava: ["while", "%"],
    requiredKeywordsPython: ["str", "num"],
  },
  {
    slug: "factorial-recursion",
    title: "Factorial using Recursion",
    language: "both",
    difficulty: "medium",
    category: "Recursion",
    statement:
      "Write a recursive function to compute the factorial of a given non-negative integer n.\n\nInput: 5\nOutput: 120",
    starterCodeJava:
      "public class Solution {\n    static int factorial(int n) {\n        // write your logic here (base case + recursive case)\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(factorial(5));\n    }\n}",
    starterCodePython:
      "def factorial(n):\n    # write your logic here (base case + recursive case)\n    return 0\n\nprint(factorial(5))",
    testCases: [
      { input: "5", expectedOutput: "120", description: "Standard case" },
      { input: "0", expectedOutput: "1", description: "Base case: 0! = 1" },
      { input: "7", expectedOutput: "5040", description: "Larger input" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    static int factorial(int n) {\n        if (n == 0) return 1;\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(factorial(5));\n    }\n}",
    sampleSolutionPython:
      "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))",
    requiredKeywordsJava: ["return", "factorial"],
    requiredKeywordsPython: ["return", "factorial"],
  },
  {
    slug: "bubble-sort",
    title: "Bubble Sort Implementation",
    language: "both",
    difficulty: "medium",
    category: "Sorting",
    statement:
      "Implement bubble sort to sort an array of integers in ascending order.\n\nInput: [5, 1, 4, 2, 8]\nOutput: [1, 2, 4, 5, 8]",
    starterCodeJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {5, 1, 4, 2, 8};\n        // write your bubble sort logic here\n\n    }\n}",
    starterCodePython: "arr = [5, 1, 4, 2, 8]\n# write your bubble sort logic here\n",
    testCases: [
      { input: "[5, 1, 4, 2, 8]", expectedOutput: "[1, 2, 4, 5, 8]", description: "Unsorted array" },
      { input: "[1, 2, 3]", expectedOutput: "[1, 2, 3]", description: "Already sorted" },
      { input: "[3, 3, 1]", expectedOutput: "[1, 3, 3]", description: "Duplicate values" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {5, 1, 4, 2, 8};\n        for (int i = 0; i < arr.length - 1; i++) {\n            for (int j = 0; j < arr.length - i - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;\n                }\n            }\n        }\n        for (int v : arr) System.out.print(v + \" \");\n    }\n}",
    sampleSolutionPython:
      "arr = [5, 1, 4, 2, 8]\nfor i in range(len(arr) - 1):\n    for j in range(len(arr) - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint(arr)",
    requiredKeywordsJava: ["for", "if"],
    requiredKeywordsPython: ["for", "if"],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    language: "both",
    difficulty: "medium",
    category: "Searching",
    statement:
      "Given a sorted array and a target value, implement binary search to return the index of the target, or -1 if not found.\n\nInput: arr=[4,12,19,23,45,67,89], target=23\nOutput: 3",
    starterCodeJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {4, 12, 19, 23, 45, 67, 89};\n        int target = 23;\n        // write your binary search logic here\n\n    }\n}",
    starterCodePython:
      "arr = [4, 12, 19, 23, 45, 67, 89]\ntarget = 23\n# write your binary search logic here\n",
    testCases: [
      { input: "target=23", expectedOutput: "3", description: "Target present at middle-right" },
      { input: "target=4", expectedOutput: "0", description: "Target at first index" },
      { input: "target=100", expectedOutput: "-1", description: "Target not present" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {4, 12, 19, 23, 45, 67, 89};\n        int target = 23, low = 0, high = arr.length - 1, result = -1;\n        while (low <= high) {\n            int mid = (low + high) / 2;\n            if (arr[mid] == target) { result = mid; break; }\n            else if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        System.out.println(result);\n    }\n}",
    sampleSolutionPython:
      "arr = [4, 12, 19, 23, 45, 67, 89]\ntarget = 23\nlow, high, result = 0, len(arr) - 1, -1\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target:\n        result = mid\n        break\n    elif arr[mid] < target:\n        low = mid + 1\n    else:\n        high = mid - 1\nprint(result)",
    requiredKeywordsJava: ["while", "mid"],
    requiredKeywordsPython: ["while", "mid"],
  },
  {
    slug: "rectangle-class",
    title: "Class Design: Rectangle Area",
    language: "java",
    difficulty: "easy",
    category: "OOP",
    statement:
      "Create a class Rectangle with fields length and width, a constructor to set them, and a method area() that returns their product. Instantiate a Rectangle(5, 3) and print its area.",
    starterCodeJava:
      "class Rectangle {\n    double length, width;\n\n    // write your constructor and area() method here\n\n}\n\npublic class Solution {\n    public static void main(String[] args) {\n        Rectangle r = new Rectangle(5, 3);\n        System.out.println(r.area());\n    }\n}",
    testCases: [
      { input: "Rectangle(5, 3)", expectedOutput: "15.0", description: "Standard rectangle" },
      { input: "Rectangle(2, 2)", expectedOutput: "4.0", description: "Square dimensions" },
    ],
    sampleSolutionJava:
      "class Rectangle {\n    double length, width;\n    Rectangle(double length, double width) {\n        this.length = length;\n        this.width = width;\n    }\n    double area() { return length * width; }\n}\n\npublic class Solution {\n    public static void main(String[] args) {\n        Rectangle r = new Rectangle(5, 3);\n        System.out.println(r.area());\n    }\n}",
    requiredKeywordsJava: ["Rectangle(", "this.", "return"],
  },
  {
    slug: "employee-inheritance",
    title: "Inheritance: Manager Salary",
    language: "java",
    difficulty: "medium",
    category: "OOP",
    statement:
      "Create a class Employee with a method calculateSalary() returning 30000. Create a subclass Manager that overrides calculateSalary() to return 30000 + a bonus of 15000.",
    starterCodeJava:
      "class Employee {\n    double calculateSalary() { return 30000; }\n}\n\nclass Manager extends Employee {\n    // override calculateSalary() here\n\n}\n\npublic class Solution {\n    public static void main(String[] args) {\n        Employee e = new Manager();\n        System.out.println(e.calculateSalary());\n    }\n}",
    testCases: [
      { input: "new Manager().calculateSalary()", expectedOutput: "45000.0", description: "Manager includes bonus" },
    ],
    sampleSolutionJava:
      "class Employee {\n    double calculateSalary() { return 30000; }\n}\n\nclass Manager extends Employee {\n    @Override\n    double calculateSalary() { return super.calculateSalary() + 15000; }\n}\n\npublic class Solution {\n    public static void main(String[] args) {\n        Employee e = new Manager();\n        System.out.println(e.calculateSalary());\n    }\n}",
    requiredKeywordsJava: ["extends", "calculateSalary", "super"],
  },
  {
    slug: "balanced-parentheses",
    title: "Stack: Balanced Parentheses",
    language: "both",
    difficulty: "hard",
    category: "Data Structures",
    statement:
      "Using a stack, check whether a given string of brackets — e.g. \"{[()]}\" — is balanced (every opening bracket has a matching closing bracket in the correct order).\n\nInput: \"{[()]}\"\nOutput: true",
    starterCodeJava:
      "import java.util.Stack;\n\npublic class Solution {\n    public static void main(String[] args) {\n        String s = \"{[()]}\";\n        // write your stack-based logic here\n\n    }\n}",
    starterCodePython: "s = \"{[()]}\"\nstack = []\n# write your stack-based logic here\n",
    testCases: [
      { input: "\"{[()]}\"", expectedOutput: "true", description: "Well-formed nested brackets" },
      { input: "\"[(])\"", expectedOutput: "false", description: "Incorrectly nested brackets" },
      { input: "\"(())\"", expectedOutput: "true", description: "Simple nested parentheses" },
    ],
    sampleSolutionJava:
      "import java.util.Stack;\n\npublic class Solution {\n    public static void main(String[] args) {\n        String s = \"{[()]}\";\n        Stack<Character> stack = new Stack<>();\n        boolean balanced = true;\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') stack.push(c);\n            else {\n                if (stack.isEmpty()) { balanced = false; break; }\n                char top = stack.pop();\n                if ((c == ')' && top != '(') || (c == ']' && top != '[') || (c == '}' && top != '{')) {\n                    balanced = false; break;\n                }\n            }\n        }\n        System.out.println(balanced && stack.isEmpty());\n    }\n}",
    sampleSolutionPython:
      "s = \"{[()]}\"\nstack = []\npairs = {')': '(', ']': '[', '}': '{'}\nbalanced = True\nfor c in s:\n    if c in '([{':\n        stack.append(c)\n    elif c in ')]}':\n        if not stack or stack.pop() != pairs[c]:\n            balanced = False\n            break\nprint(balanced and not stack)",
    requiredKeywordsJava: ["Stack", "push", "pop"],
    requiredKeywordsPython: ["stack", "append", "pop"],
  },
  {
    slug: "fibonacci-series",
    title: "Fibonacci Series",
    language: "both",
    difficulty: "easy",
    category: "Loops",
    statement:
      "Print the first n terms of the Fibonacci series (0, 1, 1, 2, 3, 5, ...) for n = 8.",
    starterCodeJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int n = 8;\n        // write your logic here\n\n    }\n}",
    starterCodePython: "n = 8\n# write your logic here\n",
    testCases: [
      { input: "n=8", expectedOutput: "0 1 1 2 3 5 8 13", description: "First 8 Fibonacci terms" },
    ],
    sampleSolutionJava:
      "public class Solution {\n    public static void main(String[] args) {\n        int n = 8;\n        int a = 0, b = 1;\n        for (int i = 0; i < n; i++) {\n            System.out.print(a + \" \");\n            int next = a + b; a = b; b = next;\n        }\n    }\n}",
    sampleSolutionPython:
      "n = 8\na, b = 0, 1\nresult = []\nfor _ in range(n):\n    result.append(a)\n    a, b = b, a + b\nprint(' '.join(map(str, result)))",
    requiredKeywordsJava: ["for", "="],
    requiredKeywordsPython: ["for", "="],
  },
];

export type SeedQuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type SeedQuiz = {
  key: string; // used to link topic/unit/subject
  scope: "topic" | "unit" | "subject";
  linkTitle: string; // topic title / unit title / subject name to match
  title: string;
  difficulty: string;
  questions: SeedQuizQuestion[];
};

export const quizzesSeed: SeedQuiz[] = [
  {
    key: "quiz-classes-objects",
    scope: "topic",
    linkTitle: "Classes and Objects",
    title: "Classes & Objects Quiz",
    difficulty: "easy",
    questions: [
      {
        question: "What is a class in Java?",
        options: ["An instance of an object", "A blueprint for creating objects", "A built-in Java keyword", "A type of loop"],
        correctIndex: 1,
        explanation: "A class defines the structure (fields) and behaviour (methods) that its objects will have.",
      },
      {
        question: "Which keyword is used to create a new object in Java?",
        options: ["create", "new", "object", "instance"],
        correctIndex: 1,
        explanation: "'new' allocates memory on the heap and returns a reference to the created object.",
      },
      {
        question: "What does the 'this' keyword refer to?",
        options: ["The superclass", "A static method", "The current object instance", "A new object"],
        correctIndex: 2,
        explanation: "'this' refers to the current instance, often used to resolve field/parameter name conflicts.",
      },
      {
        question: "If a class has no explicit constructor, what happens?",
        options: [
          "The program fails to compile",
          "Java provides a free no-argument default constructor",
          "All fields default to null automatically without any constructor call",
          "The class cannot be instantiated",
        ],
        correctIndex: 1,
        explanation: "Java automatically supplies a no-arg default constructor if none is defined.",
      },
      {
        question: "Each object created from a class:",
        options: [
          "Shares the exact same field values as every other object",
          "Gets its own independent copy of instance fields",
          "Cannot call the class's methods",
          "Must be declared static",
        ],
        correctIndex: 1,
        explanation: "Instance fields are per-object; methods are shared, but data is independent per instance.",
      },
    ],
  },
  {
    key: "quiz-inheritance",
    scope: "topic",
    linkTitle: "Inheritance in Java",
    title: "Inheritance & Polymorphism Quiz",
    difficulty: "medium",
    questions: [
      {
        question: "Which keyword establishes inheritance between two classes in Java?",
        options: ["implements", "inherits", "extends", "super"],
        correctIndex: 2,
        explanation: "'extends' is used for class inheritance; 'implements' is used for interfaces.",
      },
      {
        question: "Java does NOT support which type of inheritance directly through classes?",
        options: ["Single inheritance", "Multilevel inheritance", "Hierarchical inheritance", "Multiple inheritance"],
        correctIndex: 3,
        explanation: "Java avoids multiple inheritance of classes to prevent the Diamond Problem; interfaces are used instead.",
      },
      {
        question: "What does method overriding enable?",
        options: ["Compile-time polymorphism", "Runtime (dynamic) polymorphism", "Faster compilation", "Static binding"],
        correctIndex: 1,
        explanation: "Overriding enables runtime polymorphism — the overridden method executed depends on the object's actual type.",
      },
      {
        question: "Where must a call to super() appear in a subclass constructor?",
        options: ["Anywhere", "As the last statement", "As the first statement", "It cannot be used in a constructor"],
        correctIndex: 2,
        explanation: "super() must be the first statement in a subclass constructor if used explicitly.",
      },
      {
        question: "A class can implement how many interfaces in Java?",
        options: ["Only one", "Up to two", "Multiple interfaces", "None"],
        correctIndex: 2,
        explanation: "A Java class can implement any number of interfaces, unlike extending only one class.",
      },
    ],
  },
  {
    key: "quiz-arrays",
    scope: "topic",
    linkTitle: "Arrays in Java",
    title: "Arrays Quiz",
    difficulty: "easy",
    questions: [
      {
        question: "What is the index of the first element of a Java array?",
        options: ["1", "0", "-1", "It depends on the array size"],
        correctIndex: 1,
        explanation: "Java arrays are zero-indexed — the first element is at index 0.",
      },
      {
        question: "What happens if you access an index equal to array.length?",
        options: [
          "It returns null",
          "It returns the last element again",
          "ArrayIndexOutOfBoundsException is thrown",
          "It automatically resizes the array",
        ],
        correctIndex: 2,
        explanation: "Valid indices range from 0 to length-1; index == length is out of bounds.",
      },
      {
        question: "How do you get the number of elements in a Java array 'arr'?",
        options: ["arr.length()", "arr.length", "arr.size()", "length(arr)"],
        correctIndex: 1,
        explanation: "For arrays, 'length' is a field (no parentheses), unlike String's length() method.",
      },
      {
        question: "Can the size of a Java array be changed after creation?",
        options: ["Yes, using resize()", "No, arrays have a fixed size once created", "Yes, automatically", "Only for int arrays"],
        correctIndex: 1,
        explanation: "Arrays are fixed-size; use ArrayList/Vector for dynamic resizing.",
      },
    ],
  },
  {
    key: "quiz-loops-python",
    scope: "topic",
    linkTitle: "Loops in Python",
    title: "Python Loops Quiz",
    difficulty: "easy",
    questions: [
      {
        question: "What values does range(1, 5) generate?",
        options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "2, 3, 4, 5"],
        correctIndex: 1,
        explanation: "range(start, stop) excludes the stop value, so range(1,5) gives 1,2,3,4.",
      },
      {
        question: "Which statement immediately exits the nearest enclosing loop?",
        options: ["continue", "pass", "break", "return"],
        correctIndex: 2,
        explanation: "'break' terminates the loop entirely; 'continue' only skips to the next iteration.",
      },
      {
        question: "What could cause an infinite while loop?",
        options: [
          "Using range() inside it",
          "Forgetting to update the loop's condition variable",
          "Using an f-string inside the loop",
          "Using break inside the loop",
        ],
        correctIndex: 1,
        explanation: "If the condition variable never changes, the while condition stays True forever.",
      },
      {
        question: "Python's 'for' loop typically iterates over:",
        options: ["Only integers", "Iterables like lists, strings and ranges", "Only dictionaries", "Only file objects"],
        correctIndex: 1,
        explanation: "Python's for loop iterates directly over any iterable object.",
      },
    ],
  },
  {
    key: "quiz-stacks-queues",
    scope: "unit",
    linkTitle: "Unit 2 — Stacks & Queues",
    title: "Stacks & Queues Quiz",
    difficulty: "medium",
    questions: [
      {
        question: "A Stack follows which ordering principle?",
        options: ["FIFO", "LIFO", "Random order", "Priority order"],
        correctIndex: 1,
        explanation: "Stack = Last In, First Out (LIFO).",
      },
      {
        question: "A Queue follows which ordering principle?",
        options: ["LIFO", "FIFO", "LILO", "Random order"],
        correctIndex: 1,
        explanation: "Queue = First In, First Out (FIFO).",
      },
      {
        question: "Which operation removes and returns the top element of a stack?",
        options: ["peek()", "pop()", "poll()", "remove(0)"],
        correctIndex: 1,
        explanation: "pop() removes and returns the top element; peek() only views it.",
      },
      {
        question: "What is a real-world application of a stack?",
        options: ["Printer job scheduling", "Browser back button / undo functionality", "Ticket counter line", "CPU round-robin scheduling"],
        correctIndex: 1,
        explanation: "Undo and back-navigation both rely on LIFO ordering — a stack.",
      },
      {
        question: "In a queue, where does enqueue insert a new element?",
        options: ["At the front", "At the rear", "At a random position", "At the middle"],
        correctIndex: 1,
        explanation: "Enqueue always inserts at the rear; dequeue removes from the front.",
      },
    ],
  },
  {
    key: "quiz-oopm-mock",
    scope: "subject",
    linkTitle: "Object Oriented Programming Methodology (Java)",
    title: "OOPM Semester Mock Test",
    difficulty: "hard",
    questions: [
      {
        question: "Which of these is NOT one of the four pillars of OOP?",
        options: ["Encapsulation", "Compilation", "Inheritance", "Polymorphism"],
        correctIndex: 1,
        explanation: "The 4 pillars are Encapsulation, Abstraction, Inheritance and Polymorphism — compilation is unrelated.",
      },
      {
        question: "Overloaded methods are resolved:",
        options: ["At runtime", "At compile time", "Never resolved", "Only in interfaces"],
        correctIndex: 1,
        explanation: "Method overloading is a compile-time (static) polymorphism mechanism.",
      },
      {
        question: "Which collection is synchronized (thread-safe) by default?",
        options: ["ArrayList", "Vector", "HashMap", "LinkedList"],
        correctIndex: 1,
        explanation: "Vector's methods are synchronized; ArrayList is not.",
      },
      {
        question: "An abstract class:",
        options: [
          "Can never have concrete (implemented) methods",
          "Can be instantiated directly with 'new'",
          "Can contain both abstract and concrete methods",
          "Is the same as an interface",
        ],
        correctIndex: 2,
        explanation: "Abstract classes can mix method declarations (abstract) and full implementations (concrete).",
      },
      {
        question: "What does the 'finally' block guarantee?",
        options: [
          "It only runs if an exception occurs",
          "It runs regardless of whether an exception was thrown",
          "It replaces the catch block",
          "It only runs if no exception occurs",
        ],
        correctIndex: 1,
        explanation: "'finally' always executes, used typically for cleanup code.",
      },
      {
        question: "Strings in Java are:",
        options: ["Mutable", "Immutable", "Only mutable inside loops", "Primitive types"],
        correctIndex: 1,
        explanation: "String objects cannot be changed after creation; operations return new String objects.",
      },
      {
        question: "Which keyword allows a subclass to invoke its superclass's constructor?",
        options: ["this()", "super()", "extends()", "base()"],
        correctIndex: 1,
        explanation: "super() invokes the immediate superclass constructor and must be the first statement.",
      },
      {
        question: "A class can implement multiple interfaces but extend how many classes?",
        options: ["0", "1", "2", "Unlimited"],
        correctIndex: 1,
        explanation: "Java allows single class inheritance but multiple interface implementation.",
      },
    ],
  },
  {
    key: "quiz-ds-mock",
    scope: "subject",
    linkTitle: "Data Structures",
    title: "Data Structures Semester Mock Test",
    difficulty: "hard",
    questions: [
      {
        question: "What is the time complexity of accessing an element by index in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Direct index access uses address arithmetic — constant time O(1).",
      },
      {
        question: "Binary search requires the input array to be:",
        options: ["Unsorted", "Sorted", "Circular", "Of even length"],
        correctIndex: 1,
        explanation: "Binary search relies on comparing against a sorted midpoint to eliminate half the search space.",
      },
      {
        question: "What is the average/worst-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        correctIndex: 3,
        explanation: "Bubble sort compares adjacent pairs repeatedly, giving O(n²) in average/worst cases.",
      },
      {
        question: "In a singly linked list, each node stores:",
        options: [
          "Data and a pointer to the previous node only",
          "Data and a pointer to the next node",
          "Only data, no pointers",
          "Two data values",
        ],
        correctIndex: 1,
        explanation: "Singly linked list nodes point forward only, to the 'next' node.",
      },
      {
        question: "Which structure is best suited for undo functionality in a text editor?",
        options: ["Queue", "Stack", "Array", "Graph"],
        correctIndex: 1,
        explanation: "Undo requires LIFO access to the most recent action — a stack.",
      },
      {
        question: "What is an ADT?",
        options: [
          "A specific programming language",
          "A logical description of operations independent of implementation",
          "An array data type",
          "A compiler optimisation technique",
        ],
        correctIndex: 1,
        explanation: "An Abstract Data Type defines behaviour/operations, not the underlying implementation.",
      },
      {
        question: "Which sort is efficient for nearly-sorted data due to fewer shifts?",
        options: ["Bubble Sort", "Insertion Sort", "Selection Sort (not covered)", "Random Sort"],
        correctIndex: 1,
        explanation: "Insertion Sort performs close to O(n) on nearly sorted data.",
      },
      {
        question: "A doubly linked list node additionally stores:",
        options: ["A pointer to a random node", "A pointer to the previous node", "Two data fields", "A pointer to the head only"],
        correctIndex: 1,
        explanation: "Doubly linked list nodes maintain both 'next' and 'prev' pointers.",
      },
      {
        question: "What does FIFO stand for?",
        options: ["First In First Out", "Fast Input Fast Output", "First In Final Out", "Final Input First Out"],
        correctIndex: 0,
        explanation: "FIFO = First In, First Out — the ordering principle of a queue.",
      },
      {
        question: "Which operation is O(n) for a plain array but O(1) at the head for a linked list?",
        options: ["Access by index", "Insertion at the beginning", "Finding array length", "Iterating all elements"],
        correctIndex: 1,
        explanation: "Array insertion at the start requires shifting all elements; linked lists just update a pointer.",
      },
    ],
  },
];

export type SeedAchievement = {
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
};

export const achievementsSeed: SeedAchievement[] = [
  { code: "first-steps", title: "First Steps", description: "Complete your very first topic on MUCodeX.", icon: "footprints", xpReward: 20, category: "learning" },
  { code: "semester-starter", title: "Semester Starter", description: "Finish onboarding and set up your learning path.", icon: "rocket", xpReward: 10, category: "onboarding" },
  { code: "code-warrior", title: "Code Warrior", description: "Solve 5 coding problems in Coding Practice.", icon: "swords", xpReward: 50, category: "coding" },
  { code: "problem-solver-pro", title: "Problem Solver Pro", description: "Solve 20 coding problems across all categories.", icon: "target", xpReward: 100, category: "coding" },
  { code: "quiz-whiz", title: "Quiz Whiz", description: "Score 100% on any quiz.", icon: "brain-circuit", xpReward: 40, category: "quiz" },
  { code: "streak-7", title: "7-Day Streak", description: "Maintain a 7-day learning streak.", icon: "flame", xpReward: 70, category: "consistency" },
  { code: "debug-master", title: "Debug Master", description: "Use the AI Code Debugger 5 times.", icon: "bug", xpReward: 30, category: "coding" },
  { code: "oop-champion", title: "OOP Champion", description: "Complete every topic in OOPM Unit 2.", icon: "shield-check", xpReward: 60, category: "learning" },
  { code: "mock-test-taker", title: "Mock Test Taker", description: "Complete a full semester mock test.", icon: "clipboard-check", xpReward: 55, category: "exam" },
  { code: "century-xp", title: "Century Club", description: "Cross 500 total XP on MUCodeX.", icon: "trophy", xpReward: 25, category: "milestone" },
];

export type SeedPyq = {
  subjectName: string;
  unitTitle?: string;
  year: number;
  question: string;
  marks: number;
  type: "theory" | "coding" | "mcq";
  difficulty: "easy" | "medium" | "hard";
};

export const pyqsSeed: SeedPyq[] = [
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 1 — Introduction to OOP & Java", year: 2023, question: "Explain the four pillars of Object-Oriented Programming with suitable examples.", marks: 10, type: "theory", difficulty: "medium" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 2 — Classes, Objects & Methods", year: 2023, question: "What is constructor overloading? Write a Java program to demonstrate it using a class 'Box'.", marks: 10, type: "coding", difficulty: "medium" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 2 — Classes, Objects & Methods", year: 2022, question: "Differentiate between method overloading and method overriding.", marks: 5, type: "theory", difficulty: "easy" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 4 — Inheritance & Polymorphism", year: 2023, question: "Write a Java program to demonstrate multilevel inheritance using classes Person -> Employee -> Manager.", marks: 10, type: "coding", difficulty: "hard" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 4 — Inheritance & Polymorphism", year: 2024, question: "What is the difference between an abstract class and an interface in Java? When would you use each?", marks: 10, type: "theory", difficulty: "medium" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 5 — Exception Handling & Packages", year: 2022, question: "Explain checked and unchecked exceptions with examples. Write a program using try-catch-finally.", marks: 10, type: "coding", difficulty: "medium" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 3 — Arrays, Strings & Vectors", year: 2024, question: "Explain why String objects are immutable in Java. Differentiate String, StringBuffer and StringBuilder.", marks: 5, type: "theory", difficulty: "easy" },
  { subjectName: "Data Structures", unitTitle: "Unit 2 — Stacks & Queues", year: 2023, question: "Write an algorithm to check whether a given expression has balanced parentheses using a stack.", marks: 10, type: "coding", difficulty: "hard" },
  { subjectName: "Data Structures", unitTitle: "Unit 1 — Introduction & Arrays", year: 2022, question: "Define Data Structure and Abstract Data Type (ADT). Classify data structures with examples.", marks: 5, type: "theory", difficulty: "easy" },
  { subjectName: "Data Structures", unitTitle: "Unit 4 — Sorting & Searching", year: 2024, question: "Trace the working of Bubble Sort on the array [45, 12, 78, 3, 90] showing every pass.", marks: 10, type: "coding", difficulty: "medium" },
  { subjectName: "Data Structures", unitTitle: "Unit 4 — Sorting & Searching", year: 2023, question: "Compare the time complexity of Linear Search and Binary Search. When can Binary Search not be used?", marks: 5, type: "theory", difficulty: "easy" },
  { subjectName: "Data Structures", unitTitle: "Unit 3 — Linked Lists", year: 2022, question: "Write a program to reverse a singly linked list iteratively.", marks: 10, type: "coding", difficulty: "hard" },
  { subjectName: "Data Structures", unitTitle: "Unit 3 — Linked Lists", year: 2024, question: "What are the advantages of a doubly linked list over a singly linked list?", marks: 5, type: "theory", difficulty: "medium" },
  { subjectName: "Data Structures", unitTitle: "Unit 2 — Stacks & Queues", year: 2024, question: "Differentiate between a linear queue and a circular queue. Why is a circular queue preferred?", marks: 5, type: "theory", difficulty: "medium" },
  { subjectName: "Object Oriented Programming Methodology (Java)", unitTitle: "Unit 1 — Introduction to OOP & Java", year: 2022, question: "Explain the role of JVM, JRE and JDK in Java's platform independence.", marks: 5, type: "theory", difficulty: "easy" },
];
