import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Header from "./components/Front/Header";
import Footer from "./components/Front/Footer";
import Button from "./components/Front/Button";
import DashboardMenu from "./components/Espaceclient/DashboardMenu";
import NutritionPlan from "./components/Espaceclient/NutritionPlan";
import CoachDashboard from "./components/Espacecoach/CoachDashboard";
import PoidsPage from "./components/Espaceclient/PoidsPage";
import MesureMasseGrasse from "./components/Espaceclient/MesureMasseGrasse";
import CoachCalendar from "./components/Espacecoach/CoachCalendar"
import CoachMenu from "./components/Espacecoach/CoachMenu";
import "./styles/Login.css";
import Inscriptionn from "./components/auth/Inscriptionn";
import Login from "./components/auth/Login";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/Espaceclient/DashboardHome";
import ObjectifPage from "./components/Espaceclient/ObjectifPage";
import CaloriesIMC from "./components/Espaceclient/CaloriesIMC";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/Button" element={<Button />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Inscription" element={<Inscriptionn />} />
        <Route path="/dashboard-menu" element={<DashboardMenu />} />
        <Route path="/home" element={<DashboardHome />} />
        <Route path="/objectifs" element={<ObjectifPage />} />
        <Route path="/poids" element={<PoidsPage />} />
        <Route path="/CaloriesIMC" element={<CaloriesIMC />} />
        <Route path="/mesures" element={<MesureMasseGrasse />} />
        <Route path="/nutritionplan" element={<NutritionPlan />} />
        <Route path="/calendrier" element={<CoachCalendar/>}/>
         <Route path="/CoachMenu" element={<CoachMenu/>}/>

        
         <Route path="/CoachDashboard" element={<CoachDashboard/>}/>

        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
