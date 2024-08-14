
import NavBar from "../NavBar";
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';

export default function ItemList() {
    return (
        <>
            <NavBar/>
            <div style={{marginTop:'1%'}}>
                <>Item List</>
                <br></br>
                <Button variant="contained" color="success" startIcon={<AddCircleOutlineIcon />} component={Link} to='/add-item'>
                    Add item
                </Button>
            </div>
            
        </>
    )
}