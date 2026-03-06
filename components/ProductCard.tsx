"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/store/CartStore"
import { urlFor } from "@/sanity/lib/image"
import CartButton from "@/app/(app)/product/[slug]/CartButton"

interface Variant {
  size?: string
  color?: string
  variantStock?: number
}

interface Product {
  _id: string
  title: string
  slug: { current: string }
  images: any[]
  price: number
  discountPrice?: number
  variants?: Variant[]
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (size?: string, color?: string) => {
    addItem({
      _id: product._id,
      slug: product.slug.current,
      title: product.title,
      image: product.images?.[0]
        ? urlFor(product.images[0]).width(500).height(600).url()
        : "/placeholder.png",
      price: product.discountPrice ?? product.price,
      quantity: 1,
      size,
      color,
    })
  }

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
      {/* IMAGE */}
      <Link href={`/product/${product.slug.current}`}>
        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <Image
            src={
              product.images?.[0]
                ? urlFor(product.images[0]).width(500).height(600).url()
                : "/placeholder.png"
            }
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Luxury overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      {/* INFO */}
      <div className="p-4 space-y-2">
        <Link href={`/product/${product.slug.current}`}>
          <h2 className="text-sm md:text-base font-medium line-clamp-2 hover:underline min-h-[40px]">
            {product.title}
          </h2>
        </Link>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-black font-semibold text-sm md:text-base">
            ${product.discountPrice ?? product.price}
          </span>
          {product.discountPrice && (
            <span className="line-through text-neutral-400 text-sm">
              ${product.price}
            </span>
          )}
        </div>

        {/* VARIANTS */}
        
        

        {/* ADD TO CART */}
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