import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header role="banner">
            <h1>Yoel Tecleab | Youthful Tiger | ITIS3135</h1>
            <nav aria-label="Primary">
                <Link to="/">Home</Link> |
                <Link to="/introduction">Introduction</Link> |
                <Link to="/contract">Contract</Link>
            </nav>
        </header>
    )
}

export default Header;