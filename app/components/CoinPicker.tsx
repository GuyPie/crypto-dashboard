import { Autocomplete, Box, TextField } from '@mui/material';
import { Coin } from '~/utils/coins.server';

type Props = {
  coins: Coin[],
  onChange: (newValue: Coin | null) => void,
  label: string,
};

export default function CoinPicker({ coins, onChange, label }: Props) {
  return (
    <Autocomplete
      options={coins}
      autoHighlight
      getOptionLabel={(option: Coin) => option.name}
      renderOption={(props, option) => (
        <Box key={option.id} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={option.image.thumb}
            alt=""
          />
          {option.name}
        </Box>
      )}
      onChange={(e, newVal) => onChange(newVal)}
      renderInput={(params) => (
        <TextField
          {...params}
          name="base"
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
