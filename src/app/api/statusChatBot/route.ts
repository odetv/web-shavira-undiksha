import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_CHATBOT_API_URL || "";

  if (!apiUrl) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: "Server misconfiguration: API URL is missing",
        data: null,
      },
      { status: 500 }
    );
  }

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          statusCode: apiResponse.status,
          success: false,
          message: data.message || "Failed to fetch chatbot status",
          data: null,
        },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: "OK",
        timestamp: data.timestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: `Error: ${error.message}`,
        data: null,
      },
      { status: 500 }
    );
  }
}
