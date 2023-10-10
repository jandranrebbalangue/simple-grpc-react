import { create } from "zustand"

type State = {
  task: string
  status: string
  id: number
  open: boolean
}
type Action = {
  addTask: (task: State["task"], status: State["status"]) => void
  updateStatus: (status: State["status"]) => void
  setDeleteId: (id: State["id"]) => void
  setOpen: (open: State["open"]) => void
}
const useTodoStore = create<State & Action>((set) => ({
  task: "",
  status: "Not Completed",
  id: 0,
  open: false,
  addTask: (task, status) => set(() => ({ task, status })),
  updateStatus: (status) => set(() => ({ status })),
  setDeleteId: (id) => set(() => ({ id })),
  setOpen: (open) => set(() => ({ open }))
}))
export default useTodoStore
