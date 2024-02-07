import React from 'react'
import { useState, useEffect } from 'react';

function LogoutTimer({ logoutCallback, timeoutInMinutes }) {

    const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logoutCallback, timeoutInMinutes * 60 * 1000);
    };

    const handleActivity = () => {
      if (!isActive) {
        setIsActive(true);
      }
      resetTimer();
    };

    // Attach event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Set up initial timeout
    resetTimer();

    // Clear timeout and remove event listeners on component unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isActive, logoutCallback, timeoutInMinutes]);

  return (
    <div>
      
    </div>
  )
}

export default LogoutTimer
