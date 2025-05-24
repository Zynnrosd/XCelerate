"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Periksa apakah pengguna memiliki sesi reset kata sandi yang valid
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      // Jika tidak ada sesi atau bukan sesi reset kata sandi, arahkan ke halaman login
      if (!data.session) {
        toast({
          title: "Sesi tidak valid",
          description: "Tautan reset kata sandi tidak valid atau telah kedaluwarsa.",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    checkSession()
  }, [router, toast])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validasi kata sandi
    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok")
      setLoading(false)
      return
    }

    try {
      // Update kata sandi
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      toast({
        title: "Kata sandi diperbarui",
        description: "Kata sandi Anda telah berhasil diperbarui.",
      })

      // Arahkan ke halaman login setelah beberapa detik
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: any) {
      console.error("Error updating password:", error)
      setError(error.message)
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
          <CardTitle className="text-2xl font-bold">Atur Ulang Kata Sandi</CardTitle>
          <CardDescription>Buat kata sandi baru untuk akun Anda</CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Kata sandi Anda telah berhasil diperbarui!</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Anda akan dialihkan ke halaman login dalam beberapa detik...
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/login">Pergi ke Halaman Login</Link>
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi Baru</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                    <span>Memperbarui...</span>
                  </div>
                ) : (
                  "Perbarui Kata Sandi"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
