import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { userAPI } from "@/lib/api";
import { User, MapPin, Lock, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const ProfilePage = () => {
  const { user, getCurrentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="w-4 h-4 mr-2" />
            Địa chỉ
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="w-4 h-4 mr-2" />
            Đổi mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm user={user} onUpdate={getCurrentUser} />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesManager user={user} onUpdate={getCurrentUser} />
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Profile Form Component
const ProfileForm = ({ user, onUpdate }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    province: user?.province || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await userAPI.updateProfile(formData);
      setSuccess("Cập nhật thông tin thành công");
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} />}
          {success && (
            <div className="p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input value={user?.phoneNumber} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh/Thành phố</Label>
            <Input
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between items-center">
            <AlertDialog>
              {/* 1. KÍCH HOẠT: Nút Đăng xuất */}
              <AlertDialogTrigger asChild>
                {/* Nút này sẽ mở Dialog khi được nhấn */}
                <Button variant="outline" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </AlertDialogTrigger>

              {/* 2. NỘI DUNG POPUP XÁC NHẬN */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc chắn muốn đăng xuất?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn sẽ cần đăng nhập lại để truy cập các tính năng bảo mật
                    của tài khoản.
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Addresses Manager Component
const AddressesManager = ({ user, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    province: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await userAPI.updateAddress(editingId, formData);
      } else {
        await userAPI.addAddress(formData);
      }
      onUpdate();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;

    try {
      await userAPI.deleteAddress(addressId);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || "Xóa địa chỉ thất bại");
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address._id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      province: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Địa chỉ của tôi</h3>
            <Button onClick={() => setIsAdding(true)}>Thêm địa chỉ mới</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.addresses?.map((address) => (
              <Card key={address._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.phoneNumber}
                      </p>
                    </div>
                    {address.isDefault && <Badge>Mặc định</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {address.detailAddress}, {address.ward}, {address.province}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address._id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh/Thành phố</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailAddress">Địa chỉ cụ thể</Label>
                <Input
                  id="detailAddress"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Cập nhật" : "Thêm địa chỉ"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Change Password Form Component
const ChangePasswordForm = () => {
  const { changePassword } = useAuthStore();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    const result = await changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      setSuccess("Đổi mật khẩu thành công");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} />}
          {success && (
            <div className="p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
