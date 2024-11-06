import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Loader2 } from "lucide-react"
import { useSignUp, useClerk } from "@clerk/nextjs"

interface VerificationFormProps {
  email: string // to display in the form
  onVerificationComplete: () => void
}

const VerificationForm = ({
  email,
  onVerificationComplete,
}: VerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { signUp } = useSignUp()
  const clerk = useClerk()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signUp?.attemptVerification({
        strategy: "email_code",
        code: verificationCode,
      })

      if (result?.status === "complete") {
        await clerk?.setActive({
          session: result.createdSessionId,
        })
        onVerificationComplete()
      }
    } catch (err) {
      setError("Invalid verification code. Please try again.")
      console.error("Error during verification:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img
            src="/the-viral-library-logo-black.png"
            alt="The Viral Library"
            className="h-16 w-auto"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification code to {email}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="pl-10"
                    maxLength={6}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={() =>
                    signUp?.prepareVerification({ strategy: "email_code" })
                  }
                  className="text-blue-600 hover:underline"
                >
                  Send again
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default VerificationForm
