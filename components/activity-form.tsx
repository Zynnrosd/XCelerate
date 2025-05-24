"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, FileText, Activity, CheckCircle } from "lucide-react"

interface ActivityFormProps {
  user: any
  onActivityAdded: () => void
}

export default function ActivityForm({ user, onActivityAdded }: ActivityFormProps) {
  const [activityType, setActivityType] = useState("")
  const [duration, setDuration] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      console.log("Submitting activity:", {
        user_id: user.id,
        activity_type: activityType,
        duration: Number.parseInt(duration),
        date,
        notes,
      })

      const { data, error } = await supabase
        .from("activities")
        .insert([
          {
            user_id: user.id,
            activity_type: activityType,
            duration: Number.parseInt(duration),
            date,
            notes,
          },
        ])
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Activity saved successfully:", data)

      toast({
        title: "Aktivitas ditambahkan",
        description: "Aktivitas Anda telah berhasil dicatat.",
      })

      setSuccess(true)

      // Reset form after a short delay to show success state
      setTimeout(() => {
        setActivityType("")
        setDuration("")
        setDate(new Date().toISOString().split("T")[0])
        setNotes("")
        setSuccess(false)

        // Notify parent component
        onActivityAdded()
      }, 2000)
    } catch (error: any) {
      console.error("Error adding activity:", error)
      toast({
        title: "Error menambahkan aktivitas",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <Card className="border-t-4 border-t-primary relative overflow-hidden">
      {activityType && (
        <div className="absolute inset-0 opacity-5">
          <Image
            src={activityImages[activityType] || activityImages["Lainnya"]}
            alt={`Latar belakang ${activityType}`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Tambah Aktivitas Baru</CardTitle>
        </div>
        <CardDescription>Catat aktivitas olahraga atau kebugaran terbaru Anda</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 relative z-10">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Aktivitas berhasil disimpan!</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="activity-type" className="flex items-center gap-1">
              <Activity className="h-4 w-4" /> Jenis Aktivitas
            </Label>
            <Select value={activityType} onValueChange={setActivityType} required>
              <SelectTrigger id="activity-type" className={activityType ? "border-primary" : ""}>
                <SelectValue placeholder="Pilih jenis aktivitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lari" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">{activityIcons["Lari"]} Lari</div>
                </SelectItem>
                <SelectItem value="Bersepeda">
                  <div className="flex items-center gap-2">{activityIcons["Bersepeda"]} Bersepeda</div>
                </SelectItem>
                <SelectItem value="Berenang">
                  <div className="flex items-center gap-2">{activityIcons["Berenang"]} Berenang</div>
                </SelectItem>
                <SelectItem value="Jalan Kaki">
                  <div className="flex items-center gap-2">{activityIcons["Jalan Kaki"]} Jalan Kaki</div>
                </SelectItem>
                <SelectItem value="Gym">
                  <div className="flex items-center gap-2">{activityIcons["Gym"]} Gym</div>
                </SelectItem>
                <SelectItem value="Yoga">
                  <div className="flex items-center gap-2">{activityIcons["Yoga"]} Yoga</div>
                </SelectItem>
                <SelectItem value="Basket">
                  <div className="flex items-center gap-2">{activityIcons["Basket"]} Basket</div>
                </SelectItem>
                <SelectItem value="Sepak Bola">
                  <div className="flex items-center gap-2">{activityIcons["Sepak Bola"]} Sepak Bola</div>
                </SelectItem>
                <SelectItem value="Tenis">
                  <div className="flex items-center gap-2">{activityIcons["Tenis"]} Tenis</div>
                </SelectItem>
                <SelectItem value="Lainnya">
                  <div className="flex items-center gap-2">{activityIcons["Lainnya"]} Lainnya</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Durasi (menit)
            </Label>
            <div className="relative">
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="1"
                className="pl-10"
                required
              />
              <Clock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Tanggal
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
              />
              <Calendar className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Catatan
            </Label>
            <div className="relative">
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan tambahan tentang aktivitas Anda"
                rows={3}
                className="pl-10 pt-2"
              />
              <FileText className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative z-10">
          <Button type="submit" disabled={loading || success} className="w-full">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
                <span>Menyimpan...</span>
              </div>
            ) : success ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Tersimpan!</span>
              </div>
            ) : (
              "Simpan Aktivitas"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
