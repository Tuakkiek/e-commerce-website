iphone-store/
│
├── backend/                          # Backend Node.js + Express
│   ├── config/
│   │   └── config.js                # Cấu hình môi trường (đã có)
│   │
│   ├── models/                      # MongoDB Models
│   │   ├── User.model.js           # Model người dùng
│   │   ├── Product.model.js        # Model sản phẩm
│   │   ├── Cart.model.js           # Model giỏ hàng
│   │   ├── Order.model.js          # Model đơn hàng
│   │   └── Review.model.js         # Model đánh giá & khuyến mãi
│   │
│   ├── controllers/                 # Business Logic
│   │   ├── auth.controller.js      # Xử lý đăng nhập, đăng ký
│   │   ├── user.controller.js      # Quản lý user & nhân viên
│   │   ├── product.controller.js   # Quản lý sản phẩm
│   │   ├── cart.controller.js      # Quản lý giỏ hàng
│   │   ├── order.controller.js     # Quản lý đơn hàng
│   │   ├── review.controller.js    # Quản lý đánh giá
│   │   └── promotion.controller.js # Quản lý khuyến mãi
│   │
│   ├── routes/                      # API Routes
│   │   ├── auth.routes.js          # Routes xác thực
│   │   ├── user.routes.js          # Routes user
│   │   ├── product.routes.js       # Routes sản phẩm
│   │   ├── cart.routes.js          # Routes giỏ hàng
│   │   ├── order.routes.js         # Routes đơn hàng
│   │   ├── review.routes.js        # Routes đánh giá
│   │   └── promotion.routes.js     # Routes khuyến mãi
│   │
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT authentication & authorization
│   │
│   ├── .env                         # Biến môi trường
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .gitignore
│   

|── docs/
|   |──STRUCTURE.md                  # Mô tả cấu trúc dự án
|


├── frontend/                         # Frontend React + Vite
│   ├── public/
│   │   └── placeholder.png          # Ảnh mặc định
│   │
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── ui/                 # ShadCN UI Components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── dropdown-menu.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   ├── toast.jsx
│   │   │   │   └── tabs.jsx
│   │   │   │
│   │   │   └── shared/             # Shared Components
│   │   │       ├── ProductCard.jsx
│   │   │       ├── Loading.jsx
│   │   │       └── ErrorMessage.jsx
│   │   │
│   │   ├── layouts/                 # Layout Components
│   │   │   ├── MainLayout.jsx      # Layout cho trang public/customer
│   │   │   └── DashboardLayout.jsx # Layout cho dashboard admin
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── HomePage.jsx        # Trang chủ
│   │   │   ├── ProductsPage.jsx    # Danh sách sản phẩm
│   │   │   ├── ProductDetailPage.jsx # Chi tiết sản phẩm
│   │   │   ├── LoginPage.jsx       # Đăng nhập
│   │   │   ├── RegisterPage.jsx    # Đăng ký
│   │   │   │
│   │   │   ├── customer/           # Trang dành cho khách hàng
│   │   │   │   ├── CartPage.jsx
│   │   │   │   ├── CheckoutPage.jsx
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   ├── OrderDetailPage.jsx
│   │   │   │   └── ProfilePage.jsx
│   │   │   │
│   │   │   ├── admin/              # Trang dành cho Admin
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── EmployeesPage.jsx
│   │   │   │   └── PromotionsPage.jsx
│   │   │   │
│   │   │   ├── warehouse/          # Trang dành cho Warehouse Staff
│   │   │   │   └── ProductsPage.jsx
│   │   │   │
│   │   │   └── order-manager/      # Trang dành cho Order Manager
│   │   │       └── OrderManagementPage.jsx
│   │   │
│   │   ├── store/                   # State Management (Zustand)
│   │   │   ├── authStore.js        # Authentication store
│   │   │   └── cartStore.js        # Shopping cart store
│   │   │
│   │   ├── lib/                     # Utilities & Helpers
│   │   │   ├── utils.js            # Helper functions (cn, formatPrice, formatDate)
│   │   │   └── api.js              # Axios instance & interceptors
│   │   │
│   │   ├── App.jsx                  # Main App với Routes
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles + Tailwind
│   │
│   ├── .env                          # Frontend environment variables
│   ├── index.html
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # TailwindCSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── package.json
│   ├── jsconfig.json                # Path aliases (@/)
│   └── .gitignore
│
├── .gitignore                        # Root gitignore
└── README.md                         # Tài liệu dự án



Luồng Hoạt Động

Khách hàng:

    Truy cập trang chủ (HomePage.jsx), xem các sản phẩm, chọn sản phẩm (ProductDetailPage.jsx), thêm vào giỏ hàng (CartPage.jsx).

    Đăng nhập hoặc đăng ký tài khoản (LoginPage.jsx / RegisterPage.jsx).

    Kiểm tra giỏ hàng và thanh toán (CheckoutPage.jsx).

    Sau khi thanh toán, đơn hàng được lưu trữ trong hệ thống (Order model), và khách hàng có thể xem lịch sử đơn hàng (OrdersPage.jsx).

Admin:

    Admin đăng nhập vào Dashboard (AdminDashboard.jsx).

    Quản lý sản phẩm, nhân viên, và các chương trình khuyến mãi (ProductsPage.jsx, EmployeesPage.jsx, PromotionsPage.jsx).

Warehouse Staff:

    Nhân viên kho quản lý các sản phẩm (ProductsPage.jsx).

Order Manager:

    Quản lý và theo dõi các đơn hàng (OrderManagementPage.jsx).

API và Backend:

Backend sử dụng Express để xử lý các request từ frontend, như đăng ký người dùng, thêm sản phẩm vào giỏ hàng, tạo đơn hàng, và xử lý đánh giá sản phẩm.

Mỗi request đi qua các controller tương ứng, như auth.controller.js, product.controller.js, order.controller.js, v.v.

State Management:

Zustand quản lý trạng thái frontend, như trạng thái đăng nhập (authStore) và giỏ hàng (cartStore), giúp giảm thiểu việc phải gửi request lại backend nhiều lần.