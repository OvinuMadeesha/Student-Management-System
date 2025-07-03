import Header from "./layouts/Header";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/homePage/Home";
import AboutUs from "./pages/homePage/AboutUs";
import Category from "./pages/homePage/Category";
import Faq from "./pages/homePage/faq";
import Login from './pages/StudentLogin'; //  make sure this exists
import StudentHome from './pages/studentPage/StudentHome';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/adminPage/AdminHome'

const App = () => {
    return (
        <Router>
            
            <Routes>
                <Route path="/" element={
                    <>
                        <Header />
                        <Home />
                        <AboutUs />
                        <Category />
                        <Faq />
                    </>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/studenthome" element={<StudentHome />} />

                {/* admin */}
                <Route path="/adminLogin" element={<AdminLogin/>}/>
                <Route path="/adminHome" element={<AdminHome/>}/>
            </Routes>
        </Router>
    );
};

export default App;