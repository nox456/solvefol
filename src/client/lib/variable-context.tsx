import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface VariableAssignment {
  variable: string
  premise: string
}

interface VariableContextType {
  variableAssignments: VariableAssignment[]
  updateVariableAssignments: (assignments: VariableAssignment[]) => void
  getVariablePremise: (variable: string) => string
  replaceVariablesWithPremises: (formula: string) => string
  replacePremisesWithVariables: (text: string) => string
  autoAssignPremises: (text: string) => VariableAssignment[]
}

const defaultVariables = ["p", "q", "r", "s"]

const defaultAssignments: VariableAssignment[] = defaultVariables.map((variable) => ({
  variable,
  premise: "",
}))

const VariableContext = createContext<VariableContextType | undefined>(undefined)

export function VariableProvider({ children }: { children: React.ReactNode }) {
  const [variableAssignments, setVariableAssignments] = useState<VariableAssignment[]>(defaultAssignments)

  // Load from localStorage on mount
  useEffect(() => {
    const savedAssignments = localStorage.getItem("variableAssignments")
    if (savedAssignments) {
      try {
        setVariableAssignments(JSON.parse(savedAssignments))
      } catch (error) {
        console.error("Failed to parse saved variable assignments:", error)
      }
    }
  }, [])

  // Save to localStorage when assignments change
  useEffect(() => {
    localStorage.setItem("variableAssignments", JSON.stringify(variableAssignments))
  }, [variableAssignments])

  const updateVariableAssignments = (assignments: VariableAssignment[]) => {
    setVariableAssignments(assignments)
  }

  const getVariablePremise = (variable: string): string => {
    const assignment = variableAssignments.find((a) => a.variable.toLowerCase() === variable.toLowerCase())
    return assignment?.premise || variable
  }

  // Update the replaceVariablesWithPremises function to handle quotes properly
  const replaceVariablesWithPremises = (formula: string): string => {
    // Only replace variables that have premises assigned
    let result = formula

    // Create a regex that matches whole variables (not parts of other text)
    variableAssignments.forEach((assignment) => {
      if (assignment.premise) {
        // Make it case-insensitive by using 'i' flag
        const regex = new RegExp(`\\b${assignment.variable}\\b`, "gi")
        // Don't add quotes here - they'll be added in the UI if needed
        result = result.replace(regex, assignment.premise)
      }
    })

    return result
  }

  // Improved replacePremisesWithVariables function with better debugging
  const replacePremisesWithVariables = (text: string): string => {
    // Skip if text is empty
    if (!text.trim()) return text

    // Skip if no assignments have premises
    const assignmentsWithPremises = variableAssignments.filter((a) => a.premise.trim())
    if (assignmentsWithPremises.length === 0) return text

    let result = text
    console.log("Starting premise replacement on:", text)

    // Replace premises with variables, starting with the longest premises first
    // to avoid partial replacements
    assignmentsWithPremises
      .sort((a, b) => b.premise.length - a.premise.length)
      .forEach((assignment) => {
        if (assignment.premise) {
          console.log(`Looking for premise: "${assignment.premise}" to replace with variable: ${assignment.variable}`)

          // Remove any quotes from the premise for matching
          const cleanPremise = assignment.premise.replace(/^"(.*)"$/, "$1")

          // Create more precise regex patterns that handle various ways the premise might appear
          // 1. Exact match with quotes: "the sky is blue"
          const withQuotesRegex = new RegExp(`"${escapeRegExp(cleanPremise)}"`, "gi")

          // 2. Exact match without quotes: the sky is blue
          const withoutQuotesRegex = new RegExp(`\\b${escapeRegExp(cleanPremise)}\\b`, "gi")

          // 3. Match at the beginning of a sentence: The sky is blue
          const capitalizedRegex = new RegExp(`\\b${escapeRegExp(capitalize(cleanPremise))}\\b`, "g")

          // Replace all occurrences with the variable
          const beforeReplacement = result
          result = result
            .replace(withQuotesRegex, assignment.variable)
            .replace(withoutQuotesRegex, assignment.variable)
            .replace(capitalizedRegex, assignment.variable)

          if (beforeReplacement !== result) {
            console.log(`Replaced "${cleanPremise}" with ${assignment.variable}`)
          }
        }
      })

    console.log("Final result after replacements:", result)
    return result
  }

  // Helper function to escape special characters in regex
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // Helper function to capitalize first letter
  const capitalize = (string: string) => {
    if (!string) return string
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Helper function to clean text by removing quotes and trimming
  const cleanText = (text: string): string => {
    return text
      .trim()
      .replace(/^"(.*)"$/, "$1")
      .replace(/"([^"]*)"/g, "$1")
  }

  // Function to extract potential premises from natural language text
  const extractPremises = (text: string): string[] => {
    // Clean the text first to remove any quotes
    const cleanedText = cleanText(text)

    // Split by common conjunctions and punctuation
    const splitText = cleanedText
      .replace(/\by\b|\bo\b|\bsi\b|\bentonces\b|\bpero\b|,|;/gi, "|||")
      .split("|||")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    // Filter out very short phrases and common logical connectives
    return splitText.filter(
      (phrase) => phrase.length > 3 && !phrase.match(/^(and|or|if|then|but|not|either|neither|both|when|unless)$/i),
    )
  }

  // Updated autoAssignPremises function to avoid detecting premises that already exist
  const autoAssignPremises = (text: string): VariableAssignment[] => {
    // Extract potential premises from the text
    const potentialPremises = extractPremises(text)

    if (potentialPremises.length === 0) {
      return []
    }

    // Get existing premises (normalized for comparison)
    const existingPremises = variableAssignments
      .filter((a) => a.premise.trim() !== "")
      .map((a) => a.premise.toLowerCase().trim())

    // Filter out premises that already exist in variable assignments
    const newPremises = potentialPremises.filter((premise) => {
      const normalizedPremise = cleanText(premise).toLowerCase().trim()
      return !existingPremises.some(
        (existing) =>
          existing === normalizedPremise ||
          normalizedPremise.includes(existing) ||
          existing.includes(normalizedPremise),
      )
    })

    if (newPremises.length === 0) {
      return []
    }

    // Find variables that don't have premises assigned yet
    const availableVariables = variableAssignments
      .filter((a) => !a.premise)
      .map((a) => a.variable)
      .sort()

    // Create assignments for as many premises as we have available variables
    const newAssignments: VariableAssignment[] = []

    for (let i = 0; i < Math.min(newPremises.length, availableVariables.length); i++) {
      // Ensure the premise doesn't have quotes
      const cleanPremise = cleanText(newPremises[i])

      newAssignments.push({
        variable: availableVariables[i],
        premise: cleanPremise,
      })
    }

    return newAssignments
  }

  return (
    <VariableContext.Provider
      value={{
        variableAssignments,
        updateVariableAssignments,
        getVariablePremise,
        replaceVariablesWithPremises,
        replacePremisesWithVariables,
        autoAssignPremises,
      }}
    >
      {children}
    </VariableContext.Provider>
  )
}

export function useVariables() {
  const context = useContext(VariableContext)
  if (context === undefined) {
    throw new Error("useVariables must be used within a VariableProvider")
  }
  return context
}
