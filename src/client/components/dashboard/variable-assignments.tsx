import { useState } from "react"

interface VariableAssignment {
  variable: string
  premise: string
}

interface VariableAssignmentsProps {
  assignments: VariableAssignment[]
  onAssignmentChange: (assignments: VariableAssignment[]) => void
}

export default function VariableAssignments({ assignments, onAssignmentChange }: VariableAssignmentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handlePremiseChange = (variable: string, premise: string) => {
    // Remove any quotes from the premise when saving
    const cleanPremise = premise.replace(/^"(.*)"$/, "$1").replace(/"([^"]*)"/g, "$1")

    const updatedAssignments = assignments.map((assignment) =>
      assignment.variable === variable ? { ...assignment, premise: cleanPremise } : assignment,
    )
    onAssignmentChange(updatedAssignments)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 ">
      <div
        className="p-3 flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <h3 className="text-sm font-medium text-gray-700 ">Asignaciones de variables</h3>
        <button className="text-gray-500 hover:text-gray-700 ">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 ">
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.variable} className="grid grid-cols-[40px_1fr] gap-3 items-center">
                <div className="font-mono text-lg font-medium text-center">{assignment.variable}:</div>
                <input
                  type="text"
                  value={assignment.premise}
                  onChange={(e) => handlePremiseChange(assignment.variable, e.target.value)}
                  placeholder={`Lenguaje natural para ${assignment.variable}`}
                  className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 ">
            Asigna premisas en lenguaje natural a variables para fórmulas más claras y conversiones.
          </div>
        </div>
      )}
    </div>
  )
}
