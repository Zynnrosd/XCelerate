"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, AlertCircle, Lock, Mail, BarChart2, Target } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          console.log("User already logged in, redirecting to dashboard")
          window.location.href = "/dashboard"
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      console.log("Attempting login with email:", email)

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)

        // Check if the error is related to email confirmation
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Email Anda belum dikonfirmasi. Silakan periksa kotak masuk Anda untuk email konfirmasi.")
        } else {
          setErrorMessage(error.message)
        }

        throw error
      }

      if (!data.user || !data.session) {
        throw new Error("Login gagal. Silakan coba lagi.")
      }

      console.log("Login successful, redirecting to dashboard")

      toast({
        title: "Login berhasil",
        description: "Anda telah berhasil masuk.",
      })

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error: any) {
      // Error is already handled above
      if (!errorMessage) {
        toast({
          title: "Login gagal",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Memeriksa sesi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="hidden md:flex flex-col justify-center p-6 bg-muted/50 backdrop-blur-sm rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1470&auto=format&fit=crop"
              alt="Latar belakang kebugaran"
              fill
              className="object-cover opacity-20"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground/50 rounded-full blur"></div>
                <div className="relative bg-background rounded-full p-4">
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang di Xcelerate</h1>
            <p className="text-muted-foreground mb-6">
              Lacak perjalanan kebugaran Anda dan capai tujuan Anda dengan platform pelacakan aktivitas komprehensif
              kami.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Lacak Kemajuan Anda</h3>
                  <p className="text-sm text-muted-foreground">Pantau aktivitas Anda dan lihat peningkatan Anda</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Visualisasikan Data Anda</h3>
                  <p className="text-sm text-muted-foreground">
                    Lihat kemajuan Anda dengan grafik dan statistik yang menarik
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Tetapkan dan Capai Tujuan</h3>
                  <p className="text-sm text-muted-foreground">
                    Tentukan tujuan kebugaran Anda dan lacak kemajuan Anda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Masuk ke Xcelerate</CardTitle>
            <CardDescription>Masukkan email dan kata sandi Anda untuk masuk ke akun Anda</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Kata Sandi
                  </Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{errorMessage}</div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  "Masuk"
                )}
              </Button>
              <div className="text-center text-sm">
                Belum punya akun?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Daftar
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
