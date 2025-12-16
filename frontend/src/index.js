import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Button from "./components/common/Button";
import ProductCard from "./components/Espaceclient/ProductCard";
import DashboardMenu from "./components/Espaceclient/DashboardMenu";
import PoidsPage from "./components/Espaceclient/PoidsPage";

import './styles/Login.css';
import Inscriptionn from "./components/auth/Inscriptionn";
import Login from "./components/auth/Login";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/Espaceclient/DashboardHome";
import ObjectifPage from "./components/Espaceclient/ObjectifPage";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/Button" element={<Button />} />
        <Route path="/ProductCard" element={<ProductCard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Inscriptionn" element={<Inscriptionn />} />
        <Route path="/dashboard-menu" element={<DashboardMenu />} />
        <Route path="/home" element={<DashboardHome />} />
        <Route path="/objectifs" element={<ObjectifPage />} />
        <Route path="/poids" element={<PoidsPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
