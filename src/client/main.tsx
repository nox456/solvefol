import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./components/App";
import LogginForm from "./components/loggin/LogginForm";
import { FormAction } from "../lib/types";
import Dashboard from "./components/dashboard/Dashboard";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={App} />
            <Route
                path="/signup"
                element={<LogginForm action={FormAction.SIGNUP} />}
            />
            <Route
                path="/signin"
                element={<LogginForm action={FormAction.SIGNIN} />}
            />
            <Route path="/dashboard" Component={Dashboard} />
        </Routes>
    </BrowserRouter>,
);
