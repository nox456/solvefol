import { useEffect, useState } from "react"
import { generateTruthTable } from "../../lib/logic-evaluator"

export default function TruthTable({ formula }: { formula: string }) {
  const [table, setTable] = useState<{ headers: string[]; rows: (boolean | string)[][] }>({
    headers: [],
    rows: [],
  })

  useEffect(() => {
    if (formula.trim()) {
      try {
        const truthTable = generateTruthTable(formula)
        setTable(truthTable)
      } catch (error) {
        console.error("Error de generación de tabla de verdad:", error)
        setTable({ headers: [], rows: [] })
      }
    } else {
      setTable({ headers: [], rows: [] })
    }
  }, [formula])

  if (!formula.trim()) {
    return (
      <div className="text-center p-4 text-gray-500 ">Ingresa una fórmula para generar una tabla de verdad</div>
    )
  }

  if (table.headers.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 ">Invalida fórmula o muy compleja para mostrar</div>
    )
  }

  return (
    <div className="overflow-auto max-h-[500px]">
      <table className="min-w-full divide-y divide-gray-200 ">
        <thead className="bg-gray-50 ">
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-mono"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {table.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white " : "bg-gray-50 "}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 whitespace-nowrap text-center font-mono ${
                    cellIndex === row.length - 1 ? "font-bold bg-gray-100 " : ""
                  }`}
                >
                  {typeof cell === "boolean" ? (cell ? "V" : "F") : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
