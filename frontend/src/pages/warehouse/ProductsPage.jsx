// ============================================
// FILE: src/pages/warehouse/ProductsPage.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/shared/Loading";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  ImagePlus,
} from "lucide-react";
import { productAPI } from "@/lib/api";
import { formatPrice, getStatusColor, getStatusText } from "@/lib/utils";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    price: "",
    originalPrice: "",
    discount: 0,
    quantity: "",
    status: "AVAILABLE",
    installmentOption: "NONE",
    images: [],
    description: "",
    specifications: {
      screenSize: "",
      cpu: "",
      operatingSystem: "",
      storage: "",
      ram: "",
      mainCamera: "",
      frontCamera: "",
      colors: "",
      resolution: "",
      manufacturer: "",
      condition: "",
      battery: "",
      weight: "",
      dimensions: "",
    },
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, statusFilter, pagination.currentPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 12,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const response = await productAPI.getAll(params);
      const { products, totalPages, currentPage, total } = response.data.data;

      setProducts(products);
      setPagination({ currentPage, totalPages, total });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        model: product.model,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount || 0,
        quantity: product.quantity,
        status: product.status,
        images: product.images || [],
        description: product.description || "",
        installmentOption: product.installmentOption || "NONE",
        specifications: {
          screenSize: product.specifications?.screenSize || "",
          cpu: product.specifications?.cpu || "",
          operatingSystem: product.specifications?.operatingSystem || "",
          storage: product.specifications?.storage || "",
          ram: product.specifications?.ram || "",
          mainCamera: product.specifications?.mainCamera || "",
          frontCamera: product.specifications?.frontCamera || "",
          colors: Array.isArray(product.specifications?.colors)
            ? product.specifications.colors.join(", ")
            : product.specifications?.colors || "",
          resolution: product.specifications?.resolution || "",
          manufacturer: product.specifications?.manufacturer || "",
          condition: product.specifications?.condition || "",
          battery: product.specifications?.battery || "",
          weight: product.specifications?.weight || "",
          dimensions: product.specifications?.dimensions || "",
        },
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        model: "",
        price: "",
        originalPrice: "",
        discount: 0,
        quantity: "",
        status: "AVAILABLE",
        images: [],
        description: "",
        installmentOption: "NONE",
        specifications: {
          screenSize: "",
          cpu: "",
          operatingSystem: "",
          storage: "",
          ram: "",
          mainCamera: "",
          frontCamera: "",
          colors: "",
          resolution: "",
          manufacturer: "",
          condition: "",
          battery: "",
          weight: "",
          dimensions: "",
        },
      });
    }
    setError("");
    setShowDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name.includes("spec_")) {
      const specKey = name.replace("spec_", "");
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey]: value,
        },
      });
    } else {
      const next = { ...formData, [name]: value };
      // Auto-calc discount when price and originalPrice available
      const op = Number(name === "originalPrice" ? value : next.originalPrice);
      const p = Number(name === "price" ? value : next.price);
      if (op > 0 && p >= 0) {
        const discount = Math.max(0, Math.ceil(((op - p) / op) * 100));
        next.discount = isFinite(discount) ? discount : 0;
      }
      setFormData(next);
    }
  };

  const handleImageChange = (e, index) => {
    const newImages = [...formData.images];
    newImages[index] = e.target.value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: Number(formData.discount),
        quantity: Number(formData.quantity),
        images: formData.images.filter((img) => img.trim() !== ""),
        specifications: {
          ...formData.specifications,
          colors: formData.specifications.colors
            ? formData.specifications.colors.split(",").map((c) => c.trim()).filter(Boolean)
            : [],
        },
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, submitData);
      } else {
        await productAPI.create(submitData);
      }

      await fetchProducts();
      setShowDialog(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `${editingProduct ? "Cập nhật" : "Tạo"} sản phẩm thất bại`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await productAPI.delete(productId);
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination({ ...pagination, currentPage: 1 });
  };

  if (isLoading && products.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">
            Tổng số: {pagination.total} sản phẩm
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="AVAILABLE">Còn hàng</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                <SelectItem value="DISCONTINUED">Ngừng kinh doanh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <div className="aspect-square relative bg-gray-100">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <Badge
                className={`absolute top-2 right-2 ${getStatusColor(
                  product.status
                )}`}
              >
                {getStatusText(product.status)}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {product.model}
              </p>

              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.discount > 0 && (
                    <Badge variant="destructive">-{product.discount}%</Badge>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-muted-foreground">Tồn kho:</span>
                <span
                  className={`font-semibold ${
                    product.quantity > 10
                      ? "text-green-600"
                      : product.quantity > 0
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {product.quantity} sản phẩm
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenDialog(product)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setPagination({
                ...pagination,
                currentPage: pagination.currentPage - 1,
              })
            }
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() =>
              setPagination({
                ...pagination,
                currentPage: pagination.currentPage + 1,
              })
            }
          >
            Sau
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết sản phẩm
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} />}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Giá gốc *</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Giảm giá (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Giá bán *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Số lượng *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Còn hàng</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                    <SelectItem value="DISCONTINUED">
                      Ngừng kinh doanh
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Th��ng số kỹ thuật
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Kích thước màn hình (vd: 6.1 inch)"
                  name="spec_screenSize"
                  value={formData.specifications.screenSize}
                  onChange={handleChange}
                />
                <Input
                  placeholder="CPU/Chip (vd: Apple A18 Bionic)"
                  name="spec_cpu"
                  value={formData.specifications.cpu}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Hệ điều hành (vd: iOS)"
                  name="spec_operatingSystem"
                  value={formData.specifications.operatingSystem}
                  onChange={handleChange}
                />
                {/* Fixed storage options */}
                <div>
                  <Label>Dung lượng</Label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    name="spec_storage"
                    value={formData.specifications.storage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn dung lượng</option>
                    {[
                      "64GB",
                      "128GB",
                      "256GB",
                      "512GB",
                      "1TB",
                      "2TB",
                    ].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input
                  placeholder="RAM (vd: 8GB)"
                  name="spec_ram"
                  value={formData.specifications.ram}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Camera chính (vd: 48MP - 12MP)"
                  name="spec_mainCamera"
                  value={formData.specifications.mainCamera}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Camera trước (vd: 12MP)"
                  name="spec_frontCamera"
                  value={formData.specifications.frontCamera}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Màu sắc (nhập danh sách, cách nhau bằng dấu phẩy)"
                  name="spec_colors"
                  value={formData.specifications.colors}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Độ phân giải màn hình (vd: 2556×1179 pixel)"
                  name="spec_resolution"
                  value={formData.specifications.resolution}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Hãng sản xuất (vd: Apple)"
                  name="spec_manufacturer"
                  value={formData.specifications.manufacturer}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Tình trạng SP (vd: New)"
                  name="spec_condition"
                  value={formData.specifications.condition}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Pin (vd: 3200mAh)"
                  name="spec_battery"
                  value={formData.specifications.battery}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Trọng lượng (vd: 170g)"
                  name="spec_weight"
                  value={formData.specifications.weight}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Kích thước (vd: 146.7 x 71.5 x 7.8 mm)"
                  name="spec_dimensions"
                  value={formData.specifications.dimensions}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Hình ảnh</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageField}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Thêm ảnh
                </Button>
              </div>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="URL hình ảnh"
                      value={image}
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImageField(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Installment option */}
            <div className="space-y-2">
              <Label>Tuỳ chọn trả góp</Label>
              <select
                name="installmentOption"
                value={formData.installmentOption}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="NONE">Không áp dụng</option>
                <option value="ZERO_PERCENT_ZERO_DOWN">Trả góp 0% 0đ</option>
                <option value="ZERO_PERCENT">Trả góp 0%</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang xử lý..."
                  : editingProduct
                  ? "Cập nhật"
                  : "Tạo sản phẩm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;