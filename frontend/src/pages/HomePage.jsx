// ============================================
// FILE: src/pages/HomePage.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { Loading } from "@/components/shared/Loading";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
import { productAPI } from "@/lib/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll({ limit: 8, sort: "rating" });
        setProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              iPhone Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Sản phẩm chính hãng - Giá tốt nhất thị trường
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/products")}
            >
              Khám phá ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chính hãng 100%</h3>
              <p className="text-muted-foreground">
                Sản phẩm chính hãng, bảo hành đầy đủ
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Giao hàng toàn quốc</h3>
              <p className="text-muted-foreground">
                Giao hàng nhanh chóng, đảm bảo an toàn
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đánh giá cao</h3>
              <p className="text-muted-foreground">
                Được khách hàng tin tưởng và yêu thích
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
            <Button variant="ghost" onClick={() => navigate("/products")}>
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;