import { NextResponse } from "next/server";

export async function GET() {
  const authConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_replace_me" &&
      process.env.CLERK_SECRET_KEY !== "sk_test_replace_me",
  );

  const databaseConfigured = Boolean(
    process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("postgres:postgres@localhost:5432"),
  );

  return NextResponse.json({
    app: "coffee-ops-hub",
    status: "ok",
    mobileReady: true,
    authConfigured,
    databaseConfigured,
    timestamp: new Date().toISOString(),
  });
}
