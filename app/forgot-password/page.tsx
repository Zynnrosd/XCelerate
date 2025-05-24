"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Kirim email reset kata sandi
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      toast({
        title: "Email terkirim",
        description: "Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda.",
      })
    } catch (error: any) {
      console.error("Error resetting password:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Lupa Kata Sandi</CardTitle>
          <CardDescription>
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda
          </CardDescription>
        </CardHeader>

        {success ? (
          <>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Email terkirim! Periksa kotak masuk Anda untuk tautan reset kata sandi.</span>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                  Kami telah mengirimkan email ke <span className="font-medium">{email}</span> dengan tautan untuk
                  mengatur ulang kata sandi Anda.
                </p>
                <p className="text-sm text-muted-foreground">
                  Jika Anda tidak melihat email dalam beberapa menit, periksa folder spam atau coba lagi.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
                Coba dengan email lain
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Kembali ke halaman login
                </Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                    <span>Mengirim...</span>
                  </div>
                ) : (
                  "Kirim Tautan Reset"
                )}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Kembali ke halaman login
                </Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
