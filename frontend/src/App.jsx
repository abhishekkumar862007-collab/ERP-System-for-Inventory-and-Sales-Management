import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Suppliers from './pages/Suppliers'
import SalesOrders from './pages/SalesOrders'
import PurchaseOrders from './pages/PurchaseOrders'
import GRN from './pages/GRN'
import Invoices from './pages/Invoices'
import Reports from './pages/Reports'
import authService from './services/auth.service'

const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="customers" element={<Customers />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="sales" element={<SalesOrders />} />
        <Route path="purchase" element={<PurchaseOrders />} />
        <Route path="grn" element={<GRN />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
