export const fetcher = (endpoint: string) =>
  fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
    method: "GET",
  }).then((res) => res.json());
