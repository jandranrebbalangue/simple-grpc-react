export type TodosProps = {
  id: string;
  text: string;
};
export const fetcher = (endpoint: string) =>
  fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
    method: "GET",
  }).then((res) => res.json());

export async function addTodo(body: TodosProps) {
  await fetch(`${import.meta.env.VITE_BASE_URL}/todos`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
