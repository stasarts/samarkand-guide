import createUseRequest from '@site/src/components/Price/createUseRequest';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const CURRENCIES = ['usd', 'rub', 'uah', 'byn']
const FORMATS = {
  byn: '{value} б.р.',
  rub: '{value} ₽',
  uah: '{value} ₴',
  usd: '${value} ₴',
  default: '{value} {code}'
}

const useCurrencyRequest = createUseRequest({
  cacheName: 'currency',
  factory({ selectedCurrencies = CURRENCIES } = {}) {
    return fetch('https://www.floatrates.com/daily/uzs.json')
      .then((response) => response.json())
      .then((currencies: Record<string, { rate?: number }>) => {
        return Object.fromEntries(
          Object.entries(currencies)
          .map(([code, currency]): [string, number] => [code, currency?.rate])
          .filter(([code, rate]) => rate && selectedCurrencies.includes(code))
        )
      });
  }
})

export default function Price({ children }: { children: string }) {
  const price = Number.parseInt(children, 10);

  // Need to use effect, otherwise dom attribute won't be updated
  const currenciesTmp = useCurrencies({ price });
  const [currencies, setCurrencies] = useState(null);
  useEffect(() => setCurrencies(currenciesTmp), [currenciesTmp, setCurrencies]);

  return (
    <span className={styles.price} data-title={currencies} tabIndex={0}>
      {formatMoney(price)}
    </span>
  );
}

function useCurrencies({ price = 0, selectedCurrencies = CURRENCIES } = {}) {
  const rates = useCurrencyRequest({ selectedCurrencies }) || {};
  return selectedCurrencies
    .map((currencyCode) => {
      const rate = rates[currencyCode];
      if (!rate || !price) {
        return null;
      }

      const format = FORMATS[currencyCode] || FORMATS.default;
      return format
        .replace('{value}', formatMoney(price * rate))
        .replace('{code}', currencyCode.toUpperCase())
    })
    .filter(Boolean)
    .join('\n')
}

function formatMoney(amount: number) {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    .replace(/\.00$/, '');
}
