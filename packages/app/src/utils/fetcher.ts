export const fetcher = (endpoint: string) =>
  fetch(`${import.meta.env.API_ENDPOINT as string}${endpoint}`, {
    method: "GET"
  }).then((res) => res.json())

