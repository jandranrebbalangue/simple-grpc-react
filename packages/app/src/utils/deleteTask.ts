export async function deleteTask(id: number) {
  await fetch(`${import.meta.env.API_ENDPOINT as string}/tasks/${id}`, {
    method: "DELETE",
  })
}

