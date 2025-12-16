import logo from './logo.svg';
import './App.css';
import User from './User';
import React ,{useState ,useEffect}from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Button from './components/common/Button';
import ProductCard from './components/Espaceclient/ProductCard';
import CATEGORIES from './components/Espaceclient/CATEGORIES ';
import Login from './components/auth/Login';

function App() {
  return (
     <> 
      <Header/>
       <Button/>
      <Footer/>
</>
  );
}

export default App;
