import { client } from "@/sanity/lib/client"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import CartButton from "./CartButton"

async function getProduct(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    price,
    images
  }`

  return await client.fetch(query, { slug })
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params   // 👈 IMPORTANT FIX

  const product = await getProduct(slug)

  if (!product) {
    return <div className="p-10">Product not found</div>
  }
  const imageUrl =
  product.images && product.images.length > 0
    ? urlFor(product.images[0]).width(500).url()
    : "/placeholder.png"

  return (
    <div className="bg-white text-black">
    <div className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid md:grid-cols-2 gap-24 items-start">
        
        {/* LEFT — Large Minimal Image */}
        <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
          <Image
            src={
              product.images?.[0]
                ? urlFor(product.images[0]).width(1200).url()
                : "/placeholder.png"
            }
            alt={product.title}
            fill
            priority
            className="object-cover hover:scale-[1.02] transition duration-700 ease-out"
          />
        </div>
  
        {/* RIGHT — Clean Editorial Layout */}
        <div className="flex flex-col justify-start space-y-12">
          
          {/* Title */}
          <div>
            <h1 className="text-5xl font-light tracking-wide leading-tight">
              {product.title}
            </h1>
          </div>
  
          {/* Price */}
          <div>
            <p className="text-2xl tracking-widest">
              ${product.price}
            </p>
          </div>
  
          {/* Description */}
          <div>
            <p className="text-neutral-600 leading-loose max-w-md">
              {product.description}
            </p>
          </div>
  
          {/* Add To Cart */}
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
  
          {/* Divider */}
          <div className="border-t border-neutral-200 pt-8 text-sm text-neutral-500 space-y-2">
            <p>Made with premium materials</p>
            <p>Complimentary worldwide shipping</p>
            <p>30-day returns</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  )
}