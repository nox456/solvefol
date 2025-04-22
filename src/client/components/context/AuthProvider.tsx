import {
    createContext,
    useState,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import { User } from "../../../lib/types";

export const AuthContext = createContext<{
    user: User | null;
    loggin: Function;
    isAuthenticated: boolean;
    loading: boolean;
}>({
    user: null,
    loggin: () => {},
    isAuthenticated: false,
    loading: false,
});

type Props = {
    children: ReactNode;
};

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const loggin = (user: User) => {
        setUser(user);
        setIsAuthenticated(true);
    };
    useEffect(() => {
        async function checkIsAuthenticated() {
            const response = await fetch(
                `${import.meta.env.FRONTEND_API_URL}/auth/is-authenticated`,
                {
                    credentials: "include",
                    method: "GET",
                },
            );
            if (response.status == 200) {
                setIsAuthenticated(true);
                setUser(await response.json());
				setLoading(false);
            } else {
				setLoading(false);
				setIsAuthenticated(false);
				setUser(null);
			}
        }
        checkIsAuthenticated();
    }, []);
    return (
        <AuthContext value={{ user, loggin, isAuthenticated, loading }}>
            {children}
        </AuthContext>
    );
}
