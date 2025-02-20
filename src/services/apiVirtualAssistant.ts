import { db, doc, onSnapshot } from "@/services/firebase";

let API_URL: string = "";
let API_KEY: string = "";

const generalConfigFirestore = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const docRef = doc(db, "settings", "general");
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const config = docSnap.data();
        API_URL = config?.api_baseurl || "";
        API_KEY = config?.api_key || "";
        resolve();
      } else {
        reject("Config not found in Firestore");
      }
    });
  });
};

const headers = async () => {
  await generalConfigFirestore();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };
};

const apiShaviraStatus = async (): Promise<boolean> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: await headers(),
    });
    if (response.ok) {
      const data = await response.json();
      return data.statusCode === 200;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const setupConfig = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/setup/config`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const data = await response.json();
      return data.statusCode === 200;
    }
  } catch (error) {
    return null;
  }
};

const checkConfig = async (): Promise<any> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/check/config`, {
      method: "GET",
      headers: await headers(),
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    return null;
  }
};

const checkOpenAIModels = async (): Promise<any[]> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/check/openai-models`, {
      method: "GET",
      headers: await headers(),
    });
    if (!response.ok) {
      console.error("Failed to fetch OpenAI models:", response.status);
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
};

const checkOllamaModels = async (): Promise<any[]> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/check/ollama-models`, {
      method: "GET",
      headers: await headers(),
    });
    if (!response.ok) {
      console.error("Failed to fetch Ollama models:", response.status);
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
};

const listDataset = async () => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/datasets/list`, {
      method: "GET",
      headers: await headers(),
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
};

const readDataset = async (filename: string): Promise<string | null> => {
  await generalConfigFirestore();
  try {
    const fileUrl = `${API_URL}/datasets/read/${encodeURIComponent(filename)}`;
    return fileUrl;
  } catch (error) {
    console.error("Error generating file URL:", error);
    return null;
  }
};

const uploadDataset = async (files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/datasets/upload`, {
      method: "POST",
      headers: await headers(),
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error uploading dataset:", error);
    return { success: false, message: "Failed to upload dataset" };
  }
};

const updateDataset = async (target: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("target", target);
  formData.append("file", file);
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/datasets/update`, {
      method: "PUT",
      headers: await headers(),
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating dataset:", error);
    return { success: false, message: "Failed to update dataset" };
  }
};

const deleteDataset = async (filenames: string[]): Promise<any> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/datasets/delete`, {
      method: "DELETE",
      headers: await headers(),
      body: JSON.stringify({ filenames }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting dataset:", error);
    return { success: false, message: "Failed to delete dataset" };
  }
};

const logsActivity = async (): Promise<{
  success: boolean;
  data: any[];
  message?: string;
}> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/logs`, {
      method: "GET",
      headers: await headers(),
    });

    if (!response.ok) {
      console.error(`Error fetching logs: ${response.status}`);
      return {
        success: false,
        data: [],
        message: "Gagal mengambil data log dari server.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      message: "Logs fetched successfully.",
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return {
      success: false,
      data: [],
      message: "Terjadi kesalahan saat mengambil data log.",
    };
  }
};

const chatConversation = async (
  question: string
): Promise<{ success: boolean; data: any[] }> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify({ question }),
    });

    if (response.status === 500) {
      console.error("Error 500: Internal Server Error");
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
      console.error(`API response error: ${response.status}`);
      return {
        success: false,
        data: [],
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat response:", error);
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
};

export {
  apiShaviraStatus,
  setupConfig,
  checkConfig,
  checkOpenAIModels,
  checkOllamaModels,
  listDataset,
  readDataset,
  uploadDataset,
  updateDataset,
  deleteDataset,
  logsActivity,
  chatConversation,
};
