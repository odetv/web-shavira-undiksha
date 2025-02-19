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

const checkApiStatus = async (): Promise<boolean> => {
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
    console.error("Error checking API status:", error);
    return false;
  }
};

const chatResponse = async (
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

const getLogsActivity = async (): Promise<{
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

const setupConfig = async (configData: {
  llm: string;
  model_llm: string;
  embedder: string;
  model_embedder: string;
  chunk_size: number;
  chunk_overlap: number;
}): Promise<boolean> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/setup-config`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify(configData),
    });

    if (response.ok) {
      const data = await response.json();
      return data.success;
    } else {
      console.error("Failed to update config:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error updating config:", error);
    return false;
  }
};

const checkConfig = async (): Promise<any> => {
  await generalConfigFirestore();
  try {
    const response = await fetch(`${API_URL}/check-config`, {
      method: "GET",
      headers: await headers(),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    } else {
      console.error("Failed to fetch last config:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching last config:", error);
    return null;
  }
};

const getDatasets = async () => {
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

export {
  checkApiStatus,
  chatResponse,
  getLogsActivity,
  setupConfig,
  checkConfig,
  getDatasets,
  readDataset,
  deleteDataset,
  uploadDataset,
  updateDataset,
};
