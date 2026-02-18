const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
};

type RequestOptions = {
  headers?: HeadersInit;
  timeout?: number;
};

async function request(
  method: string,
  url: string,
  data?: any,
  options?: RequestOptions
) {
  const controller = new AbortController();
  const timeout = options?.timeout ?? 20000;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", 
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
      throw {
        response: {
          status: res.status,
          data: responseData,
        },
      };
    }

    return {
      data: responseData,
      status: res.status,
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

const api = {
  get: (url: string, options?: RequestOptions) =>
    request("GET", url, undefined, options),

  post: (url: string, data?: any, options?: RequestOptions) =>
    request("POST", url, data, options),

  put: (url: string, data?: any, options?: RequestOptions) =>
    request("PUT", url, data, options),

  patch: (url: string, data?: any, options?: RequestOptions) =>
    request("PATCH", url, data, options),

  delete: (url: string, options?: RequestOptions) =>
    request("DELETE", url, undefined, options),
};

export default api;
