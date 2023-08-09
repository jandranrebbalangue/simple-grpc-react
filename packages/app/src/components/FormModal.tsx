import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import React from "react";
import Input from "@mui/material/Input";
import * as Yup from "yup";
import { Form, Formik } from "formik";

const FormModal = ({
  open = false,
  handleOpen,
  handleClose,
}: {
  open: boolean;
  handleOpen: React.MouseEventHandler<HTMLButtonElement>;
  handleClose: () => void;
}) => {
  const MyForm = React.forwardRef<HTMLFormElement>((props, ref) => {
    return (
      <div>
        <Formik
          initialValues={{ task: "" }}
          {...props}
          onSubmit={(values) => {
            console.log("onsubmit values", values)
          }}
          validationSchema={Yup.object().shape({
            task: Yup.string().required(),
          })}
        >
          {(props) => {
            const { values, handleChange, handleSubmit } = props;
            console.log("values props", values)
            return (
              <Form onSubmit={handleSubmit} ref={ref}>
                <Input onChange={handleChange} name="task" />
                <Button type="submit">Submit</Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  });

  return (
    <div>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <MyForm />
      </Modal>
    </div>
  );
};

export default FormModal;
