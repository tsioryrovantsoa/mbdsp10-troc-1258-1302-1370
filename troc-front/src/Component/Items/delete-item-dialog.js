
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function DeleteItemDialog(props) {

    const onSubmit = (event) => {
        event.preventDefault();
        props?.handleDelete(props?.item?.itemId);
    };

    return (
        <Dialog
            open={props?.open}
            onClose={props?.handleClose}
            PaperProps={{
            component: 'form',
            onSubmit: onSubmit,
            }}
        >
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you want to delete the item "{props?.item?.title}" ? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props?.handleClose}>Cancel</Button>
          <Button type="submit">Delete</Button>
        </DialogActions>
      </Dialog>
    )
}