import { UpdateStatusProps } from "../types"
export async function updateStatus(id: number, body: UpdateStatusProps) {
  await fetch(`${import.meta.env.API_ENDPOINT as string}/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  })
}

