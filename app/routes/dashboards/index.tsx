import { Link } from 'remix';
import { Typography, Stack } from '@mui/material';

export default function DashboardsIndexRoute() {
  return (
    <Stack direction="row">
      <Typography>
        Pick one of your existing dashboards from the left sidebar, or
        {' '}
        <Link prefetch="intent" to="new">create a new one</Link>
        .
      </Typography>
    </Stack>
  );
}
