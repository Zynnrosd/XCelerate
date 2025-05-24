"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import { User, Calendar, Clock, Trophy, Activity, BarChart2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Session error:", error.message)
          throw error
        }

        if (!data.session) {
          console.log("No active session found, redirecting to login")
          window.location.href = "/login"
          return
        }

        const { data: userData } = await supabase.auth.getUser()

        if (!userData.user) {
          console.log("No user found, redirecting to login")
          window.location.href = "/login"
          return
        }

        console.log("User authenticated:", userData.user.id)
        setUser(userData.user)

        // Fetch profile data
        await fetchProfile(userData.user.id)

        // Fetch activities
        await fetchActivities(userData.user.id)
      } catch (error: any) {
        console.error("Authentication error:", error.message)
        toast({
          title: "Error autentikasi",
          description: error.message,
          variant: "destructive",
        })
        window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [toast])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error mengambil profil",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const fetchActivities = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(5)

      if (error) {
        throw error
      }

      setActivities(data || [])
    } catch (error: any) {
      console.error("Error fetching activities:", error)
      toast({
        title: "Error mengambil aktivitas",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Calculate activity stats
  const totalActivities = activities.length
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0)

  // Get activity types and count
  const activityTypes = activities.reduce((acc: Record<string, number>, activity) => {
    const type = activity.activity_type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Find most frequent activity type
  let favoriteActivity = "Tidak Ada"
  let maxCount = 0
  Object.entries(activityTypes).forEach(([type, count]) => {
    if (count > maxCount) {
      favoriteActivity = type
      maxCount = count
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U"

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />
      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Profil Saya</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {user?.user_metadata?.avatar_url ? (
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary">
                      <Image
                        src={user.user_metadata.avatar_url || "/placeholder.svg"}
                        alt="Avatar pengguna"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary text-primary-foreground text-4xl font-bold border-4 border-primary">
                      {userInitials}
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">{profile?.full_name || "Pengguna"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Bergabung pada</span>
                    <span className="font-medium">{formatDate(user?.created_at || new Date().toISOString())}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Aktivitas</span>
                    <span className="font-medium">{totalActivities}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Durasi</span>
                    <span className="font-medium">{totalDuration} menit</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Aktivitas Favorit</span>
                    <span className="font-medium">{favoriteActivity}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button asChild className="w-full">
                    <a href="/settings">Edit Profil</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Ringkasan
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Aktivitas Terbaru
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Ringkasan Aktivitas
                    </CardTitle>
                    <CardDescription>Ringkasan aktivitas dan pencapaian Anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {totalActivities === 0 ? (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Belum ada aktivitas tercatat</p>
                        <p className="text-sm text-muted-foreground">
                          Tambahkan aktivitas pertama Anda untuk melihat ringkasan di sini
                        </p>
                        <Button className="mt-4" asChild>
                          <a href="/dashboard">Tambah Aktivitas</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-primary/10 p-3">
                                <Trophy className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Aktivitas</p>
                                <p className="text-2xl font-bold">{totalActivities}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-primary/10 p-3">
                                <Clock className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Durasi</p>
                                <p className="text-2xl font-bold">{totalDuration} menit</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-primary/10 p-3">
                                <Activity className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Aktivitas Favorit</p>
                                <p className="text-2xl font-bold">{favoriteActivity}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-primary/10 p-3">
                                <Calendar className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Aktivitas Terakhir</p>
                                <p className="text-2xl font-bold">
                                  {activities.length > 0 ? formatDate(activities[0].date) : "Tidak Ada"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Aktivitas Terbaru
                    </CardTitle>
                    <CardDescription>5 aktivitas terakhir yang Anda catat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activities.length === 0 ? (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Belum ada aktivitas tercatat</p>
                        <p className="text-sm text-muted-foreground">
                          Tambahkan aktivitas pertama Anda untuk melihat daftar di sini
                        </p>
                        <Button className="mt-4" asChild>
                          <a href="/dashboard">Tambah Aktivitas</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Aktivitas</TableHead>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Durasi</TableHead>
                              <TableHead>Catatan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activities.map((activity) => (
                              <TableRow key={activity.id}>
                                <TableCell className="font-medium">{activity.activity_type}</TableCell>
                                <TableCell>{formatDate(activity.date)}</TableCell>
                                <TableCell>{activity.duration} menit</TableCell>
                                <TableCell className="max-w-[200px] truncate">{activity.notes || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {activities.length > 0 && (
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" asChild>
                          <a href="/dashboard">Lihat Semua Aktivitas</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
