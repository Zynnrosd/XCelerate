"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  type TooltipProps,
} from "recharts"
import { BarChart2, PieChartIcon, LineChartIcon } from "lucide-react"

interface Activity {
  id: string
  activity_type: string
  duration: number
  date: string
  notes?: string
}

interface ActivityStatisticsProps {
  activities: Activity[]
}

export default function ActivityStatistics({ activities }: ActivityStatisticsProps) {
  const [activityTypeData, setActivityTypeData] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  useEffect(() => {
    if (activities.length > 0) {
      // Process data for activity type chart
      const activityTypes: Record<string, number> = {}
      activities.forEach((activity) => {
        if (activityTypes[activity.activity_type]) {
          activityTypes[activity.activity_type] += activity.duration
        } else {
          activityTypes[activity.activity_type] = activity.duration
        }
      })

      const activityTypeChartData = Object.keys(activityTypes).map((type) => ({
        name: type,
        value: activityTypes[type],
      }))
      setActivityTypeData(activityTypeChartData)

      // Process data for weekly chart
      const last7Days = [...Array(7)]
        .map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          return date.toISOString().split("T")[0]
        })
        .reverse()

      const weeklyChartData = last7Days.map((date) => {
        const dayActivities = activities.filter((a) => a.date === date)
        const totalDuration = dayActivities.reduce((sum, a) => sum + a.duration, 0)
        return {
          date: new Date(date).toLocaleDateString("id-ID", { weekday: "short" }),
          duration: totalDuration,
        }
      })
      setWeeklyData(weeklyChartData)

      // Process data for monthly chart
      const last6Months = [...Array(6)]
        .map((_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          return date.toISOString().slice(0, 7) // YYYY-MM format
        })
        .reverse()

      const monthlyChartData = last6Months.map((month) => {
        const monthActivities = activities.filter((a) => a.date.startsWith(month))
        const totalDuration = monthActivities.reduce((sum, a) => sum + a.duration, 0)
        return {
          month: new Date(month + "-01").toLocaleDateString("id-ID", { month: "short" }),
          duration: totalDuration,
        }
      })
      setMonthlyData(monthlyChartData)
    }
  }, [activities])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`Durasi: ${payload[0].value} menit`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Statistik Aktivitas
            </CardTitle>
            <CardDescription>Visualisasikan pola latihan dan kemajuan Anda</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="weekly" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Mingguan
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-1">
              <LineChartIcon className="h-4 w-4" />
              Bulanan
            </TabsTrigger>
            <TabsTrigger value="by-type" className="flex items-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              Berdasarkan Jenis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="h-[300px] w-full">
              {weeklyData.length > 0 && weeklyData.some((d) => d.duration > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: "Durasi (menit)", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="duration" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada data tersedia untuk minggu terakhir</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="h-[300px] w-full">
              {monthlyData.length > 0 && monthlyData.some((d) => d.duration > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: "Durasi (menit)", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="duration" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <LineChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada data tersedia untuk 6 bulan terakhir</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="by-type">
            <div className="h-[300px] w-full">
              {activityTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {activityTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} menit`, "Durasi"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada data aktivitas tersedia</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
