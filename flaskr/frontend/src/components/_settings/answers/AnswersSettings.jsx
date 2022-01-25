import { useState, useContext } from 'react'
import { Grid, Snackbar, Alert } from '@mui/material'

import { useAxiosEffect } from '../../tools/axiosTool'
import EditCreditCards from './EditCreditCards'
import EditAnswers from './EditAnswers'
import { UserContext } from '../../tools/contexts'

const AnswersSettings = () => {

  const { user } = useContext(UserContext)

  const [openSB, setOpenSB] = useState(false)
  const [message, setMessage] = useState({ msg: '', vnt: '' })
  const [payMeths, setPayMeths] = useState([])
  const [commonAnswers, setCommonAnswers] = useState([])
  const [ownAnswers, setOwnAnswers] = useState([])


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
    <>
      {user.is_admin &&
        <Grid item xs={12} md={6}>
          <EditCreditCards
            payMeths={payMeths}
            setPayMeths={setPayMeths}
            handleMessage={handleMessage}
          />
        </Grid>
      }
      <Grid item xs={12} md={6}>
        <EditAnswers
          user={user}
          commonAnswers={commonAnswers}
          setCommonAnswers={setCommonAnswers}
          ownAnswers={ownAnswers}
          setOwnAnswers={setOwnAnswers}
          handleMessage={handleMessage}
        />
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
    </>
  )
}

export default AnswersSettings;