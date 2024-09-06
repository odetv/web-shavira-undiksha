export const sendQuestion = async (question: string) => {
  const apiKey = process.env.NEXT_PUBLIC_VERCEL_CHATBOT_API_KEY;
  const url = "/api/chat"; // Ubah URL menjadi path lokal

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CHATBOT-API-KEY": apiKey || "",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the chatbot response");
  }

  const data = await response.json();
  return data.answer;
};
