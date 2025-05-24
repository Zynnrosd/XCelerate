"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Mail, AlertCircle, User, Lock, CheckCircle, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [signupSuccess, setSignupSuccess] = useState(false)
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Signing up with email:", email)

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        console.error("Signup error:", error)
        throw error
      }

      console.log("Signup response:", data)

      // Check if email confirmation is required by checking if we have a session
      if (data.user && !data.session) {
        // Email confirmation is required
        setSignupSuccess(true)
        toast({
          title: "Akun berhasil dibuat",
          description: "Silakan periksa email Anda untuk tautan konfirmasi untuk mengaktifkan akun Anda.",
        })
      } else if (data.user && data.session) {
        // Email confirmation is disabled, user is automatically logged in
        toast({
          title: "Akun berhasil dibuat",
          description: "Akun Anda telah berhasil dibuat.",
        })

        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        // Something unexpected happened
        throw new Error("Pendaftaran gagal. Silakan coba lagi.")
      }
    } catch (error: any) {
      toast({
        title: "Pendaftaran gagal",
        description: error.message,
        variant: "destructive",
      })
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

  if (signupSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full blur"></div>
                <div className="relative bg-background rounded-full p-4">
                  <Mail className="h-12 w-12 text-green-500" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Periksa Email Anda</CardTitle>
            <CardDescription>
              Kami telah mengirimkan tautan konfirmasi ke <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-6 rounded-lg flex flex-col items-start gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>Jika Anda tidak melihat email di kotak masuk, silakan periksa folder spam Anda.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    Email akan datang dari <strong>noreply@supabase.co</strong> dengan subjek{" "}
                    <strong>"Konfirmasi Pendaftaran Anda"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    Tautan konfirmasi akan kedaluwarsa setelah 24 jam. Jika Anda tidak mengonfirmasi email Anda dalam
                    waktu tersebut, Anda perlu mendaftar lagi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-red-500">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">
                  <p>
                    Jika Anda tidak menerima email, silakan hubungi administrator untuk menonaktifkan konfirmasi email.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-sm font-medium">Akun Anda telah berhasil dibuat!</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Pergi ke Halaman Login
            </Button>
            <Button variant="outline" onClick={() => setSignupSuccess(false)} className="w-full">
              Kembali ke Pendaftaran
            </Button>
          </CardFooter>
        </Card>
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
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
              alt="Pelacakan kebugaran"
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
            <h1 className="text-2xl font-bold mb-2">Bergabung dengan Xcelerate Hari Ini</h1>
            <p className="text-muted-foreground mb-6">
              Buat akun Anda dan mulai lacak perjalanan kebugaran Anda dengan platform pelacakan aktivitas komprehensif
              kami.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Akun Gratis</h3>
                  <p className="text-sm text-muted-foreground">Buat akun Anda secara gratis dan mulai melacak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Lacak Berbagai Aktivitas</h3>
                  <p className="text-sm text-muted-foreground">Catat lari, bersepeda, berenang, dan lainnya</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Visualisasikan Kemajuan Anda</h3>
                  <p className="text-sm text-muted-foreground">Lihat peningkatan Anda dengan grafik dan statistik</p>
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
            <CardTitle className="text-2xl font-bold">Buat akun</CardTitle>
            <CardDescription>Masukkan informasi Anda untuk membuat akun</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  <User className="h-4 w-4" /> Nama Lengkap
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <User className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" /> Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                  <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
                <p className="text-xs text-muted-foreground">Kata sandi harus minimal 6 karakter</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                    <span>Membuat akun...</span>
                  </div>
                ) : (
                  "Buat akun"
                )}
              </Button>
              <div className="text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Masuk
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
