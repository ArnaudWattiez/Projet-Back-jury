import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ChienList } from './Pages/Chien';
import { Pageconnexion } from './Pages/Connexion';
import { Inscription } from './Pages/Inscription';
import ChienDetail from './components/ChienDetail';

const App = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<ChienList />} />
          <Route path="/Connexion" element={<Pageconnexion />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route path="/chien/:id" element={<ChienDetail  />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;