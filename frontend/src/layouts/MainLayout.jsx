
// src/layouts/MainLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Package } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getCartCount, fetchCart } = useCartStore()
  const cartCount = getCartCount()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'CUSTOMER') {
      fetchCart()
    }
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            iPhone Store
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/products" className="hover:text-primary">
              Sản phẩm
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'CUSTOMER' && (
                  <>
                    <Link to="/cart" className="relative hover:text-primary">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="hover:text-primary">
                      <Package className="w-5 h-5" />
                    </Link>
                    <Link to="/profile" className="hover:text-primary">
                      <User className="w-5 h-5" />
                    </Link>
                  </>
                )}

                {['ADMIN', 'WAREHOUSE_STAFF', 'ORDER_MANAGER'].includes(user?.role) && (
                  <Link to="/dashboard" className="hover:text-primary">
                    Dashboard
                  </Link>
                )}

                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 iPhone Store. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
