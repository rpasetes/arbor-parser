/**
 * Preset Code Examples
 *
 * PARSING INSIGHT: Progressive Complexity in ASTs
 * ================================================
 * These examples demonstrate how AST complexity grows with code features.
 * Each shows real-world patterns developers actually write, highlighting
 * how different coding choices create different tree structures.
 */

export interface Example {
  name: string;
  code: string;
}

export const examples: Example[] = [
  {
    name: "Hello World",
    code: `/**
 * Hello World - Your First AST
 *
 * Hover over any node in the tree to see its code highlighted!
 * Try switching between Nodes and Rings views to explore different
 * ways of visualizing the same structure.
 */

function greet() {
  console.log("Hello, World!");
}`,
  },
  {
    name: "Generic Arrow Function",
    code: `/**
 * TSX Parser Quirk: Generic Arrow Functions
 *
 * Arrow function generics need a trailing comma in TSX mode.
 * Without it: <T> looks like a JSX opening tag!
 *
 * Try removing the comma to see how the AST changes.
 */

const identity = <T,>(x: T): T => x;

const result = identity<string>("hello");`,
  },
  {
    name: "Type Definitions",
    code: `/**
 * Type Definitions
 *
 * Interfaces and type aliases create structure for complex data.
 * Notice how the parser handles generic type parameters.
 */

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

type ApiResponse<T> = {
  data: T;
  status: number;
  error?: string;
};`,
  },
  {
    name: "API Handler",
    code: `/**
 * API Handler with Error Handling
 *
 * Production pattern: async function with try/catch blocks.
 * Notice the nested structure of the try/catch AST nodes.
 */

async function fetchUser(userId: string) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}`,
  },
  {
    name: "Switch/Case Router",
    code: `/**
 * Switch Statement Router
 *
 * State machine pattern using switch/case for action handling.
 * Each case creates a separate branch in the AST.
 */

function handleAction(action: string, payload: any) {
  switch (action) {
    case "LOGIN":
      return authenticateUser(payload);

    case "LOGOUT":
      return clearSession();

    case "UPDATE_PROFILE":
      return updateUserProfile(payload);

    case "DELETE_ACCOUNT":
      if (payload.confirmed) {
        return deleteUser();
      }
      return { error: "Confirmation required" };

    default:
      return { error: "Unknown action" };
  }
}`,
  },
  {
    name: "FizzBuzz: Imperative",
    code: `/**
 * FizzBuzz: Imperative Style
 *
 * Classic approach with deep nesting through if/else chains.
 * Notice the nested IfStatement and Block nodes in the tree.
 */

function fizzBuzz(n: number) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}`,
  },
  {
    name: "FizzBuzz: Functional",
    code: `/**
 * FizzBuzz: Functional Style
 *
 * Expression-heavy approach using array methods and ternary operators.
 * Compare this flatter structure to the imperative version's deep nesting.
 */

const fizzBuzz = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1)
    .map(i =>
      i % 15 === 0 ? "FizzBuzz" :
      i % 3 === 0 ? "Fizz" :
      i % 5 === 0 ? "Buzz" :
      i
    )
    .forEach(x => console.log(x));`,
  },
  {
    name: "FizzBuzz: Composable",
    code: `/**
 * FizzBuzz: Composable Style
 *
 * Small, focused functions composed together for clarity.
 * Notice how multiple FunctionDeclarations create separate subtrees.
 */

function isDivisibleBy(n: number) {
  return (x: number) => x % n === 0;
}

function fizzBuzzValue(i: number): string | number {
  const div3 = isDivisibleBy(3)(i);
  const div5 = isDivisibleBy(5)(i);

  if (div3 && div5) return "FizzBuzz";
  if (div3) return "Fizz";
  if (div5) return "Buzz";
  return i;
}

function fizzBuzz(n: number) {
  for (let i = 1; i <= n; i++) {
    console.log(fizzBuzzValue(i));
  }
}`,
  },
  {
    name: "React Component",
    code: `/**
 * React Component with JSX
 *
 * JSX syntax creates JsxElement nodes in the AST.
 * See how <button> becomes structured JsxOpeningElement/JsxClosingElement.
 */

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}`,
  },
];
