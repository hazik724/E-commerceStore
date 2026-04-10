"use client"

import Image from "next/image"
import Link from "next/link"
import CartButton from "@/app/(app)/product/[slug]/CartButton"
import { useCartStore } from "@/app/store/CartStore"
import { urlFor } from "@/sanity/lib/image"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface Product {
  _id: string
  title: string
  slug: { current: string }
  images: any[]
  price: number
  discountPrice?: number
}

interface Props {
  product: Product
}

export default function FeaturedProductCard({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      slug: product.slug.current,
      title: product.title,
      image: product.images?.[0]
        ? urlFor(product.images[0]).width(500).height(600).url()
        : "/placeholder.png",
      price: product.discountPrice ?? product.price,
      quantity: 1,
    })
    toast.success("Item added to cart")
  }

  // ✅ carousel state
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (!product.images || product.images.length === 0) return

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }, 2500)

    return () => clearInterval(interval)
  }, [product.images])

  return (
    <div className="group relative bg-white dark:bg-gray-900 overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
      
      {/* IMAGE */}
      <Link href={`/product/${product.slug.current}`}>
        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          
          {/* ✅ SLIDER WRAPPER */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentImage * 100}%)`,
            }}
          >
            {product.images?.length > 0 ? (
              product.images.map((img, index) => (
                <div key={index} className="relative min-w-full h-full">
                  <Image
                    src={urlFor(img).width(500).height(600).url()}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative min-w-full h-full">
                <Image
                  src="/placeholder.png"
                  alt="placeholder"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      {/* PRODUCT INFO */}
      <div className="p-4 space-y-2">
        <Link href={`/product/${product.slug.current}`}>
          <h2 className="text-sm md:text-base font-medium line-clamp-2 hover:underline min-h-[40px]">
            {product.title}
          </h2>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold text-sm md:text-base">
            PKR {product.discountPrice ?? product.price}
          </span>
          {product.discountPrice && (
            <span className="line-through text-gray-400 text-xs">
              ${product.price}
            </span>
          )}
        </div>

        <div className="pt-6">
          <CartButton
            id={product._id}
            title={product.title}
            slug={product.slug.current}
            price={product.price}
            image={
              product.images?.[0]
                ? urlFor(product.images[0]).width(600).url()
                : "/placeholder.png"
            }
          />
        </div>
      </div>
    </div>
  )
}