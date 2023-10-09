import React from "react";

import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const NoMatch = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"

      sx={{ marginTop: 4 }}
    >
      <AssistWalkerIcon sx={{ fontSize: 60 }} />

      <Typography variant="h2" gutterBottom sx={{textAlign: 'center'}}>
        Error 404: Page Not Found
      </Typography>

      <AssistWalkerIcon sx={{ fontSize: 60 }} />

    </Grid>
  );
};

export default NoMatch;
