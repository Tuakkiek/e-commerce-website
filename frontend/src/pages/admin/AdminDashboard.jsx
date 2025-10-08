// ============================================
// FILE: src/pages/admin/AdminDashboard.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { orderAPI, productAPI, userAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalEmployees: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes, employeesRes] = await Promise.all([
        orderAPI.getAll({ limit: 10 }),
        productAPI.getAll({ limit: 1 }),
        userAPI.getEmployees(),
      ]);

      const orders = ordersRes.data.data.orders;
      const revenue = orders
        .filter((order) => order.status === "DELIVERED")
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalOrders: ordersRes.data.data.total,
        totalProducts: productsRes.data.data.total,
        totalEmployees: employeesRes.data.data.employees.length,
        totalRevenue: revenue,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Nhân viên",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Doanh thu",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng quay trở lại! Đây là tổng quan hệ thống.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerId?.fullName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
