// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Star } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { addToCart } = useCartStore()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`)
      setProduct(data.data.product)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${id}`)
      setReviews(data.data.reviews)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'CUSTOMER') {
      alert('Chỉ khách hàng mới có thể mua hàng')
      return
    }

    try {
      await addToCart(product._id, quantity)
      alert('Đã thêm vào giỏ hàng!')
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Không tìm thấy sản phẩm</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.totalReviews} đánh giá)
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold text-red-600">
                {formatPrice(product.price)}
              </p>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Specifications */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold mb-3">Thông số kỹ thuật</h3>
              <div className="space-y-2 text-sm">
                {product.specifications.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Màu sắc:</span>
                    <span className="font-medium">{product.specifications.color}</span>
                  </div>
                )}
                {product.specifications.storage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bộ nhớ:</span>
                    <span className="font-medium">{product.specifications.storage}</span>
                  </div>
                )}
                {product.specifications.ram && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">RAM:</span>
                    <span className="font-medium">{product.specifications.ram}</span>
                  </div>
                )}
                {product.specifications.screen && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Màn hình:</span>
                    <span className="font-medium">{product.specifications.screen}</span>
                  </div>
                )}
                {product.specifications.chip && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chip:</span>
                    <span className="font-medium">{product.specifications.chip}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border rounded-md">
              <button
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Còn {product.quantity} sản phẩm
            </span>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.status !== 'AVAILABLE'}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.status === 'AVAILABLE' ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
          <Card>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá nào</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.customerId.fullName}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}