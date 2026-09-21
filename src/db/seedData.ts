// Central content library for MUCodeX.
// This represents the Mumbai University (CBCGS, Computer Engineering) Semester 3
// curriculum, curated for the MVP demo, plus a MUCodeX "Bridge Course" in Python
// that supplements the syllabus so both primary MVP languages (Java & Python)
// are represented end-to-end. See README section "Source notes" for the
// inconsistency this resolves (MU Sem 3 CE syllabus is Java-based; MUCodeX's
// own brief asks for Java + Python).

export type SeedTopic = {
  title: string;
  estimatedMinutes: number;
  objectives: string[];
  easyExplanation: string;
  technicalExplanation: string;
  example: string;
  codeExampleJava?: string;
  codeExamplePython?: string;
  visualType:
    | "loop"
    | "array"
    | "class"
    | "inheritance"
    | "stack"
    | "queue"
    | "linkedlist"
    | "function"
    | "variable"
    | "none";
  importantPoints: string[];
  commonMistakes: string[];
  practiceQuestion: string;
};

export type SeedUnit = {
  title: string;
  description: string;
  topics: SeedTopic[];
};

export type SeedSubject = {
  code: string;
  name: string;
  branch: string;
  semester: number;
  description: string;
  icon: string;
  colorTheme: string;
  comingSoon?: boolean;
  units: SeedUnit[];
};

export const BRANCH = "Computer Engineering";
export const DEFAULT_SEMESTER = 3;

export const subjectsSeed: SeedSubject[] = [
  {
    code: "CSC305",
    name: "Object Oriented Programming Methodology (Java)",
    branch: BRANCH,
    semester: 3,
    description:
      "Core OOP concepts implemented in Java — classes, objects, inheritance, polymorphism, exception handling and packages, aligned with the MU CSC305 syllabus.",
    icon: "coffee",
    colorTheme: "blue",
    units: [
      {
        title: "Unit 1 — Introduction to OOP & Java",
        description: "Foundations of object-oriented thinking and the Java platform.",
        topics: [
          {
            title: "What is Object-Oriented Programming?",
            estimatedMinutes: 12,
            objectives: [
              "Explain the four pillars of OOP",
              "Differentiate procedural vs object-oriented approach",
              "Identify real-world objects, classes and attributes",
            ],
            easyExplanation:
              "Object-Oriented Programming (OOP) is a way of writing programs by modelling real things as 'objects' — like a Student, a Car or a BankAccount — each with their own data (attributes) and actions (methods). Instead of writing one long list of instructions, you build small reusable building blocks that talk to each other.",
            technicalExplanation:
              "OOP is a programming paradigm built on four pillars: Encapsulation (bundling data and methods, restricting direct access), Abstraction (exposing only essential behaviour while hiding implementation), Inheritance (deriving new classes from existing ones to reuse and extend behaviour) and Polymorphism (allowing one interface to take many forms via overloading/overriding). Java is a purely object-oriented language (barring primitives) that enforces these principles through classes and interfaces.",
            example:
              "Think of a 'Vehicle' blueprint. A Car and a Bike are both vehicles — they share properties like speed and fuel, but each has its own specific behaviour. In OOP, 'Vehicle' is a class, and 'Car'/'Bike' are objects or subclasses derived from it.",
            codeExampleJava:
              "class Student {\n    String name;\n    int rollNumber;\n\n    void displayInfo() {\n        System.out.println(name + \" - Roll No: \" + rollNumber);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student();\n        s1.name = \"Aarav Patil\";\n        s1.rollNumber = 21;\n        s1.displayInfo();\n    }\n}",
            visualType: "class",
            importantPoints: [
              "Encapsulation, Abstraction, Inheritance and Polymorphism are the 4 pillars of OOP.",
              "A class is a blueprint; an object is a real instance created from it.",
              "Java uses 'new' keyword to create objects on the heap.",
            ],
            commonMistakes: [
              "Confusing a class (design) with an object (instance) — a class itself holds no memory for instance data until objects are created.",
              "Trying to call instance methods without creating an object first.",
            ],
            practiceQuestion:
              "Define a class 'Book' with attributes title and price, and a method displayDetails() that prints them. Create two Book objects with different values.",
          },
          {
            title: "Java Program Structure & JVM",
            estimatedMinutes: 10,
            objectives: [
              "Understand JVM, JRE and JDK",
              "Trace how a .java file becomes an executable program",
              "Identify the role of bytecode and platform independence",
            ],
            easyExplanation:
              "When you write Java code, it isn't run directly by your computer — it's first converted into a universal format called 'bytecode' by the compiler. The Java Virtual Machine (JVM) then reads this bytecode and runs it on your specific machine. This is why Java code works on Windows, Mac or Linux without changes: 'write once, run anywhere'.",
            technicalExplanation:
              "The JDK (Java Development Kit) includes the compiler (javac) that converts .java source files into .class bytecode files. The JRE (Java Runtime Environment) provides libraries and the JVM needed to execute that bytecode. The JVM performs class loading, bytecode verification, and interprets/JIT-compiles bytecode into native machine instructions, which is what makes Java platform-independent at the source and bytecode level.",
            example:
              "It's like a translator at a conference: you (the source code) speak once, the translator (JVM) converts your words for any audience (operating system) in the room, regardless of what language they understand natively.",
            codeExampleJava:
              "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Compiled to bytecode, executed by the JVM\");\n    }\n}\n\n// javac Main.java   -> produces Main.class (bytecode)\n// java Main          -> JVM executes the bytecode",
            visualType: "none",
            importantPoints: [
              "JDK = JRE + development tools (compiler, debugger).",
              "JRE = JVM + core libraries needed to run programs.",
              "Bytecode makes Java platform independent.",
            ],
            commonMistakes: [
              "Thinking JVM, JRE and JDK are the same thing.",
              "Forgetting that the public class name must match the file name in Java.",
            ],
            practiceQuestion:
              "In one sentence each, explain the difference between JDK, JRE and JVM.",
          },
          {
            title: "Variables, Data Types & Operators",
            estimatedMinutes: 14,
            objectives: [
              "List Java's primitive data types",
              "Apply arithmetic, relational and logical operators",
              "Understand type casting",
            ],
            easyExplanation:
              "Variables are labelled containers that store values — like a box labelled 'age' holding the number 20. Java is 'strongly typed', meaning every box must declare what kind of value it will hold (a whole number, decimal, character, true/false, etc.) before you use it.",
            technicalExplanation:
              "Java has 8 primitive types: byte, short, int, long, float, double, char and boolean, each with a fixed memory size and range. Operators are classified as arithmetic (+, -, *, /, %), relational (==, !=, <, >), logical (&&, ||, !), assignment (=, +=) and bitwise. Implicit widening casts happen automatically (int → long); narrowing casts (double → int) require an explicit cast and may lose precision.",
            example:
              "A 'char' box can only hold a single character like 'A', while an 'int' box holds whole numbers like 21. Mixing them up — like trying to fit a paragraph into a box meant for one letter — causes a compile-time type error.",
            codeExampleJava:
              "int marks = 87;\ndouble percentage = marks / 100.0 * 100;\nchar grade = percentage >= 75 ? 'A' : 'B';\nboolean passed = marks >= 40;\n\nSystem.out.println(\"Grade: \" + grade + \", Passed: \" + passed);",
            visualType: "variable",
            importantPoints: [
              "Java has exactly 8 primitive types — everything else is a reference type.",
              "Integer division (int/int) truncates the decimal part.",
              "Use explicit casting for narrowing conversions, e.g. (int) 9.8.",
            ],
            commonMistakes: [
              "Dividing two integers and expecting a decimal result (5/2 gives 2, not 2.5).",
              "Forgetting single quotes for char literals ('A') vs double quotes for String (\"A\").",
            ],
            practiceQuestion:
              "Write a snippet that stores your CGPA as a double, converts it to a percentage (CGPA * 9.5), and prints the result rounded using casting.",
          },
        ],
      },
      {
        title: "Unit 2 — Classes, Objects & Methods",
        description: "The heart of OOP in Java: designing classes, constructing objects, and method design.",
        topics: [
          {
            title: "Classes and Objects",
            estimatedMinutes: 15,
            objectives: [
              "Design a class with fields and methods",
              "Instantiate multiple objects from one class",
              "Understand the 'this' keyword",
            ],
            easyExplanation:
              "A class is like a cookie-cutter, and objects are the cookies made from it. Every cookie (object) has the same shape (structure) defined by the cutter (class), but each can have its own toppings (values) — one Student object might be 'Aarav, Sem 3' while another is 'Isha, Sem 5'.",
            technicalExplanation:
              "A class in Java encapsulates state (instance fields) and behaviour (methods) into a single unit. Objects are instances created using the 'new' keyword, each with its own copy of instance fields stored on the heap, while methods are shared. The 'this' keyword refers to the current object instance, commonly used to resolve naming conflicts between fields and parameters.",
            example:
              "In a college ERP system, 'Student' is the class. Every enrolled student — Aarav, Isha, Rohan — is a separate object holding their own roll number, name and marks, but all follow the same Student blueprint.",
            codeExampleJava:
              "class Student {\n    String name;\n    int semester;\n\n    Student(String name, int semester) {\n        this.name = name;\n        this.semester = semester;\n    }\n\n    void show() {\n        System.out.println(name + \" | Semester \" + semester);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student(\"Aarav Patil\", 3);\n        Student s2 = new Student(\"Isha Shah\", 5);\n        s1.show();\n        s2.show();\n    }\n}",
            visualType: "class",
            importantPoints: [
              "Each object gets its own copy of instance variables.",
              "'this' distinguishes instance fields from constructor/method parameters of the same name.",
              "Methods are defined once in the class and reused by every object.",
            ],
            commonMistakes: [
              "Forgetting to use 'this.field = field' inside constructors, causing the parameter to shadow the field silently.",
              "Assuming objects share field values — they don't, each object has independent state.",
            ],
            practiceQuestion:
              "Create a class 'BankAccount' with fields accountHolder and balance, a constructor to initialise both, and a method deposit(double amount) that increases the balance.",
          },
          {
            title: "Constructors in Java",
            estimatedMinutes: 12,
            objectives: [
              "Differentiate default, no-arg and parameterised constructors",
              "Use constructor overloading",
              "Apply 'this()' constructor chaining",
            ],
            easyExplanation:
              "A constructor is special code that runs automatically the moment an object is created — like a setup checklist that fills in the object's initial details. If you don't write one yourself, Java quietly gives you an empty default one.",
            technicalExplanation:
              "A constructor shares its name with the class, has no return type, and is invoked implicitly during object creation via 'new'. Java allows constructor overloading — multiple constructors differentiated by parameter list — and constructor chaining using 'this(...)' to avoid duplicated initialisation logic across overloaded constructors.",
            example:
              "Think of registering for a gym membership: the front-desk form (constructor) can be filled minimally (just your name) or fully (name, plan, trainer). Both create a valid membership record, just with different levels of detail supplied upfront.",
            codeExampleJava:
              "class Rectangle {\n    double length, width;\n\n    Rectangle() {\n        this(1.0, 1.0); // chaining\n    }\n\n    Rectangle(double side) {\n        this(side, side);\n    }\n\n    Rectangle(double length, double width) {\n        this.length = length;\n        this.width = width;\n    }\n\n    double area() { return length * width; }\n}",
            visualType: "class",
            importantPoints: [
              "A constructor never has a return type, not even void.",
              "If you define any constructor, Java stops providing the free default constructor.",
              "'this(...)' must be the first statement inside a constructor.",
            ],
            commonMistakes: [
              "Adding a return type to a constructor by mistake, which silently turns it into a regular method.",
              "Circular constructor chaining (constructor A calls B which calls A) — this fails to compile.",
            ],
            practiceQuestion:
              "Write a class 'Movie' with 3 overloaded constructors: no-arg (title = \"Untitled\"), one-arg (title only), and two-arg (title and duration), using constructor chaining.",
          },
          {
            title: "Method Overloading",
            estimatedMinutes: 10,
            objectives: [
              "Define multiple methods with the same name",
              "Understand compile-time (static) polymorphism",
              "Identify valid overload signatures",
            ],
            easyExplanation:
              "Method overloading lets you use the same action name for slightly different jobs — like how 'print' can print a number, a sentence, or a list. Java figures out which version to run based on what you pass in.",
            technicalExplanation:
              "Overloading occurs when two or more methods in the same class share a name but differ in the number, type, or order of parameters. It is resolved at compile time based on the method signature, making it a form of compile-time (static) polymorphism. Return type alone cannot distinguish overloaded methods.",
            example:
              "A calculator app's 'add' button works for two numbers, three numbers, or decimals — internally these might be different overloaded add() methods, but to the user it feels like one consistent action.",
            codeExampleJava:
              "class Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n    int add(int a, int b, int c) { return a + b + c; }\n}\n\n// calc.add(2, 3)        -> uses int version\n// calc.add(2.5, 3.5)    -> uses double version\n// calc.add(1, 2, 3)     -> uses 3-argument version",
            visualType: "function",
            importantPoints: [
              "Overloading is resolved at compile time using parameter type/count/order.",
              "You cannot overload two methods that differ only by return type.",
              "Overloading improves readability by keeping related actions under one method name.",
            ],
            commonMistakes: [
              "Trying to overload using only a different return type — this causes a compile error.",
              "Confusing overloading (same class, same name, different params) with overriding (subclass redefinition).",
            ],
            practiceQuestion:
              "Write an overloaded method 'area' for a class 'Shapes': area(double side) for a square, and area(double length, double breadth) for a rectangle.",
          },
        ],
      },
      {
        title: "Unit 3 — Arrays, Strings & Vectors",
        description: "Working with collections of data using arrays, the String class, and Vectors.",
        topics: [
          {
            title: "Arrays in Java",
            estimatedMinutes: 14,
            objectives: [
              "Declare and initialise single/multi-dimensional arrays",
              "Traverse arrays using loops",
              "Understand fixed-size, zero-indexed nature of arrays",
            ],
            easyExplanation:
              "An array is like a row of numbered lockers, all the same size, where each locker holds one value. Instead of creating 10 separate variables for 10 marks, you create one array of size 10 and access each value by its locker number (index), starting from 0.",
            technicalExplanation:
              "An array in Java is a fixed-size, contiguous, homogeneous data structure stored on the heap and referenced via a variable. Indexing is zero-based; accessing index >= length throws ArrayIndexOutOfBoundsException. Java also supports multi-dimensional arrays (arrays of arrays), and the length is accessed via the '.length' field (not a method).",
            example:
              "A cricket scoreboard showing runs per over is naturally an array: over[0], over[1], ... over[19] for a 20-over match — same data type (integer runs), fixed count, indexed access.",
            codeExampleJava:
              "int[] marks = {78, 85, 62, 91, 45};\nint total = 0;\nfor (int i = 0; i < marks.length; i++) {\n    total += marks[i];\n}\ndouble average = (double) total / marks.length;\nSystem.out.println(\"Average: \" + average);",
            visualType: "array",
            importantPoints: [
              "Array indices start at 0 and go up to length - 1.",
              "Arrays have a fixed size once created — use ArrayList/Vector if you need dynamic resizing.",
              "'.length' is a field for arrays, but '.length()' is a method for Strings — a very common mix-up.",
            ],
            commonMistakes: [
              "Off-by-one errors — looping with i <= marks.length causes an ArrayIndexOutOfBoundsException.",
              "Confusing array.length (no parentheses) with String.length() (with parentheses).",
            ],
            practiceQuestion:
              "Write a Java program that finds the largest and smallest element in an integer array of 6 elements using a single loop.",
          },
          {
            title: "String Handling",
            estimatedMinutes: 13,
            objectives: [
              "Understand String immutability",
              "Use core String methods (length, substring, charAt, equals)",
              "Differentiate String, StringBuffer and StringBuilder",
            ],
            easyExplanation:
              "A String in Java is text wrapped in double quotes. The tricky part: Strings are 'immutable' — once created, they can never be changed. Any operation that looks like it 'modifies' a String actually creates a brand-new String behind the scenes.",
            technicalExplanation:
              "java.lang.String objects are immutable and cached in the String pool for literals, improving memory efficiency but making repeated concatenation costly (O(n²) in loops). StringBuffer and StringBuilder provide mutable, resizable character sequences — StringBuffer is synchronized (thread-safe), StringBuilder is not, and is preferred for single-threaded performance-critical code.",
            example:
              "Editing a String is like photocopying a printed page to make a change — you always end up holding a new sheet, the original is untouched. StringBuilder is like using a whiteboard where you can erase and rewrite directly.",
            codeExampleJava:
              "String name = \"MUCodeX\";\nSystem.out.println(name.length());        // 7\nSystem.out.println(name.toUpperCase());   // MUCODEX\nSystem.out.println(name.substring(0, 2));  // MU\n\nStringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 3; i++) sb.append(i).append(\"-\");\nSystem.out.println(sb.toString()); // 1-2-3-",
            visualType: "none",
            importantPoints: [
              "Strings are immutable; use StringBuilder for heavy concatenation in loops.",
              "Use .equals() to compare String content, never '==' (which compares references).",
              "String indices for charAt()/substring() are also zero-based.",
            ],
            commonMistakes: [
              "Using '==' to compare String values instead of .equals().",
              "Concatenating Strings inside large loops with '+', causing performance issues.",
            ],
            practiceQuestion:
              "Write a program that checks if a given String is a palindrome, ignoring case (e.g. \"Madam\" should return true).",
          },
          {
            title: "Vectors & ArrayList",
            estimatedMinutes: 12,
            objectives: [
              "Understand dynamic-size collections",
              "Use add, get, remove and size operations",
              "Compare Vector vs ArrayList",
            ],
            easyExplanation:
              "Unlike arrays, a Vector (or ArrayList) is a growable list — you don't need to decide the size upfront. You can keep adding items, and it automatically resizes itself.",
            technicalExplanation:
              "java.util.Vector is a legacy, synchronized, dynamically resizable array-backed collection. ArrayList (java.util.ArrayList) is its modern, non-synchronized counterpart, generally preferred unless thread safety on the collection itself is required. Both implement the List interface and grow their internal array (typically doubling capacity) as elements are added beyond current capacity.",
            example:
              "A Vector is like a shopping cart at a supermarket — you don't fix how many items you'll buy in advance, you just keep adding items to the cart as you shop.",
            codeExampleJava:
              "import java.util.Vector;\n\nVector<String> subjects = new Vector<>();\nsubjects.add(\"OOPM\");\nsubjects.add(\"Data Structures\");\nsubjects.add(\"Discrete Structures\");\nsubjects.remove(\"Discrete Structures\");\n\nfor (String s : subjects) {\n    System.out.println(s);\n}\nSystem.out.println(\"Total: \" + subjects.size());",
            visualType: "array",
            importantPoints: [
              "Vector is synchronized (thread-safe); ArrayList is not — ArrayList is faster for single-threaded use.",
              "Both auto-resize, unlike plain arrays.",
              "Use generics (e.g. Vector<String>) to enforce type safety.",
            ],
            commonMistakes: [
              "Using index-based access without checking size(), causing IndexOutOfBoundsException.",
              "Forgetting to import java.util.Vector / java.util.ArrayList.",
            ],
            practiceQuestion:
              "Create a Vector of Integers, add 5 exam scores, then write code to compute and print their average.",
          },
        ],
      },
      {
        title: "Unit 4 — Inheritance & Polymorphism",
        description: "Reusing and extending behaviour across classes, and designing flexible interfaces.",
        topics: [
          {
            title: "Inheritance in Java",
            estimatedMinutes: 15,
            objectives: [
              "Use 'extends' to create a subclass",
              "Understand IS-A relationships",
              "Identify types of inheritance supported in Java",
            ],
            easyExplanation:
              "Inheritance lets a new class reuse the fields and methods of an existing class, instead of rewriting everything from scratch. A 'Dog' class can inherit basic traits from an 'Animal' class (like eat() and sleep()) and add its own (bark()).",
            technicalExplanation:
              "Inheritance establishes an IS-A relationship between a superclass (parent) and subclass (child) using the 'extends' keyword, enabling code reuse and hierarchical classification. Java supports single, multilevel, and hierarchical inheritance for classes, but not multiple inheritance of classes (to avoid the Diamond Problem) — multiple inheritance of type is instead achieved through interfaces.",
            example:
              "A 'SavingsAccount' and a 'CurrentAccount' both share common behaviour of a generic 'BankAccount' (deposit, withdraw), but each adds its own rules (interest for Savings, overdraft for Current) — a textbook case for inheritance.",
            codeExampleJava:
              "class Animal {\n    void eat() { System.out.println(\"This animal eats food\"); }\n}\n\nclass Dog extends Animal {\n    void bark() { System.out.println(\"The dog barks\"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();   // inherited from Animal\n        d.bark();  // defined in Dog\n    }\n}",
            visualType: "inheritance",
            importantPoints: [
              "Java supports single, multilevel and hierarchical inheritance for classes.",
              "Java does NOT support multiple inheritance via classes — use interfaces instead.",
              "A subclass inherits all non-private members of its superclass.",
            ],
            commonMistakes: [
              "Trying 'class C extends A, B' — Java does not allow extending two classes.",
              "Forgetting that private members of the superclass are not directly accessible in the subclass.",
            ],
            practiceQuestion:
              "Create a superclass 'Employee' with a method calculateSalary(), and a subclass 'Manager' that adds a bonus field and overrides calculateSalary() to include the bonus.",
          },
          {
            title: "Method Overriding & the super keyword",
            estimatedMinutes: 13,
            objectives: [
              "Override a superclass method in a subclass",
              "Use 'super' to call parent constructors/methods",
              "Understand runtime (dynamic) polymorphism",
            ],
            easyExplanation:
              "Overriding means a child class provides its own specific version of a method that it inherited. 'super' is how the child class can still reach back and use the parent's original version when needed.",
            technicalExplanation:
              "Method overriding occurs when a subclass redefines a method with the same signature as its superclass, enabling runtime (dynamic) polymorphism — the actual method invoked is determined by the object's runtime type, not the reference type. The 'super' keyword accesses the immediate superclass's overridden methods, fields, or constructor (super(...), which must be the first statement in the subclass constructor).",
            example:
              "A 'Bike' class might override a general 'Vehicle' class's startEngine() method to play a different sound, but can still call super.startEngine() first to run baseline checks before playing its own sound.",
            codeExampleJava:
              "class Vehicle {\n    void start() { System.out.println(\"Vehicle starting...\"); }\n}\n\nclass Car extends Vehicle {\n    @Override\n    void start() {\n        super.start();\n        System.out.println(\"Car engine roars to life\");\n    }\n}\n\n// Vehicle v = new Car();\n// v.start(); -> runs Car's overridden version (dynamic dispatch)",
            visualType: "inheritance",
            importantPoints: [
              "Overridden methods must have the same name, parameters and a compatible return type.",
              "'@Override' annotation isn't mandatory but helps catch mistakes at compile time.",
              "super() must be the first line inside a subclass constructor if used.",
            ],
            commonMistakes: [
              "Confusing overriding (runtime, inheritance-based) with overloading (compile-time, same class).",
              "Changing the access modifier to be more restrictive while overriding (not allowed).",
            ],
            practiceQuestion:
              "Create a class 'Shape' with method area() returning 0, and a subclass 'Circle' that overrides area() to return π×r². Demonstrate calling it via a Shape reference.",
          },
          {
            title: "Abstract Classes & Interfaces",
            estimatedMinutes: 14,
            objectives: [
              "Differentiate abstract classes from interfaces",
              "Implement multiple interfaces in one class",
              "Understand when to use each",
            ],
            easyExplanation:
              "An abstract class is a partially-built blueprint — some parts are ready to use, others must be completed by subclasses. An interface is more like a contract — a list of promises ('you must implement these actions') with no implementation of its own (mostly).",
            technicalExplanation:
              "An abstract class (declared with 'abstract') can have both abstract (unimplemented) and concrete methods, and cannot be instantiated directly. An interface declares method signatures that implementing classes must define (Java 8+ also allows default/static methods). A class can extend only one abstract class but can implement multiple interfaces, which is how Java approximates multiple inheritance of type.",
            example:
              "Think of 'Payable' as an interface — any class that promises to be Payable (Employee, Invoice, Vendor) must implement pay(). An abstract class 'Person' might already implement getName() but leave calculateSalary() abstract for subclasses like Employee to define.",
            codeExampleJava:
              "interface Payable {\n    void pay(double amount);\n}\n\nabstract class Person {\n    String name;\n    Person(String name) { this.name = name; }\n    abstract double calculateSalary();\n}\n\nclass Employee extends Person implements Payable {\n    Employee(String name) { super(name); }\n    double calculateSalary() { return 45000; }\n    public void pay(double amount) {\n        System.out.println(name + \" paid Rs.\" + amount);\n    }\n}",
            visualType: "inheritance",
            importantPoints: [
              "A class can implement multiple interfaces but extend only one class (abstract or concrete).",
              "Abstract classes can have constructors and instance fields; interfaces (pre-Java 8) cannot.",
              "Use an interface for a capability/contract, an abstract class for a shared partial implementation.",
            ],
            commonMistakes: [
              "Trying to instantiate an abstract class or interface directly with 'new'.",
              "Forgetting to implement every abstract method when implementing an interface, causing a compile error.",
            ],
            practiceQuestion:
              "Design an interface 'Drivable' with method drive(), and an abstract class 'Vehicle' with an abstract method fuelType(). Create a class 'Car' that extends Vehicle and implements Drivable.",
          },
        ],
      },
      {
        title: "Unit 5 — Exception Handling & Packages",
        description: "Writing robust programs that handle errors gracefully, and organising code into packages.",
        topics: [
          {
            title: "Exception Handling Basics",
            estimatedMinutes: 14,
            objectives: [
              "Use try-catch-finally blocks",
              "Understand checked vs unchecked exceptions",
              "Throw custom exceptions",
            ],
            easyExplanation:
              "Exception handling is your program's 'safety net'. Instead of crashing the moment something unexpected happens (like dividing by zero), you can 'catch' the problem and respond gracefully — like showing an error message instead of shutting down.",
            technicalExplanation:
              "Java exceptions are objects representing abnormal conditions, organised under the Throwable hierarchy (Error and Exception). Checked exceptions (e.g. IOException) must be declared or handled at compile time; unchecked exceptions (RuntimeException subclasses, e.g. ArithmeticException, NullPointerException) are not enforced by the compiler. A try block wraps risky code, catch blocks handle specific exception types, and finally always executes for cleanup, regardless of whether an exception occurred.",
            example:
              "It's like wearing a seatbelt (try block) and having airbags (catch block) in a car — you hope never to need them, but if an accident (exception) happens, they prevent a complete disaster and let you recover.",
            codeExampleJava:
              "public class Main {\n    public static void main(String[] args) {\n        int[] marks = {90, 85, 70};\n        try {\n            System.out.println(marks[5]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println(\"Invalid index: \" + e.getMessage());\n        } finally {\n            System.out.println(\"Execution completed\");\n        }\n    }\n}",
            visualType: "none",
            importantPoints: [
              "'finally' always runs, whether or not an exception was thrown or caught.",
              "Catch more specific exceptions before more general ones (e.g. ArithmeticException before Exception).",
              "Use 'throw' to raise an exception manually, and 'throws' to declare it in a method signature.",
            ],
            commonMistakes: [
              "Catching a generic 'Exception' everywhere, hiding real bugs instead of handling specific cases.",
              "Forgetting that code after an uncaught exception in a try block never executes.",
            ],
            practiceQuestion:
              "Write a program that accepts two integers and divides them, catching ArithmeticException for division by zero and printing a friendly message.",
          },
          {
            title: "Packages in Java",
            estimatedMinutes: 9,
            objectives: [
              "Understand the purpose of packages",
              "Create and import a user-defined package",
              "Use built-in packages like java.util",
            ],
            easyExplanation:
              "A package is like a labelled folder that groups related classes together, so large projects stay organised and avoid naming clashes — similar to how you organise college notes into subject-wise folders instead of one giant pile.",
            technicalExplanation:
              "A package is a namespace that organises a set of related classes and interfaces, declared using the 'package' keyword at the top of a file, and consumed elsewhere using 'import'. Packages help avoid name collisions, control access via package-private visibility, and make large codebases modular. Java ships built-in packages (java.util, java.io, java.lang — auto-imported) and supports user-defined packages matching directory structure.",
            example:
              "java.util is like the 'utilities' drawer in a kitchen — it bundles handy, related tools (ArrayList, Scanner, Collections) together instead of scattering them randomly across the codebase.",
            codeExampleJava:
              "package com.mucodex.util;\n\npublic class MathHelper {\n    public static int square(int n) { return n * n; }\n}\n\n// In another file:\n// import com.mucodex.util.MathHelper;\n// MathHelper.square(5); -> 25",
            visualType: "none",
            importantPoints: [
              "The 'package' statement, if present, must be the very first line in the file.",
              "java.lang is imported automatically; other packages need explicit import.",
              "Package names conventionally use reverse domain style, e.g. com.mucodex.app.",
            ],
            commonMistakes: [
              "Placing the package statement after import statements (must come first).",
              "Mismatched folder structure vs package declaration, causing compile/runtime errors.",
            ],
            practiceQuestion:
              "Create a package 'com.mucodex.shapes' containing a class Circle with a method area(double r). Show how you would import and use it from a Main class.",
          },
        ],
      },
    ],
  },
  {
    code: "CSC303",
    name: "Data Structures",
    branch: BRANCH,
    semester: 3,
    description:
      "Linear and non-linear data structures — arrays, stacks, queues, linked lists, sorting and searching — with implementation, complexity and MU exam focus.",
    icon: "layout-grid",
    colorTheme: "violet",
    units: [
      {
        title: "Unit 1 — Introduction & Arrays",
        description: "Foundational concepts of data structures and array-based storage.",
        topics: [
          {
            title: "Introduction to Data Structures",
            estimatedMinutes: 10,
            objectives: [
              "Define data structures and abstract data types (ADT)",
              "Classify linear vs non-linear structures",
              "Understand why structure choice affects performance",
            ],
            easyExplanation:
              "A data structure is simply a way of organising data so it can be used efficiently — like choosing between a queue, a stack of trays, or numbered lockers depending on what you need to do with the items.",
            technicalExplanation:
              "A Data Structure is a specific way of organising, storing and accessing data to enable efficient operations. An Abstract Data Type (ADT) defines the logical behaviour (operations) of a structure independent of implementation — e.g. a Stack ADT defines push/pop without dictating array or linked-list internals. Structures are broadly classified as Linear (array, stack, queue, linked list — elements arranged sequentially) or Non-linear (tree, graph — hierarchical/networked relationships).",
            example:
              "A to-do list app could store tasks as an array (fast access by position) or a linked list (easy insertion/deletion) — same goal, different structure, different trade-offs in speed and memory.",
            codeExampleJava:
              "// ADT example: Stack interface (logical view)\ninterface StackADT<T> {\n    void push(T item);\n    T pop();\n    T peek();\n    boolean isEmpty();\n}",
            visualType: "none",
            importantPoints: [
              "ADT = what operations are available; Data Structure = how they are implemented.",
              "Linear structures: array, stack, queue, linked list.",
              "Non-linear structures: tree, graph.",
            ],
            commonMistakes: [
              "Assuming one data structure is 'best' for everything — the right choice depends on the operations needed (search, insert, delete frequency).",
              "Confusing an ADT (interface/contract) with its underlying implementation.",
            ],
            practiceQuestion:
              "List 3 real-world scenarios and identify which data structure (array, stack, queue, or linked list) best fits each, with a one-line reason.",
          },
          {
            title: "Arrays as a Data Structure",
            estimatedMinutes: 12,
            objectives: [
              "Analyse time complexity of array operations",
              "Perform insertion and deletion in arrays",
              "Understand memory layout of arrays",
            ],
            easyExplanation:
              "An array stores elements in one continuous block of memory, side by side. That's what makes 'jumping' to any position instant (O(1)) — but inserting something in the middle means shifting everything after it, like squeezing a new person into a packed row of theatre seats.",
            technicalExplanation:
              "Arrays offer O(1) random access via index arithmetic (base_address + index × element_size), but insertion/deletion at an arbitrary position is O(n) due to the need to shift subsequent elements. Arrays have a static size in most languages (Java arrays are fixed at creation), making dynamic structures like ArrayList/LinkedList useful when frequent resizing is required.",
            example:
              "Searching for a seat number in a stadium (array with index) is instant. But inserting a new seat in the middle of a row means everyone after it has to shift over by one — that's the cost of array insertion.",
            codeExampleJava:
              "int[] arr = {10, 20, 30, 40, 50};\n// Insert 25 at index 2 (shift right)\nint[] result = new int[arr.length + 1];\nfor (int i = 0; i < 2; i++) result[i] = arr[i];\nresult[2] = 25;\nfor (int i = 2; i < arr.length; i++) result[i + 1] = arr[i];\n\nfor (int v : result) System.out.print(v + \" \");",
            visualType: "array",
            importantPoints: [
              "Access by index: O(1). Search (unsorted): O(n). Insert/Delete (middle): O(n).",
              "Java arrays have fixed size once created — resizing means creating a new array.",
              "Multi-dimensional arrays are stored as arrays of arrays (row-major order) in Java.",
            ],
            commonMistakes: [
              "Assuming arrays auto-resize like ArrayList — plain arrays never do.",
              "Off-by-one errors while shifting elements during manual insert/delete.",
            ],
            practiceQuestion:
              "Write a function to delete the element at a given index from an array and print the resulting array (shift elements left).",
          },
        ],
      },
      {
        title: "Unit 2 — Stacks & Queues",
        description: "LIFO and FIFO structures and their real-world applications.",
        topics: [
          {
            title: "Stack — Concept & Implementation",
            estimatedMinutes: 14,
            objectives: [
              "Implement push, pop and peek operations",
              "Understand LIFO ordering",
              "Identify real applications: undo, recursion, expression evaluation",
            ],
            easyExplanation:
              "A stack works exactly like a pile of plates — you can only add (push) or remove (pop) from the top. The last plate you placed is the first one you'll take off: Last In, First Out (LIFO).",
            technicalExplanation:
              "A Stack is a LIFO (Last-In-First-Out) linear data structure supporting push (insert at top), pop (remove from top) and peek (view top) operations, each O(1) when array/linked-list backed with a top pointer. Stacks underpin function call management (call stack), undo operations, expression parsing (infix-to-postfix), and backtracking algorithms like DFS.",
            example:
              "Your browser's 'Back' button behaves like a stack — the most recently visited page is the first one you return to when you click Back repeatedly.",
            codeExampleJava:
              "import java.util.Stack;\n\nStack<Integer> stack = new Stack<>();\nstack.push(10);\nstack.push(20);\nstack.push(30);\nSystem.out.println(stack.pop());  // 30 (last in, first out)\nSystem.out.println(stack.peek()); // 20\nSystem.out.println(stack.isEmpty()); // false",
            visualType: "stack",
            importantPoints: [
              "Stack follows LIFO — Last In, First Out.",
              "push(), pop() and peek() are all O(1) operations.",
              "Popping from an empty stack throws an EmptyStackException in Java's Stack class.",
            ],
            commonMistakes: [
              "Popping without checking isEmpty() first, causing runtime exceptions.",
              "Confusing stack (LIFO) behaviour with queue (FIFO) behaviour.",
            ],
            practiceQuestion:
              "Use a stack to check whether a given string of brackets, e.g. \"{[()]}\", is balanced.",
          },
          {
            title: "Queue — Concept & Implementation",
            estimatedMinutes: 13,
            objectives: [
              "Implement enqueue and dequeue operations",
              "Understand FIFO ordering",
              "Differentiate simple, circular and priority queues",
            ],
            easyExplanation:
              "A queue works like a line at a canteen counter — the first person to join the line is the first one served: First In, First Out (FIFO).",
            technicalExplanation:
              "A Queue is a FIFO (First-In-First-Out) linear data structure supporting enqueue (insert at rear) and dequeue (remove from front). Variants include circular queues (reuse freed space efficiently), and priority queues (dequeue order determined by priority, not arrival, typically implemented with a heap). Queues are foundational to CPU scheduling, printer spooling and BFS traversal.",
            example:
              "A print queue in an office: documents sent first are printed first, regardless of when someone sent a second request.",
            codeExampleJava:
              "import java.util.LinkedList;\nimport java.util.Queue;\n\nQueue<String> queue = new LinkedList<>();\nqueue.add(\"Print Job 1\");\nqueue.add(\"Print Job 2\");\nqueue.add(\"Print Job 3\");\n\nSystem.out.println(queue.poll()); // Print Job 1 (first in, first out)\nSystem.out.println(queue.peek()); // Print Job 2",
            visualType: "queue",
            importantPoints: [
              "Queue follows FIFO — First In, First Out.",
              "enqueue (add/offer) happens at the rear, dequeue (poll/remove) happens at the front.",
              "Circular queues solve the 'wasted space' problem of simple array-based queues.",
            ],
            commonMistakes: [
              "Dequeuing from an empty queue without a check, causing exceptions or invalid results.",
              "Mixing up front/rear pointers when manually implementing a circular queue.",
            ],
            practiceQuestion:
              "Simulate a ticket counter queue: enqueue 5 customer names, then dequeue and print them in the order they'd be served.",
          },
        ],
      },
      {
        title: "Unit 3 — Linked Lists",
        description: "Dynamic, pointer-based storage that grows and shrinks efficiently.",
        topics: [
          {
            title: "Singly Linked List",
            estimatedMinutes: 15,
            objectives: [
              "Understand node-based structure (data + next pointer)",
              "Implement insertion at head/tail",
              "Traverse and print a linked list",
            ],
            easyExplanation:
              "A linked list is a chain of boxes (nodes) where each box holds a value and a pointer to the next box. Unlike arrays, these boxes aren't stored side-by-side in memory — they're linked by 'address', like a treasure hunt where each clue points to the next location.",
            technicalExplanation:
              "A singly linked list consists of nodes, each containing data and a reference (next) to the subsequent node, with the list itself tracked via a head reference (and null terminating the tail). Insertion/deletion at the head is O(1); at an arbitrary position it's O(n) due to traversal, but unlike arrays, no shifting of elements is required — only pointer updates.",
            example:
              "A treasure hunt where each clue only tells you the location of the next clue (not all locations at once) is exactly how a singly linked list works — you must follow the chain from the start (head) to reach any node.",
            codeExampleJava:
              "class Node {\n    int data;\n    Node next;\n    Node(int data) { this.data = data; }\n}\n\nclass LinkedList {\n    Node head;\n\n    void insertAtHead(int value) {\n        Node newNode = new Node(value);\n        newNode.next = head;\n        head = newNode;\n    }\n\n    void printList() {\n        Node current = head;\n        while (current != null) {\n            System.out.print(current.data + \" -> \");\n            current = current.next;\n        }\n        System.out.println(\"null\");\n    }\n}",
            visualType: "linkedlist",
            importantPoints: [
              "Insertion at head is O(1); no shifting needed (unlike arrays).",
              "Traversal is always sequential from head — random access is O(n).",
              "The last node's 'next' reference is null, marking the end of the list.",
            ],
            commonMistakes: [
              "Losing the reference to the head node while inserting/traversing, orphaning the list.",
              "Forgetting to update 'next' pointers correctly, accidentally creating a cycle or dropping nodes.",
            ],
            practiceQuestion:
              "Write code to insert a new node at the END of a singly linked list (not the head), handling the empty-list case.",
          },
          {
            title: "Doubly Linked List",
            estimatedMinutes: 12,
            objectives: [
              "Understand forward and backward traversal",
              "Compare singly vs doubly linked lists",
              "Implement insertion with both pointers updated",
            ],
            easyExplanation:
              "A doubly linked list is like a singly linked list, but each box also points backward to the previous box — so you can walk the chain in both directions, not just forward.",
            technicalExplanation:
              "Each node in a doubly linked list maintains two references: 'next' (successor) and 'prev' (predecessor), enabling O(1) backward traversal and simpler deletion (no need to track the previous node separately during traversal). The trade-off is extra memory per node for the additional pointer.",
            example:
              "A doubly linked list is like a music playlist with both 'Next' and 'Previous' buttons — you're not stuck moving only forward like on a singly linked list (which is like a one-way playlist).",
            codeExampleJava:
              "class DNode {\n    int data;\n    DNode next, prev;\n    DNode(int data) { this.data = data; }\n}\n\nclass DoublyLinkedList {\n    DNode head;\n\n    void insertAtHead(int value) {\n        DNode newNode = new DNode(value);\n        if (head != null) {\n            newNode.next = head;\n            head.prev = newNode;\n        }\n        head = newNode;\n    }\n}",
            visualType: "linkedlist",
            importantPoints: [
              "Each node stores 2 pointers (next & prev) instead of 1.",
              "Deletion is easier because a node can find its predecessor directly.",
              "Uses slightly more memory per node than a singly linked list.",
            ],
            commonMistakes: [
              "Forgetting to update BOTH prev and next pointers during insertion/deletion, corrupting the list.",
              "Not handling the head/tail edge cases (null prev at head, null next at tail).",
            ],
            practiceQuestion:
              "Write a function to delete a given node (by value) from a doubly linked list, correctly reconnecting its neighbours.",
          },
        ],
      },
      {
        title: "Unit 4 — Sorting & Searching",
        description: "Classic algorithms for ordering and locating data, with complexity analysis.",
        topics: [
          {
            title: "Bubble Sort & Insertion Sort",
            estimatedMinutes: 14,
            objectives: [
              "Trace bubble sort and insertion sort step by step",
              "Analyse time complexity (best/worst case)",
              "Identify when simple sorts are still useful",
            ],
            easyExplanation:
              "Bubble sort repeatedly compares neighbouring elements and swaps them if they're in the wrong order — like bubbles rising, the largest values 'float' to the end with each pass. Insertion sort builds a sorted list one item at a time, like sorting playing cards in your hand.",
            technicalExplanation:
              "Bubble Sort repeatedly traverses the array, swapping adjacent out-of-order elements, achieving O(n²) time in the average/worst case and O(n) with an early-exit optimisation on a nearly sorted array. Insertion Sort builds the sorted portion incrementally by shifting larger elements right to insert the current element in its correct position, also O(n²) worst case but O(n) best case (already sorted) and efficient for small or nearly-sorted datasets.",
            example:
              "Bubble sort is like repeatedly scanning a line of people and swapping any two who are in the wrong height order — after several passes, the line ends up sorted. Insertion sort is how most people sort a hand of playing cards — picking each new card and inserting it into its correct position among the already-sorted ones.",
            codeExampleJava:
              "// Bubble Sort\nvoid bubbleSort(int[] arr) {\n    for (int i = 0; i < arr.length - 1; i++) {\n        for (int j = 0; j < arr.length - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}",
            visualType: "array",
            importantPoints: [
              "Bubble Sort: O(n²) average/worst, O(n) best (with swap-flag optimisation).",
              "Insertion Sort: O(n²) average/worst, O(n) best case — efficient for nearly sorted data.",
              "Both are stable sorts (equal elements retain their relative order).",
            ],
            commonMistakes: [
              "Forgetting the early-exit optimisation, making bubble sort always run the full n² passes even on sorted input.",
              "Off-by-one errors in the inner loop bounds, leading to ArrayIndexOutOfBoundsException.",
            ],
            practiceQuestion:
              "Trace insertion sort step-by-step on the array [9, 5, 1, 4, 3], showing the array state after each pass.",
          },
          {
            title: "Binary Search",
            estimatedMinutes: 11,
            objectives: [
              "Apply binary search on a sorted array",
              "Analyse O(log n) time complexity",
              "Compare linear search vs binary search",
            ],
            easyExplanation:
              "Binary search is how you'd find a word in a printed dictionary — you don't start from page 1; you open the middle, decide if your word is before or after it, and repeat on the smaller half. This is why it's so much faster than checking every page one by one.",
            technicalExplanation:
              "Binary Search operates on a sorted array by repeatedly comparing the target with the middle element and discarding the half that cannot contain the target, yielding O(log n) time complexity versus O(n) for linear search. It requires the input to be sorted beforehand, which is a key precondition often tested in MU exam questions.",
            example:
              "Guessing a number between 1–100 in the fewest tries: guessing 50 first, then narrowing to 25 or 75 based on 'higher/lower' feedback, is exactly the binary search strategy — at most ~7 guesses needed instead of 100.",
            codeExampleJava:
              "int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1; // not found\n}",
            visualType: "array",
            importantPoints: [
              "Binary search requires a SORTED array to work correctly.",
              "Time complexity is O(log n), dramatically faster than linear search's O(n) for large datasets.",
              "Can be implemented iteratively (O(1) space) or recursively (O(log n) call stack space).",
            ],
            commonMistakes: [
              "Applying binary search on an unsorted array, giving incorrect results.",
              "Integer overflow in 'mid = (low + high) / 2' for very large arrays (use low + (high-low)/2 in production code).",
            ],
            practiceQuestion:
              "Write a recursive version of binary search and trace it for target = 23 in the array [4, 12, 19, 23, 45, 67, 89].",
          },
        ],
      },
    ],
  },
  {
    code: "MCX-PY01",
    name: "Python Programming Foundations (MUCodeX Bridge Course)",
    branch: BRANCH,
    semester: 3,
    description:
      "A MUCodeX supplementary self-paced track that builds core Python skills for placements, competitive coding and cross-branch electives — complementing the Java-based MU syllabus.",
    icon: "code-2",
    colorTheme: "gold",
    units: [
      {
        title: "Unit 1 — Python Basics",
        description: "Getting comfortable with Python's syntax, variables and control flow.",
        topics: [
          {
            title: "Python Syntax & Variables",
            estimatedMinutes: 10,
            objectives: [
              "Write and run a basic Python script",
              "Declare variables without explicit types",
              "Understand Python's indentation-based blocks",
            ],
            easyExplanation:
              "Python is designed to read almost like English. You don't need to declare a variable's type — Python figures it out automatically. Instead of curly braces, Python uses indentation (spacing) to define blocks of code.",
            technicalExplanation:
              "Python is dynamically typed — a variable's type is inferred at runtime and can change as it's reassigned. Code blocks (if, for, function bodies) are defined by consistent indentation rather than braces, which is enforced by the interpreter (IndentationError otherwise). Python is interpreted, executed line-by-line by the CPython interpreter (or compiled to bytecode .pyc for the VM).",
            example:
              "Comparing to Java: where Java requires 'int age = 20;', Python simply allows 'age = 20' — the interpreter infers it's an integer. This reduces boilerplate significantly for beginners.",
            codeExamplePython:
              "name = \"Aarav\"\nsemester = 3\ngpa = 8.4\n\nprint(f\"{name} is in semester {semester} with GPA {gpa}\")",
            visualType: "variable",
            importantPoints: [
              "No semicolons or type declarations required in Python.",
              "Indentation is mandatory and defines code blocks — mixing tabs/spaces causes errors.",
              "Use f-strings (f\"...\") for clean, readable string formatting.",
            ],
            commonMistakes: [
              "Inconsistent indentation (mixing tabs and spaces) causing IndentationError.",
              "Forgetting that Python variable names are case-sensitive (Name != name).",
            ],
            practiceQuestion:
              "Write a Python script that stores your name, branch and semester in variables, then prints them using an f-string.",
          },
          {
            title: "Loops in Python",
            estimatedMinutes: 13,
            objectives: [
              "Use for loops with range() and iterables",
              "Use while loops for condition-based repetition",
              "Apply break and continue",
            ],
            easyExplanation:
              "A loop lets you repeat an action without rewriting code again and again — like telling someone 'do this 5 times' instead of writing the instruction 5 separate times.",
            technicalExplanation:
              "Python's 'for' loop iterates directly over iterables (lists, strings, range objects) rather than using explicit index counters, making it concise. 'while' loops repeat as long as a condition holds true, useful when the number of iterations isn't known upfront. 'break' exits a loop immediately; 'continue' skips to the next iteration.",
            example:
              "Printing multiplication tables, processing every item in a shopping cart, or repeatedly asking a user for valid input until they get it right, are all classic loop use-cases.",
            codeExamplePython:
              "# for loop with range\nfor i in range(1, 6):\n    print(f\"5 x {i} = {5 * i}\")\n\n# while loop\ncount = 0\nwhile count < 3:\n    print(\"Practicing...\", count)\n    count += 1",
            visualType: "loop",
            importantPoints: [
              "range(start, stop, step) — 'stop' is exclusive.",
              "'for' loops in Python iterate over items directly, not raw indices.",
              "Infinite while loops happen if the condition never becomes False — always update your loop variable.",
            ],
            commonMistakes: [
              "Forgetting range() excludes the stop value (range(1,5) gives 1,2,3,4, not 5).",
              "Writing a while loop and forgetting to update the condition variable, causing an infinite loop.",
            ],
            practiceQuestion:
              "Write a Python program using a for loop to print all even numbers between 1 and 20.",
          },
        ],
      },
      {
        title: "Unit 2 — Functions & Data Structures",
        description: "Structuring reusable logic and organising data with Python's built-in collections.",
        topics: [
          {
            title: "Functions in Python",
            estimatedMinutes: 12,
            objectives: [
              "Define functions with def",
              "Use default and keyword arguments",
              "Return values from functions",
            ],
            easyExplanation:
              "A function is a reusable, named block of instructions — write it once, then 'call' it by name whenever you need that action performed, optionally passing in different inputs.",
            technicalExplanation:
              "Functions are defined using 'def', support positional, default and keyword arguments, and can return any object (or None implicitly). Python functions are first-class objects — they can be assigned to variables, passed as arguments, or returned from other functions, enabling functional programming patterns.",
            example:
              "A function like calculate_grade(marks) is like a vending machine: you put in an input (marks), and it reliably gives back an output (grade) without you needing to know the internal logic each time.",
            codeExamplePython:
              "def calculate_grade(marks, passing=40):\n    if marks < passing:\n        return \"Fail\"\n    elif marks >= 75:\n        return \"Distinction\"\n    else:\n        return \"Pass\"\n\nprint(calculate_grade(82))       # Distinction\nprint(calculate_grade(35))       # Fail\nprint(calculate_grade(50, 45))   # Pass",
            visualType: "function",
            importantPoints: [
              "Functions without an explicit 'return' implicitly return None.",
              "Default arguments let you call a function with fewer arguments than defined.",
              "Keyword arguments improve readability: calculate_grade(marks=82).",
            ],
            commonMistakes: [
              "Forgetting to return a value and later using the (None) result in calculations.",
              "Using a mutable default argument (like a list), which persists unexpectedly across calls.",
            ],
            practiceQuestion:
              "Write a function is_prime(n) that returns True if n is a prime number, else False. Test it for 7 and 10.",
          },
          {
            title: "Lists and Dictionaries",
            estimatedMinutes: 14,
            objectives: [
              "Perform CRUD operations on lists",
              "Use dictionaries for key-value data",
              "Apply common list/dict methods",
            ],
            easyExplanation:
              "A list is an ordered collection you can add to, remove from, or change — like a to-do list. A dictionary stores information in labelled pairs (key: value), like a real dictionary where a word (key) maps to its meaning (value).",
            technicalExplanation:
              "Python lists are dynamic, ordered, mutable sequences supporting indexing, slicing, append/remove/insert operations. Dictionaries are hash-map based key-value structures offering O(1) average-case lookup, insertion and deletion by key, and are unordered prior to Python 3.7 but insertion-ordered from 3.7+.",
            example:
              "A student's marks in different subjects are best modelled as a dictionary: {\"OOPM\": 85, \"DS\": 78, \"DSGT\": 90} — looking up 'OOPM' instantly gives 85, without scanning a whole list.",
            codeExamplePython:
              "marks = {\"OOPM\": 85, \"Data Structures\": 78, \"DSGT\": 90}\nsubjects = list(marks.keys())\n\nfor subject, score in marks.items():\n    print(f\"{subject}: {score}\")\n\nmarks[\"Python\"] = 95     # add new key\naverage = sum(marks.values()) / len(marks)\nprint(\"Average:\", average)",
            visualType: "array",
            importantPoints: [
              "Lists are ordered & mutable; indices start at 0 like arrays.",
              "Dictionaries store unique keys mapped to values, with O(1) average lookup.",
              "Use .get(key, default) on dictionaries to avoid KeyError on missing keys.",
            ],
            commonMistakes: [
              "Accessing a missing dictionary key directly (dict[key]) instead of using .get(), causing a KeyError.",
              "Modifying a list while iterating over it directly, which can skip elements unexpectedly.",
            ],
            practiceQuestion:
              "Given a dictionary of 5 students and their marks, write code to print the name of the student with the highest marks.",
          },
        ],
      },
      {
        title: "Unit 3 — OOP in Python",
        description: "Applying object-oriented principles in Python's simpler, dynamic style.",
        topics: [
          {
            title: "Classes and Objects in Python",
            estimatedMinutes: 13,
            objectives: [
              "Define a class using the class keyword",
              "Use __init__ as a constructor",
              "Create and use objects with self",
            ],
            easyExplanation:
              "Just like in Java, a Python class is a blueprint for objects. The special method __init__ runs automatically when an object is created, and 'self' refers to the specific object being worked on.",
            technicalExplanation:
              "Python classes are defined with the 'class' keyword; the '__init__' dunder method acts as the constructor, called automatically by the object() invocation. 'self' is an explicit reference to the instance, passed as the first parameter to instance methods (Python does not use an implicit 'this' — it must be declared explicitly). Python supports single and multiple inheritance directly via class ClassName(Base1, Base2).",
            example:
              "Modelling the same 'Student' concept from Java, but in Python's lighter syntax — no explicit types, no semicolons, but the same OOP thinking of bundling data (name, semester) with behaviour (display()).",
            codeExamplePython:
              "class Student:\n    def __init__(self, name, semester):\n        self.name = name\n        self.semester = semester\n\n    def display(self):\n        print(f\"{self.name} | Semester {self.semester}\")\n\ns1 = Student(\"Aarav Patil\", 3)\ns2 = Student(\"Isha Shah\", 5)\ns1.display()\ns2.display()",
            visualType: "class",
            importantPoints: [
              "'self' must be the first parameter of every instance method, but you don't pass it explicitly when calling.",
              "__init__ is the constructor; Python has no separate 'new' keyword like Java.",
              "Python supports multiple inheritance directly: class C(A, B): ...",
            ],
            commonMistakes: [
              "Forgetting 'self' as the first parameter in method definitions.",
              "Confusing Python's dynamic attribute creation (any attribute can be added anytime) with Java's stricter field declarations.",
            ],
            practiceQuestion:
              "Create a Python class 'BankAccount' with __init__(self, holder, balance) and a method withdraw(self, amount) that reduces the balance if sufficient funds exist.",
          },
        ],
      },
    ],
  },
  {
    code: "CSC301",
    name: "Engineering Mathematics III",
    branch: BRANCH,
    semester: 3,
    description: "Complex variables, Laplace & Fourier transforms and numerical methods.",
    icon: "sigma",
    colorTheme: "slate",
    comingSoon: true,
    units: [
      {
        title: "Unit 1 — Complex Variables & Laplace Transforms",
        description: "Full module content is being curated by the MUCodeX team.",
        topics: [],
      },
    ],
  },
  {
    code: "CSC302",
    name: "Discrete Structures and Graph Theory",
    branch: BRANCH,
    semester: 3,
    description: "Set theory, relations, propositional logic, and graph theory fundamentals.",
    icon: "network",
    colorTheme: "slate",
    comingSoon: true,
    units: [
      {
        title: "Unit 1 — Set Theory & Logic",
        description: "Full module content is being curated by the MUCodeX team.",
        topics: [],
      },
    ],
  },
  {
    code: "CSC304",
    name: "Digital Logic & Computer Architecture",
    branch: BRANCH,
    semester: 3,
    description: "Number systems, boolean algebra, logic gates and processor organisation.",
    icon: "cpu",
    colorTheme: "slate",
    comingSoon: true,
    units: [
      {
        title: "Unit 1 — Number Systems & Boolean Algebra",
        description: "Full module content is being curated by the MUCodeX team.",
        topics: [],
      },
    ],
  },
];
