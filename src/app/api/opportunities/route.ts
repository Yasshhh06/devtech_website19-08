import { NextResponse } from "next/server";
import { getActiveOpportunities } from "@/lib/opportunities-db";

export async function GET() {
  try {
    const opps = await getActiveOpportunities();
    return NextResponse.json(opps);
  } catch (error) {
    console.error("[API/Opportunities] Error fetching active opportunities:", error);
    return NextResponse.json([], { status: 500 });
  }
}
