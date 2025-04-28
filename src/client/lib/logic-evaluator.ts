// Simple first-order logic evaluator

// Extract variables from a formula
function extractVariables(formula: string): string[] {
  const variables = new Set<string>()
  const validVars = ["p", "q", "r", "s", "t"]

  for (const char of formula) {
    const lowerChar = char.toLowerCase()
    if (validVars.includes(lowerChar)) {
      // Always store as lowercase for consistency
      variables.add(lowerChar)
    }
  }

  return Array.from(variables).sort()
}

// Evaluate a simple logical expression with given variable values
function evaluate(formula: string, values: Record<string, boolean>): boolean {
  // Replace variables with their values
  let expression = formula
  for (const [variable, value] of Object.entries(values)) {
    // Create a regex that matches the variable as a whole word, case-insensitive
    const regex = new RegExp(`\\b${variable}\\b`, "gi")
    expression = expression.replace(regex, value ? "true" : "false")
  }

  // Handle special case for negation which might be adjacent to variables
  expression = expression.replace(/¬\s*true/g, "false")
  expression = expression.replace(/¬\s*false/g, "true")

  // Replace logical operators
  expression = expression
    .replace(/true\s*∧\s*true/g, "true")
    .replace(/true\s*∧\s*false/g, "false")
    .replace(/false\s*∧\s*true/g, "false")
    .replace(/false\s*∧\s*false/g, "false")
    .replace(/true\s*∨\s*true/g, "true")
    .replace(/true\s*∨\s*false/g, "true")
    .replace(/false\s*∨\s*true/g, "true")
    .replace(/false\s*∨\s*false/g, "false")
    .replace(/true\s*→\s*true/g, "true")
    .replace(/true\s*→\s*false/g, "false")
    .replace(/false\s*→\s*true/g, "true")
    .replace(/false\s*→\s*false/g, "true")
    .replace(/true\s*↔\s*true/g, "true")
    .replace(/true\s*↔\s*false/g, "false")
    .replace(/false\s*↔\s*true/g, "false")
    .replace(/false\s*↔\s*false/g, "true")

  // Handle parentheses by evaluating innermost expressions first
  while (expression.includes("(") && expression.includes(")")) {
    const innerExprMatch = expression.match(/$$[^()]*$$/)
    if (!innerExprMatch) break

    const innerExpr = innerExprMatch[0].slice(1, -1) // Remove parentheses
    const innerResult = evaluateSimpleExpression(innerExpr)
    expression = expression.replace(innerExprMatch[0], innerResult ? "true" : "false")
  }

  // Evaluate the final expression
  return evaluateSimpleExpression(expression)
}

// Helper function to evaluate simple expressions without parentheses
function evaluateSimpleExpression(expr: string): boolean {
  // First handle NOT operations
  while (expr.includes("¬")) {
    expr = expr.replace(/¬\s*true/g, "false").replace(/¬\s*false/g, "true")
  }

  // Then handle AND operations
  while (expr.includes("∧")) {
    expr = expr
      .replace(/true\s*∧\s*true/g, "true")
      .replace(/true\s*∧\s*false/g, "false")
      .replace(/false\s*∧\s*true/g, "false")
      .replace(/false\s*∧\s*false/g, "false")
  }

  // Then handle OR operations
  while (expr.includes("∨")) {
    expr = expr
      .replace(/true\s*∨\s*true/g, "true")
      .replace(/true\s*∨\s*false/g, "true")
      .replace(/false\s*∨\s*true/g, "true")
      .replace(/false\s*∨\s*false/g, "false")
  }

  // Then handle IMPLIES operations
  while (expr.includes("→")) {
    expr = expr
      .replace(/true\s*→\s*true/g, "true")
      .replace(/true\s*→\s*false/g, "false")
      .replace(/false\s*→\s*true/g, "true")
      .replace(/false\s*→\s*false/g, "true")
  }

  // Finally handle IFF operations
  while (expr.includes("↔")) {
    expr = expr
      .replace(/true\s*↔\s*true/g, "true")
      .replace(/true\s*↔\s*false/g, "false")
      .replace(/false\s*↔\s*true/g, "false")
      .replace(/false\s*↔\s*false/g, "true")
  }

  // Check the final result
  return expr.trim() === "true"
}

// Generate all possible combinations of variable values
function generateCombinations(variables: string[]): Record<string, boolean>[] {
  const combinations: Record<string, boolean>[] = []
  const numCombinations = Math.pow(2, variables.length)

  for (let i = 0; i < numCombinations; i++) {
    const combination: Record<string, boolean> = {}
    for (let j = 0; j < variables.length; j++) {
      combination[variables[j]] = !!(i & (1 << j))
    }
    combinations.push(combination)
  }

  return combinations
}

// Main function to evaluate a formula
export function evaluateFormula(formula: string): boolean {
  // This is a simplified implementation
  // In a real app, you'd use a proper parser and evaluator
  const variables = extractVariables(formula)
  if (variables.length === 0) {
    throw new Error("No variables found in formula")
  }

  // For demo purposes, we'll just evaluate with all variables set to true
  const values: Record<string, boolean> = {}
  for (const variable of variables) {
    values[variable] = true
  }

  return evaluate(formula, values)
}

// Evaluate a formula with specific variable values
export function evaluateFormulaWithValues(formula: string, values: Record<string, boolean>): boolean {
  const variables = extractVariables(formula)
  if (variables.length === 0) {
    throw new Error("No variables found in formula")
  }

  // Use the provided variable values
  return evaluate(formula, values)
}

// Generate a truth table for a formula
export function generateTruthTable(formula: string): { headers: string[]; rows: (boolean | string)[][] } {
  const variables = extractVariables(formula)
  if (variables.length === 0 || variables.length > 4) {
    // Limit to 4 variables to avoid too many rows
    return { headers: [], rows: [] }
  }

  const combinations = generateCombinations(variables)
  const headers = [...variables, formula]
  const rows: (boolean | string)[][] = []

  for (const combination of combinations) {
    try {
      const result = evaluate(formula, combination)
      const row = [...variables.map((v) => combination[v]), result]
      rows.push(row)
    } catch (error) {
      console.error("Error evaluating formula:", error)
    }
  }

  return { headers, rows }
}
