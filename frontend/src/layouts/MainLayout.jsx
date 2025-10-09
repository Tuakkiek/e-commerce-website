import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
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
    setMobileMenuOpen(false);
  };

  const handleProfileNavigation = () => {
    if (user?.role === "CUSTOMER") {
      navigate("/profile");
    } else if (user?.role === "ADMIN") {
      navigate("/admin");
    } else if (user?.role === "WAREHOUSE_STAFF") {
      navigate("/warehouse/products");
    } else if (user?.role === "ORDER_MANAGER") {
      navigate("/order-manager/orders");
    }
    setMobileMenuOpen(false);
  };

  const cartItemCount = getItemCount();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="bg-white rounded-full px-8 py-4 flex items-center justify-center min-w-[180px]">
            <span className="text-black font-bold text-lg">LOGO</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-white text-black rounded-full py-3 px-6 pr-12 focus:outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Giỏ hàng */}
            {isAuthenticated && user?.role === "CUSTOMER" && (
              <button
                onClick={() => navigate("/cart")}
                className="bg-white text-black rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-100 transition relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Giỏ hàng</span>
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </button>
            )}

            {/* Tài khoản */}
            {isAuthenticated ? (
              <button
                onClick={handleProfileNavigation}
                className="bg-white text-black rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.fullName}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Đăng nhập</span>
              </button>
            )}

            {/* Danh mục */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white text-black rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-100 transition"
            >
              <Menu className="w-5 h-5" />
              <span className="font-medium">Danh mục</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-black border-t border-gray-700">
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
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
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Giỏ hàng ({cartItemCount})
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tài khoản
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="flex items-start">
              <div className="bg-white rounded-full px-8 py-4 flex items-center justify-center">
                <span className="text-black font-bold text-lg">LOGO</span>
              </div>
            </div>

            {/* Hệ thống cửa hàng */}
            <div>
              <h3 className="font-bold text-lg mb-4">Hệ thống cửa hàng</h3>
              <ul className="space-y-2 text-sm">
                <li>CN 1:</li>
                <li>CN 2:</li>
                <li>CN 3:</li>
                <li>CN 4:</li>
              </ul>
            </div>

            {/* Chính sách bán hàng */}
            <div>
              <h3 className="font-bold text-lg mb-4">Chính sách bán hàng</h3>
              <ul className="space-y-2 text-sm">
                <li>Chính sách bảo hành</li>
                <li>Chính sách mua online</li>
                <li>Chính sách bảo mật thông tin khách hàng</li>
              </ul>
            </div>

            {/* Hotline hỗ trợ */}
            <div>
              <h3 className="font-bold text-lg mb-4">Hotline hỗ trợ</h3>
              <ul className="space-y-2 text-sm">
                <li>Hotline bán hàng: 0123456789</li>
                <li>Hotline tư vấn trả góp: 0123456789</li>
                <li>Hotline bảo hành, kỹ thuật: 0123456789</li>
                <li>Hotline phản ánh: 0123456789</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;