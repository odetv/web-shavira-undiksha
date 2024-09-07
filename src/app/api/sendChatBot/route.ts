import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_CHATBOT_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_VERCEL_CHATBOT_API_KEY;

  if (!apiKey || !apiUrl) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: "Server misconfiguration: API key or API URL is missing",
        data: null,
      },
      { status: 500 }
    );
  }

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CHATBOT-API-KEY": apiKey,
      },
      body: JSON.stringify({ question }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          statusCode: apiResponse.status,
          success: false,
          message: data.message || "Failed to fetch chatbot response",
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
        data: data.data,
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
