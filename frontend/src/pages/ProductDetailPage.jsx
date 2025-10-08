// ============================================
// FILE: src/pages/ProductDetailPage.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/shared/Loading";
import { ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { productAPI, reviewAPI } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, getStatusColor, getStatusText } from "@/lib/utils";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productAPI.getById(id),
          reviewAPI.getByProduct(id),
        ]);

        setProduct(productRes.data.data.product);
        setReviews(reviewsRes.data.data.reviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "CUSTOMER") {
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setQuantity(1);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border">
            <img
              src={product.images?.[selectedImage] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className={getStatusColor(product.status)}>
              {getStatusText(product.status)}
            </Badge>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <p className="text-muted-foreground mt-1">Mã: {product.model}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.totalReviews} đánh giá)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge className="bg-red-500">-{product.discount}%</Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Còn lại: {product.quantity} sản phẩm
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.specifications.color && (
                    <div>
                      <span className="text-muted-foreground">Màu sắc:</span>
                      <span className="ml-2 font-medium">{product.specifications.color}</span>
                    </div>
                  )}
                  {product.specifications.storage && (
                    <div>
                      <span className="text-muted-foreground">Bộ nhớ:</span>
                      <span className="ml-2 font-medium">{product.specifications.storage}</span>
                    </div>
                  )}
                  {product.specifications.ram && (
                    <div>
                      <span className="text-muted-foreground">RAM:</span>
                      <span className="ml-2 font-medium">{product.specifications.ram}</span>
                    </div>
                  )}
                  {product.specifications.screen && (
                    <div>
                      <span className="text-muted-foreground">Màn hình:</span>
                      <span className="ml-2 font-medium">{product.specifications.screen}</span>
                    </div>
                  )}
                  {product.specifications.chip && (
                    <div>
                      <span className="text-muted-foreground">Chip:</span>
                      <span className="ml-2 font-medium">{product.specifications.chip}</span>
                    </div>
                  )}
                  {product.specifications.camera && (
                    <div>
                      <span className="text-muted-foreground">Camera:</span>
                      <span className="ml-2 font-medium">{product.specifications.camera}</span>
                    </div>
                  )}
                  {product.specifications.battery && (
                    <div>
                      <span className="text-muted-foreground">Pin:</span>
                      <span className="ml-2 font-medium">{product.specifications.battery}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                disabled={quantity >= product.quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.status !== "AVAILABLE" || product.quantity === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">
            Đánh giá ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có đánh giá nào
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">
                      {review.customerId?.fullName}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;