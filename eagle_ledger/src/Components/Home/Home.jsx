import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate()
    const[state,setState] = useState()

    

    const handleChange = (event) => {
      setState(event.target.value)
    }

    const submit = () => {
      
    }

    console.log('state', state)

    
    
  return (
    <div>
      {/* <input type='text' value={state} onChange={handleChange}/>
      <button onClick={ () => { submit()}}>submit</button> */}
      <Stack spacing={2} direction="row">
      {/* <Button variant="contained" onClick={ () => {navigate('/addUser')}}>Add</Button>
      <Button variant="contained" onClick={ () => {navigate('/view')}}>View</Button>
      <Button variant="contained" onClick={ () => {navigate('/paymentEntry')}}>Recipt Entry</Button> */}
    </Stack>
    </div>
  )
}

export default Home
