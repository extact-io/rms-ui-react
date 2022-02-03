import React from 'react';
import { Box, Link, Typography } from '@material-ui/core';

export default function Logout() {
  return (
    <Box pt={3} pl={1}>
      <Typography>
        ログアウトしました。再度ログインする際は
        <Link href="/" underline="always">
          こちら
        </Link>
        から
      </Typography>
    </Box>
  );
}
