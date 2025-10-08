// FILE: src/components/shared/ProductCard.jsx
// ============================================
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getStatusColor, getStatusText } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "CUSTOMER") {
      return;
    }

    await addToCart(product._id, 1);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="aspect-square relative">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            -{product.discount}%
          </Badge>
        )}
        <Badge 
          className={`absolute top-2 left-2 ${getStatusColor(product.status)}`}
        >
          {getStatusText(product.status)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">
            {product.averageRating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-sm text-muted-foreground">
            ({product.totalReviews || 0})
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Còn lại: {product.quantity} sản phẩm
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.status !== "AVAILABLE" || product.quantity === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
};
