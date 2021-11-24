import { Outlet } from 'react-router';
import Typography from '@mui/material/Typography'

const Calculator = () => {
  return (
    <>
    <Typography variant="h3" color="secondary">Calculator</Typography>
    <Outlet />
    </>
  )
}

export default Calculator;