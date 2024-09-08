export const sendChatBot = async (question: string) => {
  const url = "/api/sendChatBot";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch the chatbot response");
  }

  return data.data[0].answer;
};

export const checkChatBotStatus = async () => {
  const url = process.env.NEXT_PUBLIC_VERCEL_CHATBOT_API_URL || "";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch the chatbot status");
  }

  return data.timestamp;
};
