import React from 'react';
import { Button } from '@mui/material';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const GoogleButton = ({ className }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User Info:", user);
      alert(`Welcome ${user.displayName}`);
      navigate('/chat'); // ✅ Redirect after login
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Google Sign-In failed");
    }
  };

  return (
    <Button
      className={className}
      variant="contained"
      color="primary"
      onClick={handleGoogleSignIn}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleButton;
