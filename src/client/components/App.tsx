import { Link } from "react-router";
import "./App.css";
import HomeCard from "./ui/HomeCard";

export default function App() {
	return (
		<HomeCard>
			<Link to="/signup">Registrarse</Link>
			<Link to="/signin">Iniciar Sesión</Link>
		</HomeCard>
	)
}
