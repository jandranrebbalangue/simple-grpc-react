export type TodosProps = {
  id: string
  task: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}
export type AddTask = {
  task: string
  status: string
}
export const fetcher = (endpoint: string) =>
  fetch(`${import.meta.env.VITE_BASE_URL as string}${endpoint}`, {
    method: "GET"
  }).then((res) => res.json())

export async function addTasks(body: AddTask) {
  await fetch(`${import.meta.env.VITE_BASE_URL as string}/tasks`, {
    method: "POST",
    body: JSON.stringify(body)
  })
}
