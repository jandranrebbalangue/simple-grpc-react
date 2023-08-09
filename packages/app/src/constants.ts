export type TodosProps = {
  id: string;
  text: string;
};
export interface DataPayload<T> {
  [key: string]: T;
}
export interface DataResponse<T> {
  data: T;
  isLoading: boolean;
  isError: any;
}
export const fetcher = (endpoint: string) =>
  fetch(`${import.meta.env.VITE_BASE_URL as string}${endpoint}`, {
    method: "GET",
  }).then((res) => res.json());

export async function addTodo(body: TodosProps) {
  await fetch(`${import.meta.env.VITE_BASE_URL as string}/todos`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
