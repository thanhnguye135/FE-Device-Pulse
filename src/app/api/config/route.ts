import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      environments: {
        development: {
          apiUrl:
            process.env.BE_NOTICA_DEV || "https://api-notica.dev.apero.vn",
        },
        production: {
          apiUrl: process.env.BE_NOTICA_PROD || "https://api-notica.apero.vn",
        },
      },
      defaultEnvironment:
        process.env.NODE_ENV === "production" ? "production" : "development",
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting config:", error);
    return NextResponse.json(
      { error: "Failed to get configuration" },
      { status: 500 }
    );
  }
}
