import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, Calendar, Clock, Trophy, Activity, Heart, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Xcelerate</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">
            Fitur
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            Tentang Kami
          </Link>
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Masuk
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Lacak Perjalanan Kebugaran Anda dengan Xcelerate
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Catat, analisis, dan tingkatkan aktivitas olahraga Anda dengan platform pelacakan yang mudah
                    digunakan.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1">
                      Mulai Sekarang <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-[400px] rounded-full bg-muted p-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse [animation-duration:5s]"></div>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
                    alt="Pelari dengan smartwatch"
                    fill
                    className="object-cover rounded-full opacity-60"
                  />
                  <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-4 animate-bounce [animation-duration:3s] z-10">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-black">Lari: 5,2km</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-10 bg-white rounded-lg shadow-lg p-4 animate-bounce [animation-duration:4s] [animation-delay:1s] z-10">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-black">Detak Jantung: 142 bpm</span>
                    </div>
                  </div>
                  <div className="absolute top-32 right-1 bg-white rounded-lg shadow-lg p-4 animate-bounce [animation-duration:3.5s] [animation-delay:0.5s] z-10">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-black">Kalori: 320</span>
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-md">
                      <Trophy className="h-16 w-16 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-white drop-shadow-md">Lacak Kemajuan Anda</h2>
                    <p className="text-sm text-white max-w-[250px] drop-shadow-md">
                      Lihat peningkatan Anda dari waktu ke waktu dengan analitik detail
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Fitur Unggulan</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Semua yang Anda butuhkan untuk melacak dan meningkatkan aktivitas olahraga Anda
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Pencatatan Aktivitas</h3>
                <p className="text-muted-foreground">
                  Catat latihan, aktivitas olahraga, dan latihan Anda dengan informasi detail
                </p>
                <div className="rounded-lg overflow-hidden border shadow-sm h-48 w-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1287&auto=format&fit=crop"
                    alt="Orang mencatat aktivitas di smartphone"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BarChart2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Pelacakan Kemajuan</h3>
                <p className="text-muted-foreground">
                  Visualisasikan kemajuan Anda dengan grafik dan statistik untuk tetap termotivasi
                </p>
                <div className="rounded-lg overflow-hidden border shadow-sm h-48 w-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop"
                    alt="Grafik kemajuan kebugaran"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Penetapan Tujuan</h3>
                <p className="text-muted-foreground">
                  Tetapkan dan lacak tujuan kebugaran Anda untuk mendorong diri Anda lebih jauh
                </p>
                <div className="rounded-lg overflow-hidden border shadow-sm h-48 w-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1535743686920-55e4145369b9?q=80&w=1332&auto=format&fit=crop"
                    alt="Orang menetapkan tujuan kebugaran"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Lihat Semua Fitur <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tentang Xcelerate</h2>
                <p className="text-muted-foreground md:text-xl">
                  Xcelerate dirancang untuk membantu para penggemar olahraga melacak aktivitas mereka dan meningkatkan
                  performa mereka. Baik Anda seorang pelari, perenang, pesepeda, atau atlet lainnya, Xcelerate
                  menyediakan alat yang Anda butuhkan untuk memantau kemajuan Anda dan mencapai tujuan kebugaran Anda.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 z-10 rounded-lg"></div>
                <Image
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"
                  alt="Atlet berlatih"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-20">
                  <p className="text-white font-medium">
                    Bergabunglah dengan ribuan atlet yang melacak kemajuan mereka
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop"
              alt="Pola latar belakang"
              fill
              className="object-cover"
            />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Siap Untuk Memulai?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Bergabunglah dengan Xcelerate hari ini dan tingkatkan perjalanan kebugaran Anda ke level berikutnya.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1">
                    Daftar Sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Masuk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 Xcelerate. Seluruh hak cipta dilindungi.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Ketentuan Layanan
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privasi
          </Link>
        </nav>
      </footer>
    </div>
  )
}
