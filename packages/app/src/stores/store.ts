import { create } from "zustand"

type State = {
  task: string
  status: string
  id?: number
}
type Action = {
  addTask: (task: State["task"], status: State["status"]) => void
  updateStatus: (status: State["status"]) => void
  deleteId: (id: State["id"]) => void
}
const useTodoStore = create<State & Action>((set) => ({
  task: "",
  status: "Not Completed",
  addTask: (task, status) => set(() => ({ task, status })),
  updateStatus: (status) => set(() => ({ status })),
  deleteId: (id) => set(() => ({ id }))
}))
export default useTodoStore
