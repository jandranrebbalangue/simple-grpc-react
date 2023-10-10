import React from "react"
import useSWR, { mutate } from "swr"
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import { TodosProps } from "./types"
import { deleteTask } from "./utils/deleteTask"
import { fetcher } from "./utils/fetcher"
import { updateStatus } from "./utils/updateStatus"
import FormDialog from "./components/FormDialog"
import ConfirmationDialog from "./components/ConfirmDialog"
import useTodoStore from "./stores/store"

function App() {
  const setDeleteId = useTodoStore((state) => state.deleteId)
  const deleteId = useTodoStore((state) => state.id) as number
  const [open, setOpen] = React.useState<boolean>(false)
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState<boolean>(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleCancel = () => setOpenConfirmDialog(false)
  const { data: payload, isLoading } = useSWR("/tasks", fetcher)
  const data = payload as TodosProps[]
  const deleteCurrentTask = async () => {
    await deleteTask(deleteId)
    setOpenConfirmDialog(false)
    await mutate("/tasks")
  }
  if (isLoading) return <CircularProgress />
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item: TodosProps) => (
              <TableRow key={item.id}>
                <TableCell style={{ textDecorationLine: item.status === "Completed" ? "line-through" : "none" }}>{item.task}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button onClick={async () => {
                    const body = {
                      status: "Completed"
                    }
                    await updateStatus(item.id, body)
                  }} disabled={item.status === "Completed" ? true : false} variant="contained">Complete</Button>
                  <Button onClick={() => {
                    setOpenConfirmDialog(true)
                    setDeleteId(item.id)
                  }} variant="contained" color="error" style={{ marginLeft: "10px" }} disabled={item.status === "Completed" ? true : false}>Delete</Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
