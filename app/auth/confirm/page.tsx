"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Check if we have a session already (user might have been auto-confirmed)
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session) {
          console.log("User already has a session, confirmation successful")
          setSuccess(true)
          setLoading(false)
          return
        }

        // Otherwise, try to verify with the token
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type") as "signup" | "recovery" | "invite" | "email_change" | null

        if (!token_hash || !type) {
          setError("Invalid confirmation link. Missing parameters.")
          setLoading(false)
          return
        }

        console.log("Verifying with token_hash:", token_hash, "type:", type)

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        })

        if (error) {
          console.error("Verification error:", error)
          setError(error.message)
        } else {
          setSuccess(true)
        }
      } catch (err: any) {
        console.error("Confirmation error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            {success ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{success ? "Email Confirmed" : "Confirmation Failed"}</CardTitle>
          <CardDescription>
            {success ? "Your email has been confirmed successfully." : "We couldn't confirm your email."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <p className="text-center text-muted-foreground">
              You can now log in to your account using your email and password.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
