import Header from "./header.jsx";
import Footer from "./footer.jsx";
import {useEffect} from "react";

export default function Layout({children, pageTitle}) {
    useEffect(() => {
        document.title = "Yoel Tecleab | Youthful Tiger | ITIS3135 | ".concat(pageTitle);
    });
    return (
        <>
            <Header/>
            {children}
            <Footer/>
        </>
    );
}
