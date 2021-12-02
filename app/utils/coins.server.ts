import axios from 'axios';

export type Coin = {
  name: string,
  symbol: string,
  id: string,
  image: { thumb: string, small: string }
};
export type Ticker = {
  coin_id: string,
  target_coin_id: string,
  base: string,
  target: string,
  is_anomaly: boolean,
  is_stale: boolean,
  last: number,
  trust_score: string,
  market: { name: string },
};

const coinsPromise = axios.get<Coin[]>(
  'https://api.coingecko.com/api/v3/coins',
);

export async function getCoins() {
  const coins: Coin[] = (await coinsPromise).data;
  return coins.map((coin) => ({
    name: coin.name,
    symbol: coin.symbol,
    id: coin.id,
    image: coin.image,
  }));
}

export async function findTicker(coinId: string, targetCoinId: string, marketName?: string) {
  const { tickers } = (await axios.get<{ tickers: Ticker[] }>(
    `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?page`,
  )).data;
  return tickers.find(
    (ticker) => ticker.target_coin_id === targetCoinId
        && (!marketName || ticker.market.name === marketName),
  );
}
