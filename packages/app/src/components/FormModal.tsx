import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import React from "react";
import { Input } from "@mui/material";
import { useForm } from "@tanstack/react-form";

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
    const form = useForm({
      defaultValues: React.useMemo(
        () => ({
          task: "",
        }),
        [],
      ),
      onSubmit: async (data) => {
        console.log({ data });
      },
    });
    return (
      <div>
        <form.Provider>
          <form {...form.getFormProps} ref={ref}>
            <div>
              <form.Field
                name="task"
                onChange={(value) => (!value ? "Task is required" : value)}
                children={(field) => {
                  return (
                    <>
                      <Input {...field.getInputProps} {...props} />
                    </>
                  );
                }}
              />
            </div>
            <form.Subscribe
              {...{
                selector: (state) =>
                  [state.canSubmit, state.isSubmitting] as const,
                children: ([canSubmit, isSubmitting]) => (
                  <button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Submit"}
                  </button>
                ),
              }}
            />
          </form>
        </form.Provider>
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
