import { useState } from "react";
import HomeCard from "../ui/HomeCard";
import { FormAction, ServerResponse } from "../../../lib/types";
import "./LogginForm.css";
import { useNavigate } from "react-router";
import { type ErrorType, LoginSchema } from "../../schemas/loggin.schema";
import { useAuth } from "../context/AuthProvider";

type Props = {
    action: FormAction;
};

export default function LogginForm({ action }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<ErrorType | null>();
    const navigate = useNavigate();

    const { loggin } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation = LoginSchema.safeParse({ username, password });
        if (!validation.success) {
            setError({
                msg: validation.error.issues[0].message,
                type: "validation",
                field: validation.error.issues[0].path[0].toString(),
            });
        } else {
            const response = await fetch(
                `${import.meta.env.FRONTEND_API_URL}/auth/${action}`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                },
            );
            if (response.status == 200) {
                loggin((await response.json()).user);
                navigate("/dashboard");
            } else {
                const { message }: ServerResponse = await response.json();
                setError({ msg: message, type: "query" });
            }
        }
    };
    return (
        <HomeCard>
            <p className="form-login-error">
                {error?.type == "query" ? error.msg : ""}
            </p>
            <form onSubmit={handleSubmit} className="form-login">
                <input
                    type="text"
                    className="form-login-input"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {error?.type == "validation" && error?.field == "username" && (
                    <p className="form-login-error">{error.msg}</p>
                )}
                <input
                    type="password"
                    className="form-login-input"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error?.type == "validation" && error?.field == "password" && (
                    <p className="form-login-error">{error.msg}</p>
                )}
                <button type="submit" className="form-login-button">
                    {action == FormAction.SIGNUP
                        ? "Registrarse"
                        : "Iniciar Sesión"}
                </button>
            </form>
        </HomeCard>
    );
}
