import DialogContent from "@mui/material/DialogContent"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import React from "react"
import * as Yup from "yup"
import { Form, Formik } from "formik"
import { addTask } from "../utils/addTask"
import useTodoStore from "../stores/store"
import { mutate } from "swr"

const FormDialog = ({
  open = false,
  handleOpen,
  handleClose
}: {
  open: boolean
  handleOpen: React.MouseEventHandler<HTMLButtonElement>
  handleClose: () => void
}) => {
  const task = useTodoStore((state) => state.task)
  const status = useTodoStore((state) => state.status)
  const MyForm = React.forwardRef<HTMLFormElement>((props, ref) => {
    return (
      <div>
        <Formik
          initialValues={{ task, status }}
          {...props}
          onSubmit={async (values) => {
            await addTask(values)
            handleClose()
            await mutate("/tasks")
          }}
          validationSchema={Yup.object().shape({
            task: Yup.string().required()
          })}
        >
          {(props) => {
            const { handleChange, handleSubmit } = props
            return (
              <Form onSubmit={handleSubmit} ref={ref}>
                <TextField
                  onChange={handleChange}
                  name="task"
                  label="Task"
                  fullWidth
                  variant="standard"
                />
                <DialogActions>
                  <Button type="submit">Submit</Button>
                </DialogActions>
              </Form>
            )
          }}
        </Formik>
      </div>
    )
  })

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Add Todo
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Todo</DialogTitle>
        <DialogContent>
          <MyForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FormDialog
