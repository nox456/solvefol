import type React from "react"
import { useSidebar } from "./sidebar-provider"

export default function LogicSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: "calculator" | "converter"
  setActiveTab: (tab: "calculator" | "converter") => void
}) {
  const { isOpen, toggle } = useSidebar()

  return (
    <div className={`${isOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white shadow-lg`}>
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h2 className="text-lg font-semibold text-gray-800 ">Herramientas</h2>}
        <button
          onClick={toggle}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
      <nav className="mt-4">
        <SidebarItem
          icon={<CalculatorIcon />}
          text="Calculadora"
          isOpen={isOpen}
          active={activeTab === "calculator"}
          onClick={() => setActiveTab("calculator")}
        />
        <SidebarItem
          icon={<ConverterIcon />}
          text="Conversor"
          isOpen={isOpen}
          active={activeTab === "converter"}
          onClick={() => setActiveTab("converter")}
        />
      </nav>
    </div>
  )
}

function SidebarItem({
  icon,
  text,
  isOpen,
  active = false,
  onClick,
}: {
  icon: React.ReactNode
  text: string
  isOpen: boolean
  active?: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 mx-2 rounded-md cursor-pointer ${
        active
          ? "bg-gray-100 text-blue-600 "
          : "text-gray-700 hover:bg-gray-100 "
      }`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {isOpen && <span className="ml-3">{text}</span>}
    </div>
  )
}

// Icon components
function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ConverterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
        clipRule="evenodd"
      />
    </svg>
  )
}
