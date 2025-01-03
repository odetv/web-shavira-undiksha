const API_URL = `${process.env.NEXT_PUBLIC_VA_API_URL}`;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_VA_API_KEY}`,
});

const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: headers(),
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
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: headers(),
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
  try {
    const response = await fetch(`${API_URL}/logs`, {
      method: "GET",
      headers: headers(),
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

const getGraphImage = async (): Promise<Blob | null> => {
  try {
    const response = await fetch(`${API_URL}/graph`, {
      method: "GET",
      headers: headers(),
    });

    if (response.ok) {
      return await response.blob();
    } else {
      console.error("Failed to fetch graph image:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching graph image:", error);
    return null;
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
  try {
    const response = await fetch(`${API_URL}/setup`, {
      method: "POST",
      headers: headers(),
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
  try {
    const response = await fetch(`${API_URL}/checkmodel`, {
      method: "GET",
      headers: headers(),
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
  try {
    const response = await fetch(`${API_URL}/datasets/list`, {
      method: "GET",
      headers: headers(),
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
  try {
    const fileUrl = `${API_URL}/datasets/read/${encodeURIComponent(filename)}`;
    return fileUrl;
  } catch (error) {
    console.error("Error generating file URL:", error);
    return null;
  }
};

const deleteDataset = async (filenames: string[]): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/datasets/delete`, {
      method: "DELETE",
      headers: headers(),
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

  try {
    const response = await fetch(`${API_URL}/datasets/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VA_API_KEY}`,
      },
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

  try {
    const response = await fetch(`${API_URL}/datasets/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VA_API_KEY}`,
      },
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
  getGraphImage,
  setupConfig,
  checkConfig,
  getDatasets,
  readDataset,
  deleteDataset,
  uploadDataset,
  updateDataset,
};
