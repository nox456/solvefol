import type React from "react"
import { useState } from "react"
import { evaluateFormulaWithValues } from "../../lib/formula-evaluation"
import LogicKeyboard from "./logic-keyboard"
import VariableAssignments from "./variable-assignments"
import { useVariables } from "../../lib/variable-context"

export default function Calculator({
  formula,
  setFormula,
  addToHistory,
}: {
  formula: string
  setFormula: (formula: string) => void
  addToHistory: (formula: string, result: boolean | null) => void
}) {
  const [result, setResult] = useState<boolean | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, boolean>>({
    p: true,
    q: true,
    r: true,
    s: true,
  })
  const [showPremises, setShowPremises] = useState(false)

  const { variableAssignments, updateVariableAssignments, replaceVariablesWithPremises } = useVariables()

  // Extract variables from the formula
  const extractVariables = (formula: string): string[] => {
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

  const variables = extractVariables(formula)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormula(e.target.value)
    // Reset result when formula changes
    setResult(null)
  }

  const handleOperatorClick = (operator: string) => {
    setFormula((prev) => prev + operator)
    // Reset result when formula changes
    setResult(null)
  }

  const handleVariableClick = (variable: string) => {
    // Ensure we're using lowercase variables for consistency
    setFormula((prev) => prev + variable.toLowerCase())
    // Reset result when formula changes
    setResult(null)
  }

  const handleClear = () => {
    setFormula("")
    setResult(null)
  }

  const handleToggleVariableValue = (variable: string) => {
    const lowerVar = variable.toLowerCase()
    setVariableValues((prev) => ({
      ...prev,
      [lowerVar]: !prev[lowerVar],
    }))
    // Reset result when variable values change
    setResult(null)
  }

  const handleEvaluate = () => {
    if (!formula.trim()) {
      alert("Por favor ingresa una fórmula primero")
      return
    }

    try {
      const evalResult = evaluateFormulaWithValues(formula, variableValues)
      setResult(evalResult)
      addToHistory(formula, evalResult)
    } catch (error) {
      console.error("Error de evaluación:", error)
      setResult(null)
      addToHistory(formula, null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="formula" className="text-sm font-medium text-gray-700 ">
          Fórmula lógica
        </label>
        <input
          id="formula"
          value={formula}
          onChange={handleInputChange}
          placeholder="Ingresa una fórmula lógica (p ∧ q)"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
        />
      </div>

      <VariableAssignments assignments={variableAssignments} onAssignmentChange={updateVariableAssignments} />

      {variables.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700 ">Asignaciones de variables</h3>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showPremises}
                onChange={() => setShowPremises(!showPremises)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Mostrar premisas</span>
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {variables.map((variable) => (
              <div key={variable} className="flex items-center space-x-2">
                <div className="font-mono text-lg">
                  {showPremises && variableAssignments.find((a) => a.variable === variable)?.premise
                    ? `"${variableAssignments.find((a) => a.variable === variable)?.premise}"`
                    : variable}
                  :
                </div>
                <button
                  onClick={() => handleToggleVariableValue(variable)}
                  className={`px-3 py-1 min-w-[70px] rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    variableValues[variable]
                      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500"
                  }`}
                >
                  {variableValues[variable] ? "Verdadero" : "Falso"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <LogicKeyboard
        onOperatorClick={handleOperatorClick}
        onVariableClick={handleVariableClick}
        onClear={handleClear}
      />

      <div className="mt-4">
        <button
          onClick={handleEvaluate}
          className="w-full px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Evaluar
        </button>
      </div>

      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Resultado:</h3>
          <div className="text-2xl font-bold">{result ? "Verdadero" : "Falso"}</div>
          <div className="mt-2 text-sm text-gray-600 ">
            Con asignaciones de variables:{" "}
            {variables
              .map((v) => {
                const premise = showPremises ? variableAssignments.find((a) => a.variable === v)?.premise : null
                const displayName = premise ? `"${premise}"` : v
                return `${displayName}=${variableValues[v] ? "V" : "F"}`
              })
              .join(", ")}
          </div>
        </div>
      )}
    </div>
  )
}
