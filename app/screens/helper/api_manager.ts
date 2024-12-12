const baseUrl = "http://192.168.1.13:8088/api/v1";

export const apiPost = async <T>(url: string, body: object): Promise<T> => {
  try {
    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data from server.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Network request failed.");
  }
};
