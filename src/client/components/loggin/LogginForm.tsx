import { useState } from "react";
import HomeCard from "../ui/HomeCard";
import { FormAction } from "../../../lib/types";
import "./LogginForm.css";

type Props = {
    action: FormAction;
};

export default function LogginForm({ action }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
		const response = await fetch(`${import.meta.env.FRONTEND_API_URL}/auth/${action}`,{
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});
		console.log(await response.json());
    };
    return (
        <HomeCard>
            <form onSubmit={handleSubmit} className="form-login">
                <input
                    type="text"
					className="form-login-input"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
					className="form-login-input"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="form-login-button">
                    {action == FormAction.SIGNUP
                        ? "Registrarse"
                        : "Iniciar Sesión"}
                </button>
            </form>
        </HomeCard>
    );
}
