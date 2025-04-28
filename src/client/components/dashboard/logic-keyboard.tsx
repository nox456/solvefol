interface LogicKeyboardProps {
  onOperatorClick: (operator: string) => void
  onVariableClick: (variable: string) => void
  onClear: () => void
}

export default function LogicKeyboard({ onOperatorClick, onVariableClick, onClear }: LogicKeyboardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {/* Variable buttons - ensure we're passing lowercase variables */}
          <button
            onClick={() => onVariableClick("p")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            p
          </button>
          <button
            onClick={() => onVariableClick("q")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            q
          </button>
          <button
            onClick={() => onVariableClick("r")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            r
          </button>
          <button
            onClick={() => onVariableClick("s")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            s
          </button>
          {/* Operator buttons */}
          <button
            onClick={() => onOperatorClick(" ∧ ")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ∧ (Y)
          </button>
          <button
            onClick={() => onOperatorClick(" ∨ ")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ∨ (O)
          </button>
          <button
            onClick={() => onOperatorClick(" → ")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            → (CONDICIONAL)
          </button>
          <button
            onClick={() => onOperatorClick(" ↔ ")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ↔ (BICONDICIONAL)
          </button>
          <button
            onClick={() => onOperatorClick("¬")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ¬ (NEGACION)
          </button>
          <div></div> {/* Empty cell to maintain grid layout */}
          <div></div> {/* Empty cell to maintain grid layout */}
          {/* Action buttons */}
          <button
            onClick={onClear}
            className="col-span-2 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Limpiar
          </button>
          <div className="col-span-2"></div> {/* Empty cells to maintain grid layout */}
        </div>
      </div>
    </div>
  )
}
