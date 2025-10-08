// ============================================
// FILE: src/pages/ProductsPage.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/shared/ProductCard";
import { Loading } from "@/components/shared/Loading";
import { Search, SlidersHorizontal } from "lucide-react";
import { productAPI } from "@/lib/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await productAPI.getAll(params);
      setProducts(response.data.data.products);
      setPagination({
        ...pagination,
        totalPages: response.data.data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm</h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <select
              className="px-4 py-2 border rounded-md"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="createdAt">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>

            <select
              className="px-4 py-2 border rounded-md"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="AVAILABLE">Còn hàng</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
              >
                Trước
              </Button>
              
              <div className="flex items-center px-4">
                Trang {pagination.page} / {pagination.totalPages}
              </div>

              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;