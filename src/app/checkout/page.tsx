"use client"

// app/checkout/page.tsx
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSignUp, useClerk } from "@clerk/nextjs"
import VerificationForm from "@/components/VerificationForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { signUp } = useSignUp()
  const clerk = useClerk()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

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

      // 2. Create payment intent
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
        // 4. Create Clerk signup
        await signUp?.create({
          emailAddress: email,
          password: password,
        })

        // 5. Prepare email verification
        await signUp?.prepareVerification({
          strategy: "email_code",
        })

        // 6. Show verification form
        setShowVerification(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  if (showVerification) {
    return (
      <VerificationForm
        email={email}
        onVerificationComplete={() => router.push("/dashboard")}
      />
    )
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

// Wrapper component stays the same
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("")

  useEffect(() => {
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "",
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
