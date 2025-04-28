// Converter functions for translating between logic formulas and natural language

// Helper function to tokenize a logic formula
function tokenizeFormula(formula: string): string[] {
  // Replace operators with spaces around them for easier tokenization
  const preparedFormula = formula
    .replace(/∧/g, " ∧ ")
    .replace(/∨/g, " ∨ ")
    .replace(/→/g, " → ")
    .replace(/↔/g, " ↔ ")
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    // Handle negation specially to keep it attached to variables
    .replace(/¬\s+/g, "¬")

  // Split by whitespace and filter out empty tokens
  return preparedFormula
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.trim())
}

// Helper function to parse a logic formula and convert to natural language
function parseFormula(tokens: string[], startIndex = 0): { text: string; endIndex: number } {
  let result = ""
  let i = startIndex

  while (i < tokens.length) {
    const token = tokens[i]

    if (token === "(") {
      // Parse subexpression in parentheses
      const subExpr = parseFormula(tokens, i + 1)
      result = subExpr.text
      i = subExpr.endIndex + 1
    } else if (token === ")") {
      // End of current subexpression
      return { text: result, endIndex: i }
    } else if (token === "∧" || token === "∨" || token === "→" || token === "↔") {
      // Binary operator
      const operator = token
      const right = parseFormula(tokens, i + 1)

      // Format based on operator
      if (operator === "∧") {
        result = `${result} y ${right.text}`
      } else if (operator === "∨") {
        result = `${result} o ${right.text}`
      } else if (operator === "→") {
        result = `si ${result}, entonces ${right.text}`
      } else if (operator === "↔") {
        result = `${result} si y solo si ${right.text}`
      }

      i = right.endIndex + 1
    } else {
      // Variable or negated variable
      if (token.startsWith("¬")) {
        result = `no ${token.substring(1)}`
      } else {
        result = token
      }
      i++
    }
  }

  return { text: result, endIndex: i - 1 }
}

// Convert a logic formula to natural language
export function convertToNaturalLanguage(formula: string): string {
  try {
    const tokens = tokenizeFormula(formula)
    if (tokens.length === 0) {
      return ""
    }

    const result = parseFormula(tokens)

    // Capitalize first letter
    return result.text.charAt(0).toUpperCase() + result.text.slice(1)
  } catch (error) {
    console.error("Error converting to natural language:", error)
    throw new Error("Invalid logic formula")
  }
}

// Helper function to tokenize natural language
function tokenizeNaturalLanguage(text: string): string[] {
  // Normalize spaces and punctuation
  const normalized = text
    .toLowerCase()
    .replace(/[.,;:!?]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return normalized.split(" ")
}

// Update the convertToLogicFormula function to better handle variable processing
export function convertToLogicFormula(naturalLanguage: string): string {
  try {
    // Check if the input already contains logic variables (p, q, r, s, etc.)
    // If so, we need to handle them specially
    const containsVariables = /\b[pqrst]\b/i.test(naturalLanguage)

    const tokens = tokenizeNaturalLanguage(naturalLanguage)
    if (tokens.length === 0) {
      return ""
    }

    let formula = ""
    let i = 0

    // Process tokens
    while (i < tokens.length) {
      const token = tokens[i]

      if (token === "si" && i + 2 < tokens.length && tokens[i + 1] === "y" && tokens[i + 2] === "solo") {
        // Handle "if and only if"
        const leftSide = formula
        formula = ""
        i += 3 // Skip "if and only"

        // Skip "if" if present
        if (i < tokens.length && tokens[i] === "si") {
          i++
        }

        // Process right side
        while (i < tokens.length) {
          formula += processNaturalToken(tokens[i])
          i++
        }

        formula = `${leftSide} ↔ ${formula}`
      } else if (token === "si") {
        // Handle "if ... then ..."
        const condition = []
        i++ // Skip "if"

        // Collect condition until "then"
        while (i < tokens.length && tokens[i] !== "entonces") {
          condition.push(tokens[i])
          i++
        }

        if (i < tokens.length && tokens[i] === "entonces") {
          i++ // Skip "then"
        }

        const conditionFormula = convertToLogicFormula(condition.join(" "))
        const consequent = tokens.slice(i).join(" ")
        const consequentFormula = convertToLogicFormula(consequent)

        formula = `${conditionFormula} → ${consequentFormula}`
        break // We've processed everything
      } else if (token === "no" || (token === "es" && i + 1 < tokens.length && tokens[i + 1] === "no")) {
        // Handle negation
        if (token === "es") {
          i += 2 // Skip "it's not"
        } else {
          i++ // Skip "not"
        }

        // Check for "the case that"
        if (i + 2 < tokens.length && tokens[i] === "en" && tokens[i + 1] === "caso" && tokens[i + 2] === "que") {
          i += 3 // Skip "the case that"
          const subExpr = tokens.slice(i).join(" ")
          formula += `¬(${convertToLogicFormula(subExpr)})`
          break // We've processed everything
        } else {
          // Simple negation
          const nextToken = tokens[i]
          formula += `¬${nextToken}`
          i++
        }
      } else if (token === "cualquiera") {
        // Handle "either ... or ..."
        i++ // Skip "either"
        const left = []

        // Collect left side until "or"
        while (i < tokens.length && tokens[i] !== "o") {
          left.push(tokens[i])
          i++
        }

        if (i < tokens.length && tokens[i] === "o") {
          i++ // Skip "or"
        }

        const leftFormula = convertToLogicFormula(left.join(" "))
        const right = tokens.slice(i).join(" ")
        const rightFormula = convertToLogicFormula(right)

        formula = `${leftFormula} ∨ ${rightFormula}`
        break // We've processed everything
      } else if (token === "y") {
        // Handle "and" conjunction
        const leftSide = formula
        formula = ""
        i++ // Skip "and"

        // Process right side
        const right = tokens.slice(i).join(" ")
        const rightFormula = convertToLogicFormula(right)

        formula = `${leftSide} ∧ ${rightFormula}`
        break // We've processed everything
      } else if (token === "o") {
        // Handle "or" disjunction
        const leftSide = formula
        formula = ""
        i++ // Skip "or"

        // Process right side
        const right = tokens.slice(i).join(" ")
        const rightFormula = convertToLogicFormula(right)

        formula = `${leftSide} ∨ ${rightFormula}`
        break // We've processed everything
      } else {
        // Handle variables and other tokens
        formula += processNaturalToken(token)
        i++
      }
    }

    return formula
  } catch (error) {
    console.error("Error converting to logic formula:", error)
    throw new Error("Invalid natural language input")
  }
}

// Helper to process individual natural language tokens
function processNaturalToken(token: string): string {
  // If token is already a variable (p, q, r, s, t), return it as is
  if (/^[pqrst]$/i.test(token)) {
    return token.toLowerCase()
  }

  // Handle common phrases
  switch (token.toLowerCase()) {
    case "true":
      return "⊤"
    case "false":
      return "⊥"
    default:
      return token
  }
}
