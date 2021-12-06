import { Container, Typography } from '@mui/material';

const News = () => {
  return (
    < Container maxWidth="lg" >
      <Typography variant="h1" color="primary">News</Typography>
      <Typography variant="h6" color="dafault">Ideas:</Typography>
      <li> personal remainders </li>
      <li> global news </li>
    </Container >
  )
}

export default News;