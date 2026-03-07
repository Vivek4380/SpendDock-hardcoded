import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import CompanyA from './components/CompanyA'
import CompanyB from './components/CompanyB'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/company-a" element={<CompanyA />} />
        <Route path="/company-b" element={<CompanyB />} />
      </Routes>
    </Router>
  )
}

export default App