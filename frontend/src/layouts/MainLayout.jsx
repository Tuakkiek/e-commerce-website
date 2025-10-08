// ============================================
// FILE: src/layouts/MainLayout.jsx
// ============================================
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const MainLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const cartItemCount = getItemCount();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span className="font-bold text-xl">iPhone Store</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Sản phẩm
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "CUSTOMER" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() => navigate("/cart")}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  )}

                  <div className="hidden md:flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (user?.role === "CUSTOMER") {
                          navigate("/profile");
                        } else if (user?.role === "ADMIN") {
                          navigate("/admin");
                        } else if (user?.role === "WAREHOUSE_STAFF") {
                          navigate("/warehouse/products");
                        } else if (user?.role === "ORDER_MANAGER") {
                          navigate("/order-manager/orders");
                        }
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user?.fullName}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Đăng nhập
                  </Button>
                  <Button onClick={() => navigate("/register")}>
                    Đăng ký
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <Link
                to="/"
                className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === "CUSTOMER" && (
                    <>
                      <Link
                        to="/cart"
                        className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Giỏ hàng ({cartItemCount})
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tài khoản
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 iPhone Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;