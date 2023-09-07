import { AddTaskProps } from "../types"
export async function addTask(body: AddTaskProps) {
  await fetch(`${import.meta.env.API_ENDPOINT as string}/tasks`, {
    method: "POST",
    body: JSON.stringify(body)
  })
}

