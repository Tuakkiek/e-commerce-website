// ============================================
// FILE: src/pages/customer/CheckoutPage.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Loading } from "@/components/shared/Loading";
import { useCartStore } from "@/store/cartStore";
import { orderAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCart, getTotal } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    province: "",
    district: "",
    commune: "",
    detailAddress: "",
    paymentMethod: "COD",
    notes: "",
  });

  useEffect(() => {
    getCart();
  }, []);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const items = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      const orderData = {
        items,
        shippingAddress: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          province: formData.province,
          district: formData.district,
          commune: formData.commune,
          detailAddress: formData.detailAddress,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const response = await orderAPI.create(orderData);
      navigate(`/orders/${response.data.data.order._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
        <Button onClick={() => navigate("/products")}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <ErrorMessage message={error} />}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                    <Input
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commune">Phường/Xã *</Label>
                    <Input
                      id="commune"
                      name="commune"
                      value={formData.commune}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailAddress">Địa chỉ cụ thể *</Label>
                  <Input
                    id="detailAddress"
                    name="detailAddress"
                    placeholder="Số nhà, tên đường..."
                    value={formData.detailAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    placeholder="Ghi chú cho đơn hàng..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-muted-foreground">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === "BANK_TRANSFER"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-muted-foreground">
                      Chuyển khoản trước khi nhận hàng
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.productId._id} className="flex gap-3">
                      <img
                        src={item.productId?.images?.[0] || "/placeholder.png"}
                        alt={item.productId?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productId?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          SL: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đặt hàng"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;