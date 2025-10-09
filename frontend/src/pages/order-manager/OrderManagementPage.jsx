import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck, Package, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD241001',
      customerName: 'Nguyễn Văn A',
      phone: '0123456789',
      totalAmount: 29990000,
      status: 'PENDING',
      paymentMethod: 'COD',
      createdAt: '2025-10-08 14:30',
      items: [
        { name: 'iPhone 15 Pro Max', quantity: 1, price: 29990000 }
      ],
      shippingAddress: {
        fullName: 'Nguyễn Văn A',
        phoneNumber: '0123456789',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        commune: 'Phường Bến Nghé',
        detailAddress: '123 Đường ABC'
      }
    },
    {
      id: 2,
      orderNumber: 'ORD241002',
      customerName: 'Trần Thị B',
      phone: '0987654321',
      totalAmount: 26990000,
      status: 'CONFIRMED',
      paymentMethod: 'BANK_TRANSFER',
      createdAt: '2025-10-08 13:15',
      items: [
        { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 26990000 }
      ],
      shippingAddress: {
        fullName: 'Trần Thị B',
        phoneNumber: '0987654321',
        province: 'Hà Nội',
        district: 'Quận Hoàn Kiếm',
        commune: 'Phường Hàng Bạc',
        detailAddress: '456 Đường XYZ'
      }
    },
    {
      id: 3,
      orderNumber: 'ORD241003',
      customerName: 'Lê Văn C',
      phone: '0912345678',
      totalAmount: 19990000,
      status: 'PROCESSING',
      paymentMethod: 'COD',
      createdAt: '2025-10-08 12:00',
      items: [
        { name: 'Xiaomi 14 Pro', quantity: 1, price: 19990000 }
      ],
      shippingAddress: {
        fullName: 'Lê Văn C',
        phoneNumber: '0912345678',
        province: 'Đà Nẵng',
        district: 'Quận Hải Châu',
        commune: 'Phường Thạch Thang',
        detailAddress: '789 Đường DEF'
      }
    },
    {
      id: 4,
      orderNumber: 'ORD241004',
      customerName: 'Phạm Thị D',
      phone: '0909090909',
      totalAmount: 22990000,
      status: 'SHIPPING',
      paymentMethod: 'COD',
      createdAt: '2025-10-07 16:45',
      items: [
        { name: 'OPPO Find X7', quantity: 1, price: 22990000 }
      ],
      shippingAddress: {
        fullName: 'Phạm Thị D',
        phoneNumber: '0909090909',
        province: 'Cần Thơ',
        district: 'Quận Ninh Kiều',
        commune: 'Phường An Hòa',
        detailAddress: '321 Đường GHI'
      }
    },
    {
      id: 5,
      orderNumber: 'ORD241005',
      customerName: 'Hoàng Văn E',
      phone: '0898989898',
      totalAmount: 21990000,
      status: 'DELIVERED',
      paymentMethod: 'BANK_TRANSFER',
      createdAt: '2025-10-06 10:20',
      items: [
        { name: 'Vivo X100 Pro', quantity: 1, price: 21990000 }
      ],
      shippingAddress: {
        fullName: 'Hoàng Văn E',
        phoneNumber: '0898989898',
        province: 'Huế',
        district: 'Quận Phú Nhuận',
        commune: 'Phường Phú Hội',
        detailAddress: '654 Đường JKL'
      }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const statusConfig = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    PROCESSING: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800', icon: Package },
    SHIPPING: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const paymentMethodLabels = {
    COD: 'Thanh toán khi nhận hàng',
    BANK_TRANSFER: 'Chuyển khoản ngân hàng'
  };

  const nextStatusOptions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPING', 'CANCELLED'],
    SHIPPING: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.phone.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => ['CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length
  };

  const openDetailDialog = (order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const openUpdateStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setStatusNote('');
    setIsUpdateStatusDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!newStatus) {
      alert('Vui lòng chọn trạng thái mới!');
      return;
    }

    setOrders(orders.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, status: newStatus }
        : order
    ));

    console.log('Update order status:', {
      orderId: selectedOrder.id,
      newStatus,
      note: statusNote
    });

    setIsUpdateStatusDialogOpen(false);
    alert('Cập nhật trạng thái đơn hàng thành công!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-600">Theo dõi và xử lý đơn hàng của khách hàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Tổng đơn</div>
              <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Chờ xác nhận</div>
              <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Đang xử lý</div>
              <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Đã giao</div>
              <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Đã hủy</div>
              <div className="text-2xl font-bold text-red-600">{orderStats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                  <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                  <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                  <SelectItem value="SHIPPING">Đang giao</SelectItem>
                  <SelectItem value="DELIVERED">Đã giao</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Mã đơn</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Khách hàng</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Số điện thoại</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Tổng tiền</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thanh toán</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thời gian</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">
                        Không tìm thấy đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const StatusIcon = statusConfig[order.status].icon;
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{order.orderNumber}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{order.customerName}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">{order.phone}</td>
                          <td className="py-3 px-4 font-semibold text-sm">{formatCurrency(order.totalAmount)}</td>
                          <td className="py-3 px-4 text-sm">{paymentMethodLabels[order.paymentMethod]}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[order.status].label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.createdAt}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDetailDialog(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {nextStatusOptions[order.status].length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openUpdateStatusDialog(order)}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Họ tên:</span>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Số điện thoại:</span>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Địa chỉ giao hàng</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{selectedOrder.shippingAddress.fullName}</strong> - {selectedOrder.shippingAddress.phoneNumber}</p>
                  <p>{selectedOrder.shippingAddress.detailAddress}</p>
                  <p>{selectedOrder.shippingAddress.commune}, {selectedOrder.shippingAddress.district}</p>
                  <p>{selectedOrder.shippingAddress.province}</p>
                </div>
              </div>

              {/* Products */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Sản phẩm</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Phương thức thanh toán:</span>
                    <span className="font-medium">{paymentMethodLabels[selectedOrder.paymentMethod]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[selectedOrder.status].color}`}>
                      {statusConfig[selectedOrder.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Đơn hàng: {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Trạng thái hiện tại</Label>
              <div className={`px-3 py-2 rounded-lg ${selectedOrder && statusConfig[selectedOrder.status].color}`}>
                {selectedOrder && statusConfig[selectedOrder.status].label}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái mới *</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái mới" />
                </SelectTrigger>
                <SelectContent>
                  {selectedOrder && nextStatusOptions[selectedOrder.status].map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Input
                placeholder="Nhập ghi chú (không bắt buộc)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagementPage;