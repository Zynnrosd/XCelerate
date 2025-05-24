"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import DashboardHeader from "@/components/dashboard-header"
import ActivityForm from "@/components/activity-form"
import ActivityList from "@/components/activity-list"
import ActivityStatistics from "@/components/activity-statistics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Trophy, TrendingUp, Award, Target, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<any[]>([])
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

        // Check if profile exists, if not create it
        await ensureProfileExists(userData.user)

        fetchActivities(userData.user.id)
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

  // Function to ensure a profile exists for the user
  const ensureProfileExists = async (user: any) => {
    try {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error checking profile:", fetchError)
        return
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        console.log("Creating profile for user:", user.id)
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || "User",
            email: user.email,
          },
        ])

        if (insertError) {
          console.error("Error creating profile:", insertError)
          toast({
            title: "Error membuat profil",
            description: insertError.message,
            variant: "destructive",
          })
        } else {
          console.log("Profile created successfully")
        }
      } else {
        console.log("Profile already exists")
      }
    } catch (error: any) {
      console.error("Error in ensureProfileExists:", error)
      toast({
        title: "Error memeriksa profil",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const fetchActivities = async (userId: string) => {
    try {
      console.log("Fetching activities for user:", userId)
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (error) {
        console.error("Error fetching activities:", error)
        throw error
      }

      console.log("Activities fetched:", data?.length || 0)
      setActivities(data || [])
    } catch (error: any) {
      console.error("Error in fetchActivities:", error)
      toast({
        title: "Error mengambil aktivitas",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleActivityAdded = () => {
    console.log("Activity added, refreshing list...")
    if (user) {
      fetchActivities(user.id)
    }
  }

  // Calculate some stats for the dashboard
  const totalDuration = activities.reduce((total, activity) => total + (activity.duration || 0), 0)
  const totalActivities = activities.length
  const latestActivity = activities.length > 0 ? activities[0] : null
  const averageDuration = totalActivities > 0 ? Math.round(totalDuration / totalActivities) : 0

  // Get activity types and count
  const activityTypes = activities.reduce((acc: Record<string, number>, activity) => {
    const type = activity.activity_type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Find most frequent activity type
  let mostFrequentActivity = "Tidak Ada"
  let maxCount = 0
  Object.entries(activityTypes).forEach(([type, count]) => {
    if (count > maxCount) {
      mostFrequentActivity = type
      maxCount = count
    }
  })

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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md p-4">
          <h2 className="text-xl font-bold mb-2">Autentikasi Diperlukan</h2>
          <p className="mb-4">Anda perlu masuk untuk melihat halaman ini.</p>
          <Button onClick={() => (window.location.href = "/login")}>Pergi ke Halaman Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} activities={activities} />
      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="bg-muted px-4 py-2 rounded-lg flex items-center gap-2 mt-2 md:mt-0">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">
              Selamat datang kembali, {user.user_metadata?.full_name || user.email}!
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="overflow-hidden border-t-4 border-t-blue-500 relative">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
                alt="Latar belakang aktivitas"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Aktivitas</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
              <p className="text-xs text-muted-foreground">Aktivitas tercatat</p>
              <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(totalActivities * 5, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-green-500 relative">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1526401485004-46910ecc8e51?q=80&w=1470&auto=format&fit=crop"
                alt="Latar belakang durasi"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Durasi</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDuration} menit</div>
              <p className="text-xs text-muted-foreground">Waktu berolahraga</p>
              <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min(totalDuration / 10, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-purple-500 relative">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=1470&auto=format&fit=crop"
                alt="Latar belakang rata-rata"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Durasi</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageDuration} menit</div>
              <p className="text-xs text-muted-foreground">Per aktivitas</p>
              <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(averageDuration, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-amber-500 relative">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop"
                alt="Latar belakang favorit"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktivitas Favorit</CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mostFrequentActivity}</div>
              <p className="text-xs text-muted-foreground">
                {maxCount > 0 ? `${maxCount} kali` : "Belum ada aktivitas tercatat"}
              </p>
              <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(maxCount * 10, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {totalActivities === 0 && (
          <Card className="mb-8 border-dashed bg-muted/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop"
                alt="Pola latar belakang"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex flex-col items-center justify-center py-8 relative z-10">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Mulai Melacak Aktivitas Anda</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Catat aktivitas pertama Anda untuk mulai melihat kemajuan dan statistik Anda.
              </p>
              <Tabs defaultValue="add" className="w-full max-w-md">
                <TabsList className="grid grid-cols-1 mb-4">
                  <TabsTrigger value="add">Tambahkan Aktivitas Pertama Anda</TabsTrigger>
                </TabsList>
                <TabsContent value="add">
                  <ActivityForm user={user} onActivityAdded={handleActivityAdded} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {totalActivities > 0 && (
          <>
            {/* Add the statistics component */}
            <div className="mb-8">
              <ActivityStatistics activities={activities} />
            </div>

            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="activities" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Aktivitas
                </TabsTrigger>
                <TabsTrigger value="add" className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Tambah Aktivitas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="activities">
                <ActivityList activities={activities} onActivityDeleted={handleActivityAdded} />
              </TabsContent>
              <TabsContent value="add">
                <ActivityForm user={user} onActivityAdded={handleActivityAdded} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
