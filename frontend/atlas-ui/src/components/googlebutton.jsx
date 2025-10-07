import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function GoogleButton() {
  return (
    <Stack spacing={4} direction="col" 
>
      <Button variant="outlined"
          style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '150px',
        right:'500px',
        width: '300px',
        height:'50px',
        fontSize:'15px'
    }}>Sign in with Google</Button>
    </Stack>
  );
}

