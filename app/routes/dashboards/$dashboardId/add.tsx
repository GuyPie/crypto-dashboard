import type { LoaderFunction } from 'remix';
import { useState } from 'react';
import {
  useActionData,
  useLoaderData,
  Form,
  ActionFunction,
  redirect,
} from 'remix';
import { Button, CircularProgress, Stack } from '@mui/material';
import { Save } from '@mui/icons-material';
import { Coin, findTicker, getCoins } from '~/utils/coins.server';
import { createTickerWidget } from '~/utils/dashboards.server';
import CoinPicker from '~/components/CoinPicker';

type ActionData = {
  formError?: string;
};

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<Response | ActionData> => {
  const form = await request.formData();
  const coinId = form.get('coinId');
  const targetCoinId = form.get('targetCoinId');
  const coinIcon = form.get('coinIcon');
  const targetCoinIcon = form.get('targetCoinIcon');

  if (
    !params.dashboardId
    || typeof coinId !== 'string'
    || typeof targetCoinId !== 'string'
    || typeof coinIcon !== 'string'
    || typeof targetCoinIcon !== 'string'
  ) {
    return redirect('/dashboards');
  }

  const ticker = await findTicker(coinId, targetCoinId);

  if (ticker) {
    await createTickerWidget({
      dashboardId: params.dashboardId,
      coinId,
      targetCoinId,
      marketName: ticker.market.name,
      coinIcon,
      targetCoinIcon,
    });
    return redirect(`/dashboards/${params.dashboardId}`);
  }

  return { formError: 'No ticker found for those two coins.' };
};

export const loader: LoaderFunction = () => getCoins();

export default function AddWidgetRoute() {
  const coins = useLoaderData<Coin[]>();
  const actionData = useActionData<ActionData | undefined>();
  const [baseCoin, setBaseCoin] = useState<Coin | null>(null);
  const [targetCoin, setTargetCoin] = useState<Coin | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <Form method="post" onSubmit={() => setShowSpinner(true)}>
      <CoinPicker coins={coins} onChange={setBaseCoin} label="Choose a base coin" />
      <CoinPicker coins={coins} onChange={setTargetCoin} label="Choose a target coin" />
      {showSpinner
        ? <Stack alignItems="center"><CircularProgress /></Stack>
        : <Button startIcon={<Save />} type="submit" variant="outlined" size="large" disabled={!baseCoin || !targetCoin}>Save Widget</Button>}
      <div id="form-error-message">
        {!showSpinner && actionData?.formError ? (
          <p className="form-validation-error" role="alert">
            {actionData?.formError}
          </p>
        ) : null}
      </div>
      <input
        type="hidden"
        name="coinId"
        value={baseCoin?.id || ''}
      />
      <input
        type="hidden"
        name="targetCoinId"
        value={targetCoin?.id || ''}
      />
      <input
        type="hidden"
        name="coinIcon"
        value={coins.find((coin) => coin.id === baseCoin?.id)?.image.small || ''}
      />
      <input
        type="hidden"
        name="targetCoinIcon"
        value={coins.find((coin) => coin.id === targetCoin?.id)?.image.small || ''}
      />
    </Form>
  );
}
