import { useVariables } from "../../lib/variable-context"
import { useState } from "react"

export default function History({
  history,
  setFormula,
  onClearHistory,
}: {
  history: { formula: string; result: boolean | null }[]
  setFormula: (formula: string) => void
  onClearHistory: () => void
}) {
  const [showPremises, setShowPremises] = useState(false)
  const { variableAssignments, replaceVariablesWithPremises } = useVariables()

  const handleUseFormula = (formula: string) => {
    setFormula(formula)
  }

  const getDisplayFormula = (formula: string) => {
    if (showPremises) {
      return replaceVariablesWithPremises(formula)
    }
    return formula
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historial</h3>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={showPremises}
              onChange={() => setShowPremises(!showPremises)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Mostrar premisas</span>
          </label>
          <button
            onClick={onClearHistory}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Limpiar
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-4 text-gray-500 ">No hay historial</div>
      ) : (
        <div className="h-[calc(100vh-220px)] overflow-y-auto pr-1">
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-100 rounded-md flex justify-between items-center"
              >
                <div>
                  <div className="font-mono text-sm truncate max-w-[180px]">{getDisplayFormula(item.formula)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Result: {item.result === null ? "Error" : item.result ? "Verdadero" : "Falso"}
                  </div>
                </div>
                <button
                  onClick={() => handleUseFormula(item.formula)}
                  title="Usar esta fórmula"
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
