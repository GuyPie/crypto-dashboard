import type { LoaderFunction, MetaFunction } from 'remix';
import type { Dashboard, TickerWidget as TickerWidgetType } from '@prisma/client';
import {
  useLoaderData,
  Link,
  Outlet,
  useTransition,
  useOutlet,
} from 'remix';
import {
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import { findTicker, Ticker } from '~/utils/coins.server';
import { getDashboard, getDashboardWidgets } from '~/utils/dashboards.server';
import TickerWidget from '~/components/TickerWidget';

export const meta: MetaFunction = ({ data }: { data?: Partial<LoaderData> }) => {
  if (data?.dashboard && data.tickers) {
    return {
      title: `"${data.dashboard.name}" crypto dashboard`,
      description: `Much data in ${data.tickers.length} widgets`,
    };
  }

  return {
    title: 'Crypto dashboard',
    description: 'Much data in widgets',
  };
};

type LoaderData = {
  dashboard: Dashboard,
  tickers: (Ticker & { widget: TickerWidgetType })[]
};

export const loader: LoaderFunction = async ({ params }) => {
  const dashboard = await getDashboard(params.dashboardId!);
  if (!dashboard) {
    throw new Response('Dashboard not found.', {
      status: 404,
    });
  }
  const tickerWidgets = await getDashboardWidgets(params.dashboardId!);
  const tickers = (await Promise.all(
    tickerWidgets.map(async (widget) => {
      const ticker = await findTicker(
        widget.coinId,
        widget.targetCoinId,
        widget.marketName,
      );

      if (ticker) {
        return {
          ...ticker,
          widget,
        };
      }

      return undefined;
    }),
  )).filter((ticker): ticker is Ticker & { widget: TickerWidgetType } => !!ticker);

  const data: LoaderData = { dashboard, tickers };
  return data;
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const outlet = useOutlet();

  return (
    <Stack>
      <Typography variant="h2" marginBottom="1rem">
        Dashboard -
        {' '}
        {data.dashboard.name}
      </Typography>
      {!outlet && !data.tickers.length && <Typography marginBottom="1rem">No widgets yet.</Typography>}
      <Stack justifyContent="center" marginBottom="1rem" direction="row" spacing="1">
        {!outlet && transition.state !== 'loading' && (
          <>
            <IconButton component={Link} prefetch="intent" to="add"><Add /></IconButton>
            {!!data.tickers.length && <IconButton component={Link} prefetch="intent" to="."><Refresh /></IconButton>}
          </>
        )}
        {transition.state === 'loading' ? <CircularProgress size={150} /> : <Outlet />}
      </Stack>
      <Grid container spacing={2}>
        {data.tickers.map((ticker) => (
          <Grid key={ticker.widget.id} item xs={12} md={6} lg={4} xl={3}>
            <TickerWidget ticker={ticker} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
