import { ReactElement } from "react";
import { Link, useLocation } from "react-router";

type Props = {
    children: ReactElement | ReactElement[];
};

export default function HomeCard({ children }: Props) {
    const location = useLocation();
    return (
        <section className="home-card">
            <header className="home-card-header">
                {location.pathname != "/" && <Link to="/">Regresar</Link>}
                <h1>SolveFOL</h1>
            </header>
            <main className="home-card-main">{children}</main>
        </section>
    );
}
