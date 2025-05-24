"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Activity, Calendar, Clock, FileText, Search, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityType {
  id: string
  activity_type: string
  duration: number
  date: string
  notes: string
}

interface ActivityListProps {
  activities: ActivityType[]
  onActivityDeleted: () => void
}

export default function ActivityList({ activities, onActivityDeleted }: ActivityListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("")
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const { error } = await supabase.from("activities").delete().eq("id", deleteId)

      if (error) {
        throw error
      }

      toast({
        title: "Aktivitas dihapus",
        description: "Aktivitas telah berhasil dihapus.",
      })

      onActivityDeleted()
    } catch (error: any) {
      toast({
        title: "Error menghapus aktivitas",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Filter and search activities
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      searchTerm === "" ||
      activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || filterType === "" || activity.activity_type === filterType

    return matchesSearch && matchesFilter
  })

  // Get unique activity types for filter
  const activityTypes = Array.from(new Set(activities.map((a) => a.activity_type))).sort()

  const activityIcons: Record<string, React.ReactNode> = {
    Lari: <Activity className="h-5 w-5 text-green-500" />,
    Bersepeda: <Activity className="h-5 w-5 text-blue-500" />,
    Berenang: <Activity className="h-5 w-5 text-cyan-500" />,
    "Jalan Kaki": <Activity className="h-5 w-5 text-yellow-500" />,
    Gym: <Activity className="h-5 w-5 text-red-500" />,
    Yoga: <Activity className="h-5 w-5 text-purple-500" />,
    Basket: <Activity className="h-5 w-5 text-orange-500" />,
    "Sepak Bola": <Activity className="h-5 w-5 text-emerald-500" />,
    Tenis: <Activity className="h-5 w-5 text-pink-500" />,
    Lainnya: <Activity className="h-5 w-5 text-gray-500" />,
    // Fallback for English activity types that might be in the database
    Running: <Activity className="h-5 w-5 text-green-500" />,
    Cycling: <Activity className="h-5 w-5 text-blue-500" />,
    Swimming: <Activity className="h-5 w-5 text-cyan-500" />,
    Walking: <Activity className="h-5 w-5 text-yellow-500" />,
    Basketball: <Activity className="h-5 w-5 text-orange-500" />,
    Football: <Activity className="h-5 w-5 text-emerald-500" />,
    Tennis: <Activity className="h-5 w-5 text-pink-500" />,
    Other: <Activity className="h-5 w-5 text-gray-500" />,
  }

  // Activity type images
  const activityImages: Record<string, string> = {
    Lari: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1470&auto=format&fit=crop",
    Bersepeda: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1470&auto=format&fit=crop",
    Berenang: "https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=1469&auto=format&fit=crop",
    "Jalan Kaki": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1470&auto=format&fit=crop",
    Gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    Yoga: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1470&auto=format&fit=crop",
    Basket: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop",
    "Sepak Bola": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1471&auto=format&fit=crop",
    Tenis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1470&auto=format&fit=crop",
    Lainnya: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop",
  }

  const getActivityIcon = (type: string) => {
    return activityIcons[type] || <Activity className="h-5 w-5 text-gray-500" />
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop"
            alt="Latar belakang aktivitas"
            fill
            className="object-cover"
          />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Aktivitas Anda
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Cari aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px] pl-8"
              />
              <Search className="h-4 w-4 text-muted-foreground absolute left-2.5 top-2.5" />
            </div>
            <div className="relative">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter berdasarkan jenis" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {getActivityIcon(type)} {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Tidak ada aktivitas ditemukan</p>
              <p className="text-sm text-muted-foreground">
                {activities.length === 0
                  ? "Tambahkan aktivitas pertama Anda untuk memulai!"
                  : "Coba sesuaikan kriteria pencarian atau filter Anda"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aktivitas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Durasi (menit)</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id} className="group hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.activity_type)}
                          {activity.activity_type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(activity.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {activity.duration}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {activity.notes ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {activity.notes}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(activity.id)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus catatan aktivitas secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
