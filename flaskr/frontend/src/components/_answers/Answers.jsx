import { useState } from 'react'
import {
  Container, Grid, Snackbar, Alert
} from '@mui/material'

import { useAxiosEffect } from '../tools/axiosTool'
import CreditCards from './CreditCards'
import AnswerButtons from './AnswerButtons'

const Answers = () => {

  const [openSB, setOpenSB] = useState(false)
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [payMeths, setPayMeths] = useState([])
  const [commonAnswers, setCommonAnswers] = useState([])
  const [ownAnswers, setOwnAnswers] = useState([])
  const [sysRegex, setSysRegex] = useState([])
  const [ownRegex, setOwnRegex] = useState([])

  useAxiosEffect(
    '/answers/get-all', 'answers',
    (d) => { 
      if (d.answers['payment_methods']) {
        setPayMeths(d.answers.payment_methods) 
      }
      if (d.answers['common_answers']) {
        setCommonAnswers(d.answers.common_answers) 
      }
      if (d.answers['own_answers']) {
        setOwnAnswers(d.answers.own_answers) 
      }
      if (d.answers['sys_regex']) {
        setSysRegex(d.answers.sys_regex)
      }
      if (d.answers['own_regex']) {
        setOwnRegex(d.answers.own_regex)
      }
    },
    (d) => { handleMessage(d.wrn, 'warning') },
    (d) => { handleMessage(d.err, 'error') }
  )

  const handleMessage = (msg, vnt) => {
    setMessage({ msg: msg, vnt: vnt });
    setOpenSB(true)
  }

  const handleClose = () => {
    setOpenSB(false)
  }


  return (
    <Container maxWidth='xl'>
      <Grid container spacing={1} margin={0} pt={3}>
        <Grid item xs={12} md={6}>
          <CreditCards
            payMeths={payMeths}
            sysRegex={sysRegex}
            handleMessage={handleMessage}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnswerButtons
            commonAnswers={commonAnswers}
            ownAnswers={ownAnswers}
            ownRegex={ownRegex}
            handleMessage={handleMessage}
          />
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSB}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert variant='filled' color={message.vnt} 
          sx={{ whiteSpace: 'pre-line' }}
        >
          {message.msg}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Answers;