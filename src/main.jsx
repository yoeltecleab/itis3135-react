import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Home from "./home.jsx";
import Layout from "./layout.jsx";
import './styles/styles.css'
import {BrowserRouter as Router, Route, Routes} from "react-router";
import Introduction from "./introduction.jsx";
import Contract from "./contract.jsx";
import Class_Intros from "./class_intros.jsx";


createRoot(document.getElementsByTagName('body')[0]).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path={"*"} element={<Layout children={<Home/>} pageTitle={"Home"}/>}/>
                <Route path="/introduction" element={<Layout children={<Introduction/>} pageTitle={"Introduction"}/>}/>
                <Route path="/contract" element={<Layout children={<Contract/>} pageTitle={"Contract"}/>}/>
                <Route path="/class_intros"
                       element={<Layout children={<Class_Intros/>} pageTitle={"Class Introduction"}/>}/>
            </Routes>
        </Router>
    </StrictMode>
)
