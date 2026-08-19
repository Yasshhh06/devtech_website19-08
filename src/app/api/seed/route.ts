import { NextResponse } from "next/server";
import { seedFirebaseCollections } from "@/lib/seed-firebase";

export async function GET() {
  const res = await seedFirebaseCollections();
  return NextResponse.json(res);
}

export async function POST() {
  const res = await seedFirebaseCollections();
  return NextResponse.json(res);
}
