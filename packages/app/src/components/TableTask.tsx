import useSWR, { mutate } from "swr"
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from "@mui/material"
import { TodosProps } from "../types"
import { fetcher } from "../utils/fetcher"
import { updateStatus } from "../utils/updateStatus"
import useTodoStore from "../stores/store"
const TableTask = () => {
  const { data: payload, isLoading } = useSWR("/tasks", fetcher)
  const data = payload as TodosProps[]
  const setOpenConfirmDialog = useTodoStore((state) => state.setOpenConfirmDialog)
  const setDeleteId = useTodoStore((state) => state.setDeleteId)

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
                    await updateStatus(item.id, { status: "Completed" })
                    await mutate("/tasks")
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
    </>
  )
}

export default TableTask
