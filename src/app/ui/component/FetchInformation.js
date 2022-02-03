import React from 'react';
import { Divider, Grid, LinearProgress, Typography } from '@material-ui/core';

export function FetchInformation({ fetchState, notFoundMessage }) {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        {fetchState.nowLoading() && <LinearProgress color="primary" />}
        {!fetchState.nowLoading() && <Divider />}
      </Grid>
      {fetchState.shouldOutputMessage() && (
        <Grid item xs={12}>
          <Typography>{fetchState.getStateMessage(notFoundMessage)}</Typography>
        </Grid>
      )}
    </React.Fragment>
  );
}
