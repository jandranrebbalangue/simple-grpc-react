import React from "react"
import useSWR from "swr"
import {
  Button,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import { TodosProps, deleteTasks, fetcher, updateStatus } from "./constants"
import FormDialog from "./components/FormDialog"

function App() {
  const [open, setOpen] = React.useState<boolean>(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { data: payload, isLoading } = useSWR("/tasks", fetcher)
  const data = payload as TodosProps[]
  const deleteTask = async (id: number) => {
    await deleteTasks(id)
  }
  if (isLoading) return <CircularProgress />
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Complete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item: TodosProps) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell style={{ textDecorationLine: item.status === "Completed" ? "line-through" : "none" }}>{item.task}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteTask(item.id)}>Delete</Button>
                </TableCell>
                <TableCell>
                  <Checkbox onChange={async (event) => {
                    const body = {
                      status: "Completed"
                    }
                    if (event.target.checked) {
                      await updateStatus(item.id, body)
                    } else {
                      body.status = "Not Completed"
                      await updateStatus(item.id, body)
                    }
                  }} value={item.status === "Completed" ? "on" : undefined} defaultValue={"off"} />
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
    </>
  )
}

export default App
