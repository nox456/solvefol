export function evaluateFormulaWithValues(formula: string, values: Record<string, boolean>): boolean {
  try {
    // Replace variables with their values
    // Use word boundaries to ensure we only replace whole variables
    let expression = formula
    for (const [variable, value] of Object.entries(values)) {
      // Create a regex that matches the variable as a whole word, case-insensitive
      const regex = new RegExp(`\\b${variable}\\b`, "gi")
      expression = expression.replace(regex, value ? "true" : "false")
    }

    // Handle special case for negation which might be adjacent to variables
    expression = expression.replace(/¬\s*true/g, "false")
    expression = expression.replace(/¬\s*false/g, "true")

    // Replace logical operators with spaces around them
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

    // Add debugging
    console.log("Original formula:", formula)
    console.log("Variable values:", values)
    console.log("Processed expression:", expression)

    // Further simplification (very basic)
    if (expression.includes("true") && !expression.includes("false")) {
      return true
    }
    if (expression.includes("false") && !expression.includes("true")) {
      return false
    }

    // If we can't fully resolve, implement a more thorough evaluation
    // This is a simplified approach - in a real app, you'd use a proper parser

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
  } catch (error) {
    console.error("Error evaluating formula:", error)
    return false // Or throw the error, depending on desired behavior
  }
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
