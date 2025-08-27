/**
 * API configuration helper for managing API URLs in different environments
 */

/**
 * Get the base API URL based on the environment
 * In production, this should point to your deployed API
 * In development, it uses the local API server
 */
export function getApiUrl(): string {
  // For client-side requests
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }

  // For server-side requests (SSR/SSG)
  // You might want to use an internal URL here if your API and web app
  // are in the same network (e.g., same VPC)
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  );
}

/**
 * Helper function to construct API endpoints
 * @param endpoint - The API endpoint path (e.g., '/users', '/tasks')
 * @returns The full API URL
 */
export function apiEndpoint(endpoint: string): string {
  const baseUrl = getApiUrl();
  // Ensure the endpoint starts with a slash
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // Remove /api prefix if it exists since our API already handles it
  const cleanPath = path.startsWith("/api/") ? path.slice(4) : path;
  return `${baseUrl}/api${cleanPath}`;
}

/**
 * Fetch wrapper with default headers and error handling
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = apiEndpoint(endpoint);

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...options?.headers
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response;
}

/**
 * Typed fetch wrapper for JSON responses
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(endpoint, options);
  return response.json();
}
