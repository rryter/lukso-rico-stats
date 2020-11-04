// prettier-ignore
export interface CmcResponse {
    status: CmcResponseStatus;
    data:   CmcResponseData;
}
// prettier-ignore
export interface CmcResponseData {
    [key: string]: CryptoCurrency;
}
// prettier-ignore
export interface CryptoCurrency {
    id:                 number;
    name:               string;
    symbol:             string;
    slug:               string;
    num_market_pairs:   number;
    date_added:         string;
    tags:               any[];
    max_supply:         number;
    circulating_supply: number;
    total_supply:       number;
    platform:           Platform;
    is_active:          number;
    cmc_rank:           number;
    is_fiat:            number;
    last_updated:       string;
    quote:              Quote;
}
// prettier-ignore
export interface Platform {
    id:            number;
    name:          string;
    symbol:        string;
    slug:          string;
    token_address: string;
}
// prettier-ignore
export interface Quote {
    USD: Currency;
}
// prettier-ignore
export interface Currency {
    price:              number;
    volume_24h:         number;
    percent_change_1h:  number;
    percent_change_24h: number;
    percent_change_7d:  number;
    market_cap:         number;
    last_updated:       string;
}

export interface CmcResponseStatus {
  timestamp: string;
  error_code: number;
  error_message: null;
  elapsed: number;
  credit_count: number;
  notice: null;
}

// prettier-ignore-end
