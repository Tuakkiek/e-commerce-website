// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Customer Pages
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrdersPage from './pages/customer/OrdersPage'
import OrderDetailPage from './pages/customer/OrderDetailPage'
import ProfilePage from './pages/customer/ProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import EmployeesPage from './pages/admin/EmployeesPage'
import PromotionsPage from './pages/admin/PromotionsPage'

// Warehouse Pages
import WarehouseProductsPage from './pages/warehouse/ProductsPage'

// Order Manager Pages
import OrderManagementPage from './pages/order-manager/OrderManagementPage'

function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Customer Routes */}
      <Route element={<MainLayout />}>
        <Route path="/cart" element={
          <PrivateRoute roles={['CUSTOMER']}>
            <CartPage />
          </PrivateRoute>
        } />
        <Route path="/checkout" element={
          <PrivateRoute roles={['CUSTOMER']}>
            <CheckoutPage />
          </PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute roles={['CUSTOMER']}>
            <OrdersPage />
          </PrivateRoute>
        } />
        <Route path="/orders/:id" element={
          <PrivateRoute roles={['CUSTOMER']}>
            <OrderDetailPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute roles={['CUSTOMER']}>
            <ProfilePage />
          </PrivateRoute>
        } />
      </Route>

      {/* Dashboard Routes */}
      <Route element={
        <PrivateRoute roles={['ADMIN', 'WAREHOUSE_STAFF', 'ORDER_MANAGER']}>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route path="/dashboard" element={<AdminDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard/employees" element={
          <PrivateRoute roles={['ADMIN']}>
            <EmployeesPage />
          </PrivateRoute>
        } />
        <Route path="/dashboard/promotions" element={
          <PrivateRoute roles={['ADMIN']}>
            <PromotionsPage />
          </PrivateRoute>
        } />

        {/* Warehouse Routes */}
        <Route path="/dashboard/products" element={
          <PrivateRoute roles={['WAREHOUSE_STAFF', 'ADMIN']}>
            <WarehouseProductsPage />
          </PrivateRoute>
        } />

        {/* Order Manager Routes */}
        <Route path="/dashboard/orders" element={
          <PrivateRoute roles={['ORDER_MANAGER', 'ADMIN']}>
            <OrderManagementPage />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App