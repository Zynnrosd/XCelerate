"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function SetupDatabase() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const setupDatabase = async () => {
    setLoading(true)
    try {
      // Create profiles table
      const { error: profilesError } = await supabase.rpc("create_profiles_table")

      if (profilesError) {
        throw profilesError
      }

      // Create activities table
      const { error: activitiesError } = await supabase.rpc("create_activities_table")

      if (activitiesError) {
        throw activitiesError
      }

      toast({
        title: "Database setup complete",
        description: "The database tables have been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error setting up database",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Database</CardTitle>
        <CardDescription>Create the necessary tables in your Supabase database</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">This will create the following tables:</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
          <li>profiles - Stores user profile information</li>
          <li>activities - Stores user activity records</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          You need to run the following SQL in your Supabase SQL Editor first:
        </p>
        <pre className="bg-muted p-4 rounded-md text-xs mt-2 overflow-auto">
          {`-- Create function to create profiles table
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
END;
$$ LANGUAGE plpgsql;

-- Create function to create activities table
CREATE OR REPLACE FUNCTION create_activities_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Users can view their own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own activities"
    ON activities FOR UPDATE
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own activities"
    ON activities FOR DELETE
    USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;`}
        </pre>
      </CardContent>
      <CardFooter>
        <Button onClick={setupDatabase} disabled={loading}>
          {loading ? "Setting up..." : "Setup Database"}
        </Button>
      </CardFooter>
    </Card>
  )
}
