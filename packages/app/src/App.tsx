import { mutate } from "swr"
import { deleteTask } from "./utils/deleteTask"
import FormDialog from "./components/FormDialog"
import ConfirmationDialog from "./components/ConfirmDialog"
import useTodoStore from "./stores/store"
import TableTask from "./components/TableTask"

function App() {
  const deleteId = useTodoStore((state) => state.id)
  const setOpen = useTodoStore((state) => state.setOpen)
  const open = useTodoStore((state) => state.open)
  const setOpenConfirmDialog = useTodoStore((state) => state.setOpenConfirmDialog)
  const openConfirmDialog = useTodoStore((state) => state.openConfirmDialog)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleCancel = () => setOpenConfirmDialog(false)
  const deleteCurrentTask = async () => {
    await deleteTask(deleteId)
    setOpenConfirmDialog(false)
    await mutate("/tasks")
  }
  return (
    <>
      <TableTask />
      <FormDialog
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
      {
        openConfirmDialog && <ConfirmationDialog deleteTask={deleteCurrentTask} open={openConfirmDialog} handleCancel={handleCancel} />
      }
    </>
  )
}

export default App
