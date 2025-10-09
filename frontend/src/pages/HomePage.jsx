// ============================================
// FILE: src/pages/HomePage.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { Loading } from "@/components/shared/Loading";
import { ArrowRight } from "lucide-react";
import { productAPI } from "@/lib/api";
import IPhoneShowcase from "@/components/shared/iPhoneShowcase";


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
      {/* Hero Banner 1 - 500px height */}
      <div className="w-full h-[580px] mb-2.5">
        <img
          src="/ip17pm.png"
          alt="iPhone 17 Pro Max"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Banner 2 - 450px height */}
      <div className="w-full h-[550px] mb-2.5">
        <img
          src="/ipAir.png"
          alt="Banner 2"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Banner 3 - 450px height */}
      <div className="w-full h-[550px] mb-2.5">
        <img
          src="/ip17.png"
          alt="Banner 3"
          className="w-full h-full object-cover"
        />
      </div>

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
      {/* iPhone Showcase Section */}
      <IPhoneShowcase />

    </div>
  );
};

export default HomePage;  