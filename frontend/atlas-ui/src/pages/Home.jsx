import React from 'react'
import './Home.css'
import LOGO from '../../public/Atlas_AI_Logo_-_Dark_Blue_and_Charcoal-removebg-preview.png'
import GoogleButton from '../components/googlebutton'

function Home() {
  return (
    <div className="home-wrapper">
      {/* Desktop View */}
      <div className="desktop-view">
        <div className="content">
          <img src={LOGO} alt="Atlas AI Logo" />
          <div>
            <h1>
              Welcome to Atlas AI, your one-stop solution for last-minute exam prep
            </h1>
            <div className="google-button">
              <GoogleButton />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Block Message */}
      <div className="mobile-view">
        <h2>📱 Atlas AI is only available on desktop devices.</h2>
        <p>Please visit on a larger screen for the full experience.</p>
      </div>
    </div>
  )
}

export default Home
