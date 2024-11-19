const API_URL = "/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_VA_API_KEY}`,
});

const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: headers(),
    });
    if (response.ok) {
      const data = await response.json();
      return data.message === "API Virtual Assistant Undiksha";
    }
    return false;
  } catch (error) {
    console.error("Error checking API status:", error);
    return false;
  }
};

const chatResponse = async (
  question: string
): Promise<{ success: boolean; data: any[] }> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ question }),
    });

    if (response.status === 500) {
      // console.error("Error 500: Internal Server Error");
      return {
        success: true,
        data: [
          {
            timestamp: new Date().toISOString(),
            question,
            answer:
              "Maaf, terjadi kesalahan pada server. Silakan coba lagi nanti.",
          },
        ],
      };
    }

    if (!response.ok) {
      // console.error(`API response error: ${response.status}`);
      return {
        success: false,
        data: [],
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching chat response:", error);
    return {
      success: false,
      data: [
        {
          timestamp: new Date().toISOString(),
          question,
          answer: "Maaf, koneksi gagal. Silakan coba lagi nanti.",
        },
      ],
    };
  }
};

export { checkApiStatus, chatResponse };
