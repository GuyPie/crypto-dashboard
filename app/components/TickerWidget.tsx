import type { TickerWidget as TickerWidgetType } from '@prisma/client';
import {
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import type { Ticker } from '~/utils/coins.server';

type Props = {
  ticker: Ticker & { widget: TickerWidgetType }
};

export default function TickerWidget({ ticker }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center">
          <Stack direction="row" flex="1" alignItems="center">
            <img width="25" height="25" src={ticker.widget.coinIcon} alt="" />
            <Typography marginLeft="0.5rem">{ticker.base}</Typography>
            <Typography variant="h4" marginX="0.5rem">/</Typography>
            <img width="25" height="25" src={ticker.widget.targetCoinIcon} alt="" />
            <Typography marginLeft="0.5rem">{ticker.target}</Typography>
          </Stack>
          <Typography variant="subtitle1" color="text.secondary">
            Source:
            {' '}
            {ticker.market.name}
          </Typography>
        </Stack>
        <Typography marginTop="0.5rem" variant="h5" component="div">
          {ticker.last}
        </Typography>
      </CardContent>
    </Card>
  );
}
