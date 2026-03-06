"use client"

import { useState } from "react"
import { useCartStore } from "@/app/store/CartStore"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useUser, SignIn } from "@clerk/nextjs"

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const { isSignedIn, user } = useUser()

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    deliveryInstructions: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Auto-fill form with Clerk user info
  useState(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }))
    }
  })

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleOrder = async () => {
    if (!isSignedIn) {
      setShowLoginModal(true)
      return
    }

    // Simple validation
    if (
      !form.customerName ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      alert("Please fill all required fields!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          deliveryInstructions: form.deliveryInstructions,
          clerkUserId: user?.id || null, // store Clerk ID in order
          products: items.map((item) => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount: total,
        }),
      })

      const json = await res.json()
      if (json.success) {
        clearCart()
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !success)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-4 text-white">
          Your Bag is Empty
        </h2>
        <p className="text-gray-400 mb-8">Add items to your bag to proceed.</p>
        <Link href="/product">
          <button className="bg-gold-500 text-black uppercase tracking-widest font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:brightness-110 transition-all duration-300">
            Browse Products
          </button>
        </Link>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 md:px-12 py-16">
      <h1 className="text-5xl md:text-6xl font-serif text-center mb-16 tracking-widest">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-16">
        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-8 border border-gold-500"
        >
          <h2 className="text-2xl font-semibold border-b border-gold-500 pb-2">
            Shipping Details
          </h2>

          {[ 
            { name: "customerName", label: "Full Name *" },
            { name: "email", label: "Email *", type: "email" },
            { name: "phone", label: "Phone *" },
            { name: "addressLine1", label: "Address Line 1 *" },
            { name: "addressLine2", label: "Address Line 2" },
            { name: "city", label: "City *" },
            { name: "state", label: "State/Province *" },
            { name: "postalCode", label: "Postal Code *" },
            { name: "country", label: "Country *" },
            { name: "deliveryInstructions", label: "Delivery Instructions" },
          ].map((field) => (
            <div key={field.name} className="relative">
              {field.name === "deliveryInstructions" ? (
                <textarea
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  rows={3}
                  className="peer w-full bg-transparent border-b border-white/30 focus:border-gold-500 py-3 px-1 outline-none placeholder-transparent transition resize-none"
                  placeholder={field.label}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-white/30 focus:border-gold-500 py-3 px-1 outline-none placeholder-transparent transition"
                  placeholder={field.label}
                />
              )}
              <label className="absolute left-1 top-3 text-white/60 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-gold-500 peer-focus:text-xs">
                {field.label}
              </label>
            </div>
          ))}

          {/* Payment Method */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="flex items-center gap-2">
              <input type="radio" checked readOnly className="accent-gold-500" />
              <span>Cash on Delivery</span>
            </div>
          </div>
        </motion.div>

        {/* ORDER SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-black/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gold-500 flex flex-col space-y-6"
        >
          <h2 className="text-2xl font-semibold border-b border-gold-500 pb-2">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold-500 scrollbar-track-black/20">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4 items-center">
                <div className="relative w-20 h-28 bg-gray-800 rounded-lg overflow-hidden border border-gold-500">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-lg">{item.title}</p>
                  <p className="text-gray-400 text-sm">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-gold-500">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gold-500 pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <motion.button
            onClick={handleOrder}
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white text-black font-serif text-lg rounded-2xl uppercase tracking-widest hover:brightness-110 transition"
          >
            {loading ? "Processing..." : success ? "Order Placed!" : "Place Order"}
          </motion.button>
        </motion.div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black/90 text-white p-12 rounded-3xl shadow-2xl text-center max-w-lg border border-gold-500"
            >
              <h2 className="text-3xl font-serif font-semibold mb-4">Thank you!</h2>
              <p className="text-gray-400 mb-6">Your order has been successfully placed.</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:brightness-110 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && !isSignedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black/90 text-white p-12 rounded-3xl shadow-2xl max-w-lg border border-gold-500"
            >
              <h2 className="text-3xl font-serif font-semibold mb-4">Login / Sign Up</h2>
              <p className="text-gray-400 mb-6">Please login or sign up to place an order.</p>
              <SignIn path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" />
              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:brightness-110 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}