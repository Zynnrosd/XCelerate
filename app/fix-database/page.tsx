import FixDatabase from "@/fix-database"

export default function FixDatabasePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Fix Database Schema</h1>
      <p className="mb-6 text-muted-foreground">
        This page provides a SQL script to fix the "Could not find the 'activity_type' column of 'activities'" error.
        The script will recreate the database tables with the correct schema.
      </p>
      <FixDatabase />
    </div>
  )
}
