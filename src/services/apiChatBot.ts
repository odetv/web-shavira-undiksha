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
