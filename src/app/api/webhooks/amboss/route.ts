import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "not implemented: Amboss webhook bridge (repository issue #7). Poll bridge mode is used until this route ships.",
    },
    { status: 501 }
  );
}
