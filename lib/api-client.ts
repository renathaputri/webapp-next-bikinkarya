export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: text || "An error occurred parsing response" };
  }

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

export async function fetchApiUpload(endpoint: string, formData: FormData) {
  const response = await fetch(`/api${endpoint}`, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: text || "Upload failed and returned invalid JSON" };
  }

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
}
