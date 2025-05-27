import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tentang Xcelerate</h1>
                <p className="text-muted-foreground md:text-xl">
                  Xcelerate dirancang untuk membantu para penggemar olahraga melacak aktivitas mereka dan meningkatkan
                  performa mereka. Baik Anda seorang pelari, perenang, pesepeda, atau atlet lainnya, Xcelerate
                  menyediakan alat yang Anda butuhkan untuk memantau kemajuan Anda dan mencapai tujuan kebugaran Anda.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1">
                      Bergabung Sekarang <ArrowRight className="h-4 w-4" />
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tim Kami</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Kami adalah tim yang bersemangat tentang kebugaran dan teknologi
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maruf-jY8nnuSnsMz1N8I6FBORhJKc2H2FKC.jpeg"
                    alt="Foto M. Ma'ruf Sabili Riziq"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">M. Ma'ruf Sabili Riziq</h3>
                  <p className="text-muted-foreground">Backend Developer</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mengembangkan dan memelihara infrastruktur server dan API untuk aplikasi Xcelerate.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop"
                    alt="Foto Abdullah Fatih Azzam"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Abdullah Fatih Azzam</h3>
                  <p className="text-muted-foreground">Frontend Developer</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Membangun antarmuka pengguna yang responsif dan intuitif dengan fokus pada pengalaman pengguna.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop"
                    alt="Foto Denzel Helguera Simanjuntak"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Denzel Helguera Simanjuntak</h3>
                  <p className="text-muted-foreground">Project Manager</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mengkoordinasikan tim dan memastikan proyek berjalan sesuai jadwal dan memenuhi tujuan bisnis.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop"
                    alt="Foto Alif Arlendi Putra Priyanto"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Alif Arlendi Putra Priyanto</h3>
                  <p className="text-muted-foreground">Database Administrator</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mengelola struktur database, optimasi performa, dan keamanan data pengguna.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1374&auto=format&fit=crop"
                    alt="Foto Muhammad Farhan Efendi"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Muhammad Farhan Efendi</h3>
                  <p className="text-muted-foreground">UI/UX Designer</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Merancang antarmuka yang menarik dan pengalaman pengguna yang intuitif untuk aplikasi Xcelerate.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nopan-VulGdCFtXiCLPecjA3DDsje7yaEoAU.jpeg"
                    alt="Foto M. Azyan Naufan Rosada"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">M. Azyan Naufan Rosada</h3>
                  <p className="text-muted-foreground">Frontend Developer</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mengembangkan komponen UI dan fitur interaktif untuk meningkatkan pengalaman pengguna.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
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


