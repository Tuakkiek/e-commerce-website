      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
             
              <span className="font-bold text-xl">iPhone Store</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
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
                    <AlertDialog>
                      {/* 1. KÍCH HOẠT: Nút Đăng xuất */}
                      <AlertDialogTrigger asChild>
                        {/* Nút này sẽ mở Dialog khi được nhấn */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      {/* 2. NỘI DUNG POPUP XÁC NHẬN */}
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn đăng xuất?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn sẽ cần đăng nhập lại để truy cập các tính năng
                            bảo mật của tài khoản.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          {/* Nút HỦY: Đóng popup mà không làm gì */}
                          <AlertDialogCancel>Hủy</AlertDialogCancel>

                          {/* Nút HÀNH ĐỘNG: Thực hiện đăng xuất */}
                          <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Xác nhận Đăng xuất
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Đăng nhập
                  </Button>
                  <Button onClick={() => navigate("/register")}>Đăng ký</Button>
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