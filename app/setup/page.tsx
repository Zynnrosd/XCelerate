import SetupSQL from "@/setup-sql"

export default function SetupPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>
      <p className="mb-6 text-muted-foreground">
        Before using the application, you need to set up the database tables in Supabase. Follow the instructions below
        to create the necessary tables and permissions.
      </p>
      <SetupSQL />
    </div>
  )
}
