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
    code: `function greet() {
  console.log("Hello, World!");
}`,
  },
  {
    name: "Type Definitions",
    code: `// Type aliases create structure for complex data
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
    code: `// Production pattern: async function with error handling
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
    code: `// State machine pattern with switch statement
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
    code: `// Classic imperative style: deep nesting with if/else chain
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
    code: `// Functional style: expression-heavy with array methods
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
    code: `// Composable style: small functions for readability
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
    code: `// JSX/TSX showing how UI code parses into function calls
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
