import { useState } from "react";
import { SidebarProvider } from "./sidebar-provider";
import { VariableProvider } from "../../lib/variable-context";
import LogicSidebar from "./logic-sidebar";
import Calculator from "./Calculator";
import History from "./History";
import Converter from "./Converter";
import TruthTable from "./truth-table";

export default function Dashboard() {
    const [formula, setFormula] = useState("");
    const [history, setHistory] = useState<
        { formula: string; result: boolean | null }[]
    >([]);
    const [activeTab, setActiveTab] = useState<"calculator" | "converter">(
        "calculator",
    );

    const addToHistory = (newFormula: string, result: boolean | null) => {
        setHistory((prev) => [...prev, { formula: newFormula, result }]);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <SidebarProvider>
            <VariableProvider>
                <div className="flex h-screen bg-gray-50 ">
                    <LogicSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <header className="bg-white shadow">
                            <div className="px-4 py-3 flex justify-between items-center">
                                <h1 className="text-xl font-semibold text-gray-800 ">
                                    {activeTab === "calculator"
                                        ? "Calculadora de Primer Orden"
                                        : "Conversor logico"}
                                </h1>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            setActiveTab("calculator")
                                        }
                                        className={`px-3 py-1 text-sm rounded-md ${
                                            activeTab === "calculator"
                                                ? "bg-blue-100 text-blue-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        Calculadora
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveTab("converter")
                                        }
                                        className={`px-3 py-1 text-sm rounded-md ${
                                            activeTab === "converter"
                                                ? "bg-blue-100 text-blue-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        Conversor
                                    </button>
                                </div>
                            </div>
                        </header>
                        <main className="flex-1 overflow-auto p-4">
                            {activeTab === "calculator" ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <Calculator
                                                formula={formula}
                                                setFormula={setFormula}
                                                addToHistory={addToHistory}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <History
                                                history={history}
                                                setFormula={setFormula}
                                                onClearHistory={clearHistory}
                                            />
                                            {(formula.endsWith("p") ||
                                                formula.endsWith("q") ||
                                                formula.endsWith("r") ||
                                                formula.endsWith("s")) && (
                                                <TruthTable formula={formula} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <Converter />
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </VariableProvider>
        </SidebarProvider>
    );
}
