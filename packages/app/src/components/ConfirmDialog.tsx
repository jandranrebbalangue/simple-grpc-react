import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

function ConfirmationDialog({ deleteTask, open, handleCancel }: { deleteTask: () => void, open: boolean, handleCancel: () => void }) {
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent dividers>
        Do you want to delete this item?
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={deleteTask}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmationDialog
