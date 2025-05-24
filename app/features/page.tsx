import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, Calendar, Clock } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Xcelerate</span>
          </div>
        </Link>
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Fitur Xcelerate</h1>
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

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Analisis Mendalam</h3>
                <p className="text-muted-foreground">
                  Dapatkan wawasan mendalam tentang pola latihan dan performa Anda dari waktu ke waktu
                </p>
                <div className="rounded-lg overflow-hidden border shadow-sm h-48 w-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1471&auto=format&fit=crop"
                    alt="Analisis data olahraga"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BarChart2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Berbagi Sosial</h3>
                <p className="text-muted-foreground">
                  Bagikan pencapaian Anda dengan teman dan keluarga untuk mendapatkan dukungan tambahan
                </p>
                <div className="rounded-lg overflow-hidden border shadow-sm h-48 w-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1470&auto=format&fit=crop"
                    alt="Berbagi pencapaian olahraga"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-12">
              <Link href="/signup">
                <Button size="lg" className="gap-1">
                  Mulai Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
