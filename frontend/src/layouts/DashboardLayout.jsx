
// src/layouts/DashboardLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag,
  LogOut 
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      roles: ['ADMIN', 'WAREHOUSE_STAFF', 'ORDER_MANAGER']
    },
    { 
      icon: Package, 
      label: 'Sản phẩm', 
      path: '/dashboard/products',
      roles: ['ADMIN', 'WAREHOUSE_STAFF']
    },
    { 
      icon: ShoppingBag, 
      label: 'Đơn hàng', 
      path: '/dashboard/orders',
      roles: ['ADMIN', 'ORDER_MANAGER']
    },
    { 
      icon: Users, 
      label: 'Nhân viên', 
      path: '/dashboard/employees',
      roles: ['ADMIN']
    },
    { 
      icon: Tag, 
      label: 'Khuyến mãi', 
      path: '/dashboard/promotions',
      roles: ['ADMIN']
    },
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role))

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-gray-50">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold">
            iPhone Store
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{user?.fullName}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>

        <nav className="px-4 space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}