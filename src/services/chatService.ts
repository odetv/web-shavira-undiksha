export const fetchChatResponse = async (question: string): Promise<any> => {
  const API_URL = "/api/chat"; // Gunakan proxy endpoint lokal

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_VA_API_KEY}`,
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch response from API. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return null; // Pastikan mengembalikan null saat terjadi error
  }
};
