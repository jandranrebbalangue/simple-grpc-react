export type TodosProps = {
  id: number
  task: string
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}
export type AddTaskProps = {
  task: string
  status: string
}

export type UpdateStatusProps = {
  status: string
}
export const fetcher = (endpoint: string) =>
  fetch(`${import.meta.env.API_ENDPOINT as string}${endpoint}`, {
    method: "GET"
  }).then((res) => res.json())

export async function addTask(body: AddTaskProps) {
  await fetch(`${import.meta.env.API_ENDPOINT as string}/tasks`, {
    method: "POST",
    body: JSON.stringify(body)
  })
}

export async function deleteTask(id: number) {
  await fetch(`${import.meta.env.API_ENDPOINT as string}/tasks/${id}`, {
    method: "DELETE",
  })
}

export async function updateStatus(id: number, body: UpdateStatusProps) {
  await fetch(`${import.meta.env.API_ENDPOINT as string}/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  })
}
