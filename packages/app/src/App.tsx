import React from "react"
import useSWR from "swr"
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
import { TodosProps, deleteTask, fetcher, updateStatus } from "./constants"
import FormDialog from "./components/FormDialog"
import ConfirmationDialog from "./components/ConfirmDialog"

function App() {
  const [open, setOpen] = React.useState<boolean>(false)
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState<boolean>(false)
  const [deleteId, setDeleteId] = React.useState<number>(0)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleCancel = () => setOpenConfirmDialog(false)
  const { data: payload, isLoading } = useSWR("/tasks", fetcher)
  const data = payload as TodosProps[]
  const deleteCurrentTask = async () => {
    await deleteTask(deleteId)
    setOpenConfirmDialog(false)
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
            {data.map((item: TodosProps) => (
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
