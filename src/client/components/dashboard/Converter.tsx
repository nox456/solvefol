import { useState, useEffect, useRef } from "react"
import { convertToNaturalLanguage, convertToLogicFormula } from "../../lib/converter"
import LogicKeyboard from "./logic-keyboard"
import VariableAssignments from "./variable-assignments"
import { useVariables } from "../../lib/variable-context"

export default function Converter() {
  const [logicFormula, setLogicFormula] = useState("")
  const [naturalLanguage, setNaturalLanguage] = useState("")
  const [conversionDirection, setConversionDirection] = useState<"toNatural" | "toLogic">("toNatural")
  const [conversionResult, setConversionResult] = useState("")
  const [error, setError] = useState("")
  const [showPremises, setShowPremises] = useState(false)
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [autoAssignments, setAutoAssignments] = useState<{ variable: string; premise: string }[]>([])
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false)

  // Store the pending conversion input to process after auto-assignment
  const pendingConversionRef = useRef<string | null>(null)

  const {
    variableAssignments,
    updateVariableAssignments,
    replaceVariablesWithPremises,
    replacePremisesWithVariables,
    autoAssignPremises,
  } = useVariables()

  // Reset auto assignments when direction changes
  useEffect(() => {
    setAutoAssignments([])
    pendingConversionRef.current = null
  }, [conversionDirection])

  // Effect to process conversion after variable assignments change
  useEffect(() => {
    // If we have a pending conversion and no modal is showing, process it
    if (pendingConversionRef.current && !showAutoAssignModal) {
      const inputToProcess = pendingConversionRef.current
      pendingConversionRef.current = null // Clear the pending conversion

      try {
        // Process the input with the updated variable assignments
        const processedInput = replacePremisesWithVariables(inputToProcess)
        const result = convertToLogicFormula(processedInput)
        setConversionResult(result)
        setLogicFormula(result)
      } catch (err) {
        setError(`Conversion error: ${err instanceof Error ? err.message : String(err)}`)
        setConversionResult("")
      }
    }
  }, [variableAssignments, showAutoAssignModal, replacePremisesWithVariables])

  // Update the handleConvert function to fix the double-click issue
  const handleConvert = () => {
    setError("")
    try {
      if (conversionDirection === "toNatural") {
        if (!logicFormula.trim()) {
          setError("Por favor ingresa una fórmula lógica")
          return
        }

        // Convert to natural language
        let result = convertToNaturalLanguage(logicFormula)

        // Replace variables with premises if requested
        if (showPremises) {
          result = replaceVariablesWithPremises(result)
        }

        setConversionResult(result)
        setNaturalLanguage(result)
      } else {
        if (!naturalLanguage.trim()) {
          setError("Por favor ingresa premisas en lenguaje natural")
          return
        }

        // Store the current input for potential later processing
        pendingConversionRef.current = naturalLanguage

        // Check if we should try to auto-assign premises
        if (autoAssignEnabled) {
          const newAssignments = autoAssignPremises(naturalLanguage)
          if (newAssignments.length > 0) {
            setAutoAssignments(newAssignments)
            setShowAutoAssignModal(true)
            return
          }
        }

        // If no auto-assignments needed, process immediately
        const processedInput = replacePremisesWithVariables(naturalLanguage)
        const result = convertToLogicFormula(processedInput)
        setConversionResult(result)
        setLogicFormula(result)
        pendingConversionRef.current = null // Clear pending since we processed it
      }
    } catch (err) {
      setError(`Conversion error: ${err instanceof Error ? err.message : String(err)}`)
      setConversionResult("")
    }
  }

  // Update the handleAcceptAutoAssignments function to properly handle state updates
  const handleAcceptAutoAssignments = () => {
    // Update the variable assignments with the auto-detected ones
    const updatedAssignments = variableAssignments.map((a) => {
      // If this variable is in autoAssignments, use that premise
      const autoAssignment = autoAssignments.find((aa) => aa.variable === a.variable)
      if (autoAssignment) {
        return { ...a, premise: autoAssignment.premise }
      }
      return a
    })

    // Close the modal first
    setShowAutoAssignModal(false)

    // Then update assignments - this will trigger the useEffect to process the pending conversion
    updateVariableAssignments(updatedAssignments)
  }

  const handleClear = () => {
    if (conversionDirection === "toNatural") {
      setLogicFormula("")
    } else {
      setNaturalLanguage("")
    }
    setConversionResult("")
    setError("")
    setAutoAssignments([])
    pendingConversionRef.current = null
  }

  const handleSwitch = () => {
    setConversionDirection(conversionDirection === "toNatural" ? "toLogic" : "toNatural")
    setConversionResult("")
    setError("")
    setAutoAssignments([])
    pendingConversionRef.current = null
  }

  const handleOperatorClick = (operator: string) => {
    if (conversionDirection === "toNatural") {
      setLogicFormula((prev) => prev + operator)
    }
  }

  const handleVariableClick = (variable: string) => {
    if (conversionDirection === "toNatural") {
      setLogicFormula((prev) => prev + variable)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Formula logica ⟷ Lenguaje natural</h2>
        <p className="text-gray-600 mb-4">
          Convertir entre fórmulas lógicas y premisas en lenguaje natural.
        </p>
      </div>

      <VariableAssignments assignments={variableAssignments} onAssignmentChange={updateVariableAssignments} />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="font-medium">Convertir de:</div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setConversionDirection("toNatural")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                conversionDirection === "toNatural"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:bg-gray-200 "
              }`}
            >
              Formula lógica
            </button>
            <button
              onClick={() => setConversionDirection("toLogic")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                conversionDirection === "toLogic"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:bg-gray-200 "
              }`}
            >
              Lenguaje natural
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showPremises}
              onChange={() => setShowPremises(!showPremises)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Usar asignaciones de variables</span>
          </label>

          {conversionDirection === "toLogic" && (
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoAssignEnabled}
                onChange={() => setAutoAssignEnabled(!autoAssignEnabled)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Auto-asignar premisas</span>
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {conversionDirection === "toNatural" ? "Formula Logica" : "Lenguaje Natural"}
          </label>
          <textarea
            value={conversionDirection === "toNatural" ? logicFormula : naturalLanguage}
            onChange={(e) =>
              conversionDirection === "toNatural" ? setLogicFormula(e.target.value) : setNaturalLanguage(e.target.value)
            }
            placeholder={
              conversionDirection === "toNatural"
                ? "Ingresa una fórmula lógica (p ∧ q → r)"
                : "Ingresa lenguaje natural (e.g., Si es lluvioso y el suelo está húmedo, entonces hay pozos)"
            }
            className="w-full h-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
          />

          {/* Logic Keyboard - only show when in Logic Formula mode */}
          {conversionDirection === "toNatural" && (
            <div className="mt-4">
              <LogicKeyboard
                onOperatorClick={handleOperatorClick}
                onVariableClick={handleVariableClick}
                onClear={handleClear}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {conversionDirection === "toNatural" ? "Lenguaje natural" : "Formula lógica"}
          </label>
          <textarea
            value={conversionResult}
            readOnly
            placeholder="El resultado de la conversión aparecerá aquí"
            className="w-full h-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
          />

          <div className="mt-4">
            <button
              onClick={handleConvert}
              className="w-full px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Convertir
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex space-x-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Limpiar todo
        </button>
        <button
          onClick={handleSwitch}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Invertir dirección
        </button>
      </div>

      {/* Auto-assignment modal - Updated to display premises without quotes in the UI */}
      {showAutoAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Premisas auto-detectadas</h3>
            <p className="text-gray-600 mb-4">
              Las siguientes premisas fueron detectadas en tu entrada. ¿Te gustaría asignarlas a variables?
            </p>
            <div className="space-y-3 mb-6">
              {autoAssignments.map((assignment) => (
                <div key={assignment.variable} className="flex items-center">
                  <div className="font-mono text-lg mr-2">{assignment.variable}:</div>
                  <div className="text-sm bg-gray-100 p-2 rounded flex-1">{assignment.premise}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAutoAssignModal(false)
                  pendingConversionRef.current = null // Clear pending conversion if user cancels
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAcceptAutoAssignments}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Aceptar asignaciones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
