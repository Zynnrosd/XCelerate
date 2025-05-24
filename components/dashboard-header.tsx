"use client"
import { useRouter } from "next/navigation"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trophy, LogOut, User, Bell, Settings, AlertCircle, Calendar, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  user: any
  activities?: any[]
}

interface Notification {
  id: string
  type: "warning" | "info" | "success"
  title: string
  message: string
  date: Date
  read: boolean
}

export default function DashboardHeader({ user, activities = [] }: DashboardHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user?.id) return

    // Load read notification IDs from localStorage
    const storedReadIds = localStorage.getItem(`readNotifications_${user.id}`)
    if (storedReadIds) {
      try {
        const parsedIds = JSON.parse(storedReadIds)
        setReadNotificationIds(new Set(parsedIds))
      } catch (e) {
        console.error("Error parsing read notifications:", e)
      }
    }

    // Generate notifications based on activity progress
    generateProgressNotifications()

    // Set up a timer to check for new notifications every hour
    const interval = setInterval(
      () => {
        generateProgressNotifications()
      },
      60 * 60 * 1000,
    ) // Every hour

    return () => clearInterval(interval)
  }, [user?.id, activities])

  const generateProgressNotifications = () => {
    if (!activities || !user?.id) return

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Analisis aktivitas hari ini
    const todayActivities =
      activities?.filter((activity) => {
        const activityDate = new Date(activity.date)
        return activityDate.toDateString() === today.toDateString()
      }) || []

    // Analisis aktivitas minggu ini
    const thisWeekActivities =
      activities?.filter((activity) => {
        const activityDate = new Date(activity.date)
        return activityDate >= oneWeekAgo && activityDate <= today
      }) || []

    // Analisis aktivitas minggu lalu
    const lastWeekActivities =
      activities?.filter((activity) => {
        const activityDate = new Date(activity.date)
        return activityDate >= twoWeeksAgo && activityDate < oneWeekAgo
      }) || []

    // Analisis aktivitas 3 hari terakhir
    const threeDaysAgo = new Date(today)
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const recentActivities =
      activities?.filter((activity) => {
        const activityDate = new Date(activity.date)
        return activityDate >= threeDaysAgo && activityDate <= today
      }) || []

    const newNotifications: Notification[] = []

    // Notifikasi untuk aktivitas hari ini
    const todayStr = today.toISOString().split("T")[0]
    const todayNotificationId = `daily-${todayStr}`

    if (todayActivities.length === 0) {
      newNotifications.push({
        id: todayNotificationId,
        type: "warning",
        title: "Belum ada aktivitas hari ini",
        message: "Anda belum mencatat aktivitas olahraga hari ini. Jangan lupa untuk tetap aktif!",
        date: today,
        read: readNotificationIds.has(todayNotificationId),
      })
    } else {
      const todayDuration = todayActivities.reduce((total, activity) => total + (activity.duration || 0), 0)
      newNotifications.push({
        id: todayNotificationId,
        type: "success",
        title: "Aktivitas hari ini tercatat!",
        message: `Bagus! Anda sudah berolahraga ${todayDuration} menit hari ini dengan ${todayActivities.length} aktivitas.`,
        date: today,
        read: readNotificationIds.has(todayNotificationId),
      })
    }

    // Notifikasi progres mingguan
    const weeklyNotificationId = `weekly-${todayStr}`
    const targetWeeklyActivities = 5
    const weeklyProgress = Math.round((thisWeekActivities.length / targetWeeklyActivities) * 100)

    if (thisWeekActivities.length < targetWeeklyActivities) {
      newNotifications.push({
        id: weeklyNotificationId,
        type: "info",
        title: "Progres Mingguan",
        message: `Anda telah berolahraga ${thisWeekActivities.length} dari target ${targetWeeklyActivities} kali minggu ini (${weeklyProgress}%). Tetap semangat!`,
        date: today,
        read: readNotificationIds.has(weeklyNotificationId),
      })
    } else {
      newNotifications.push({
        id: weeklyNotificationId,
        type: "success",
        title: "Target Mingguan Tercapai!",
        message: `Luar biasa! Anda telah mencapai target ${targetWeeklyActivities} aktivitas minggu ini. Pertahankan konsistensi!`,
        date: today,
        read: readNotificationIds.has(weeklyNotificationId),
      })
    }

    // Notifikasi tren aktivitas
    const trendNotificationId = `trend-${todayStr}`
    if (lastWeekActivities.length > 0) {
      const trendPercentage = Math.round(
        ((thisWeekActivities.length - lastWeekActivities.length) / lastWeekActivities.length) * 100,
      )

      if (trendPercentage < -20) {
        newNotifications.push({
          id: trendNotificationId,
          type: "warning",
          title: "Aktivitas Menurun",
          message: `Aktivitas Anda turun ${Math.abs(trendPercentage)}% dibanding minggu lalu. Mari kembali ke rutinitas olahraga!`,
          date: today,
          read: readNotificationIds.has(trendNotificationId),
        })
      } else if (trendPercentage > 20) {
        newNotifications.push({
          id: trendNotificationId,
          type: "success",
          title: "Peningkatan Aktivitas!",
          message: `Hebat! Aktivitas Anda meningkat ${trendPercentage}% dibanding minggu lalu. Pertahankan momentum ini!`,
          date: today,
          read: readNotificationIds.has(trendNotificationId),
        })
      }
    }

    // Notifikasi streak/konsistensi
    const streakNotificationId = `streak-${todayStr}`
    if (recentActivities.length === 0 && activities && activities.length > 0) {
      newNotifications.push({
        id: streakNotificationId,
        type: "warning",
        title: "Jangan Putus Konsistensi",
        message: "Anda tidak berolahraga selama 3 hari terakhir. Mulai lagi dengan aktivitas ringan hari ini!",
        date: today,
        read: readNotificationIds.has(streakNotificationId),
      })
    }

    // Notifikasi motivasi berdasarkan total aktivitas
    const motivationNotificationId = `motivation-${todayStr}`
    const totalActivities = activities?.length || 0

    if (totalActivities >= 50) {
      newNotifications.push({
        id: motivationNotificationId,
        type: "success",
        title: "Pencapaian Luar Biasa!",
        message: `Anda telah mencatat ${totalActivities} aktivitas! Anda adalah atlet sejati yang konsisten.`,
        date: today,
        read: readNotificationIds.has(motivationNotificationId),
      })
    } else if (totalActivities >= 20) {
      newNotifications.push({
        id: motivationNotificationId,
        type: "info",
        title: "Progres yang Bagus!",
        message: `${totalActivities} aktivitas tercatat! Anda sedang membangun kebiasaan olahraga yang baik.`,
        date: today,
        read: readNotificationIds.has(motivationNotificationId),
      })
    } else if (totalActivities >= 5) {
      newNotifications.push({
        id: motivationNotificationId,
        type: "info",
        title: "Awal yang Baik!",
        message: `${totalActivities} aktivitas sudah tercatat. Terus tingkatkan untuk mencapai gaya hidup sehat!`,
        date: today,
        read: readNotificationIds.has(motivationNotificationId),
      })
    }

    setNotifications(newNotifications)
    updateUnreadCount(newNotifications)
  }

  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter((n) => !n.read).length
    setUnreadCount(count)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))

    setNotifications(updatedNotifications)
    setUnreadCount(0)

    // Update read notification IDs in state and localStorage
    const newReadIds = new Set(readNotificationIds)
    updatedNotifications.forEach((n) => newReadIds.add(n.id))
    setReadNotificationIds(newReadIds)
    if (user?.id) {
      localStorage.setItem(`readNotifications_${user.id}`, JSON.stringify([...newReadIds]))
    }
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )

    setNotifications(updatedNotifications)
    updateUnreadCount(updatedNotifications)

    // Update read notification IDs in state and localStorage
    const newReadIds = new Set(readNotificationIds)
    newReadIds.add(id)
    setReadNotificationIds(newReadIds)
    if (user?.id) {
      localStorage.setItem(`readNotifications_${user.id}`, JSON.stringify([...newReadIds]))
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Hari ini"
    } else if (diffDays === 1) {
      return "Kemarin"
    } else if (diffDays < 7) {
      return `${diffDays} hari yang lalu`
    } else {
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Berhasil keluar",
        description: "Anda telah berhasil keluar.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-10 px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <button onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground/50 rounded-full blur opacity-30"></div>
          <div className="relative bg-background rounded-full p-1">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
        </div>
        <span className="text-xl font-bold">Xcelerate</span>
      </button>
      <div className="flex items-center gap-4">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>}
              <span className="sr-only">Notifikasi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifikasi</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                  Tandai semua telah dibaca
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 px-2 text-center text-muted-foreground">
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-default ${notification.read ? "opacity-70" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    {notification.type === "info" && (
                      <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === "warning" && (
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.date)}</p>
                    </div>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>}
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer justify-center">
              Lihat semua aktivitas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url || "/placeholder.svg"}
                  alt="Avatar pengguna"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {userInitials}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "Pengguna"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
