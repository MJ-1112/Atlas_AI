import React from 'react'
import './Home.css'
import LOGO from '../../public/Atlas_AI_Logo_-_Dark_Blue_and_Charcoal-removebg-preview.png'
import GoogleButton from '../components/googlebutton'

function Home() {
  return (
    <div className='content'>
        <img src={LOGO} alt="Atlas AI Logo" />
        <h1>Welcome to Atlas AI, one stop solution to your last minute exam prep</h1>
        <GoogleButton className="google-button" />
    </div>
  )
}

export default Home 