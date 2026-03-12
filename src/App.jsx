import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import SetPassword from "./components/SetPassword"
import Home from './components/Home'
import Auth from './components/Auth'
import VendorPortal from './components/VendorPortal'
import ClientPortal from './components/ClientPortal'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/vendor" element={<VendorPortal />} />
        <Route path="/client" element={<ClientPortal />} />
        <Route path="/set-password" element={<SetPassword />} />
      </Routes>
    </Router>
  )
}

export default App