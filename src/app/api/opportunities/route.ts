import { NextRequest, NextResponse } from "next/server";
import { getActiveOpportunities, getOpportunityBySlugOrId } from "@/lib/opportunities-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || searchParams.get("id");

    if (slug) {
      const opp = await getOpportunityBySlugOrId(slug);
      if (!opp) {
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
      }
      return NextResponse.json(opp);
    }

    const opps = await getActiveOpportunities();
    return NextResponse.json(opps);
  } catch (error) {
    console.error("[API/Opportunities] Error fetching opportunities:", error);
    return NextResponse.json([], { status: 500 });
  }
}
