// app/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSignIn } from "@clerk/nextjs"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

function CheckoutForm() {
  const { signIn } = useSignIn()
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Check if user exists and verify purchase status
      const checkUserResponse = await fetch("/api/users/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const existingUser = await checkUserResponse.json()

      if (existingUser?.purchasedProduct) {
        setError("You have already purchased this product. Please sign in.")
        router.push("/sign-in")
        return
      }

      // 2. Create payment intent and get customer ID
      const intentResponse = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      const { clientSecret, customerId } = await intentResponse.json()

      if (!customerId) {
        throw new Error("Failed to create customer")
      }

      // 3. Process payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          redirect: "if_required",
        }
      )

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent.status === "succeeded") {
        // 4. Create user account and sign in
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            name,
            stripeCustomerId: customerId,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create user")
        }

        // 5. Sign in the user immediately using Clerk
        try {
          const result = await signIn?.create({
            identifier: email,
            password,
          })

          if (result?.status === "complete") {
            router.push("/dashboard")
          } else {
            throw new Error("Failed to sign in")
          }
        } catch (signInError) {
          console.error("Sign in error:", signInError)
          router.push("/sign-in")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <PaymentElement />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !stripe || !elements}
          >
            {loading ? "Processing..." : "Purchase ($29.00)"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Wrapper component to handle Stripe setup
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("")

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "", // Will be updated when user enters email
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        }
      })
  }, [])

  if (!clientSecret) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  )
}
