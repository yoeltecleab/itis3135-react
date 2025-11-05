import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header role="banner">
            <h1>Yoel Tecleab | Youthful Tiger | ITIS3135</h1>
            <nav aria-label="Primary">
                <Link to="/">Home</Link> |
                <Link to="/introduction">Introduction</Link> |
                <Link to="intro_form.html">Introduction Form</Link> |
                <Link to="/contract">Contract</Link> |
                <Link to="website_evaluations.html">Website Evaluations</Link> |
                <Link to="fccfsjs_outline.html">FCC JS Outline</Link>
                <Link to="project_overview.html">Project Overview</Link>
            </nav>
            <nav aria-label="Secondary" className="secondary-nav">
                <Link to="stuff/INDEX & page.htm">Crappy Website</Link>
                <Link to="yoeldesignsinc.com/">Yoel Designs</Link>
                <Link to="hobby/">Hobby</Link>
            </nav>
        </header>
    )
}

export default Header;