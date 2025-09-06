import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      environments: {
        local: {
          apiUrl: process.env.NEXT_PUBLIC_LOCAL_BE_NOTICA_URL || "",
          tokenUrl: process.env.NEXT_PUBLIC_LOCAL_TOKEN_URL || "",
        },
        development: {
          apiUrl: process.env.NEXT_PUBLIC_DEV_BE_NOTICA_URL || "",
          tokenUrl: process.env.NEXT_PUBLIC_DEV_TOKEN_URL || "",
        },
        production: {
          apiUrl: process.env.NEXT_PUBLIC_PROD_BE_NOTICA_URL || "",
          tokenUrl: process.env.NEXT_PUBLIC_PROD_TOKEN_URL || "",
        },
      },
      // Default to local instead of using NODE_ENV
      // This allows users to change environment dynamically
      defaultEnvironment: process.env.DEFAULT_ENVIRONMENT || "local",
    };

    // Validate that required environment variables are set
    const missingEnvVars: string[] = [];
    Object.entries(config.environments).forEach(([envName, envConfig]) => {
      if (!envConfig.apiUrl) {
        missingEnvVars.push(
          `NEXT_PUBLIC_${envName.toUpperCase()}_BE_NOTICA_URL`
        );
      }
      if (!envConfig.tokenUrl) {
        missingEnvVars.push(`NEXT_PUBLIC_${envName.toUpperCase()}_TOKEN_URL`);
      }
    });

    if (missingEnvVars.length > 0) {
      console.warn("Missing environment variables:", missingEnvVars.join(", "));
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting config:", error);
    return NextResponse.json(
      { error: "Failed to get configuration" },
      { status: 500 }
    );
  }
}
