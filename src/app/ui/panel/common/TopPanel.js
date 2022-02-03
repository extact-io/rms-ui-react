import { TabContext } from 'app/provider/TabContextProvider';
import React, { useContext } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 275,
  },
  hr: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  pos: {},
});

export default function TopPanel({ panels }) {
  const classes = useStyles();
  const { switchTab } = useContext(TabContext);
  return (
    <div>
      <Grid container className={classes.root} spacing={2}>
        {panels.map((panel, index) => (
          <Grid key={index} item>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {panel.label}
                </Typography>
                <Divider className={classes.hr} />
                <Typography className={classes.pos} color="textSecondary">
                  {panel.desc}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => switchTab(panel.panelId)}>
                  {panel.label + 'へ'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
