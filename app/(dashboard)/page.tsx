import * as React from 'react';
import Typography from '@mui/material/Typography';
import { auth } from '../../auth';
import { Box } from '@mui/material';
import MuiGraph from '../components/MuiGraph';

export default async function HomePage() {
  const session = await auth();

  return (

    <Box flex={1}>
      <MuiGraph />    
    </Box>

  );
}
