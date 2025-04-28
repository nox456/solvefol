import { Link } from "react-router";

export default function App() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    SolveFOL
                </h1>
                <p className="text-muted-foreground">
                    Tu aplicacion para resolver expresiones logicas de primer orden
                </p>

                {/* More Tailwind classes for responsive design */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        to="/signup"
                        className="p-2 rounded-md bg-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
                    >
                        Registrarse
                    </Link>
                    <Link
                        to="/signin"
                        className="p-2 rounded-md bg-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
                    >
                        Iniciar Sesion
                    </Link>
                </div>
            </div>
        </main>
    );
}
