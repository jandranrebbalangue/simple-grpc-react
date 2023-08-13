import React from "react"
import useSWR from "swr"
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import { TodosProps, fetcher } from "./constants"
import FormDialog from "./components/FormDialog"

function App() {
  const [open, setOpen] = React.useState<boolean>(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { data: payload, isLoading } = useSWR("/todos", fetcher)
  const data = payload as TodosProps[]
  if (isLoading) return <CircularProgress />
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Task</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item: TodosProps) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.task}</TableCell>
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
