import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'http://data.fixer.io/api/latest?access_key=1cce3777c960c1a247e4808a6333d265'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])//this is element, which we are can select in drop menu of currency
  const [fromCurrency, setFromCurrency] = useState()//this is first currency which displaeyd in select window
  const [toCurrency, setToCurrency] = useState()// this is the same for second select window
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  
  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0]//this is first currency from list              
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}&base=${fromCurrency}&symbols=${toCurrency}`)
      .then (res => res.json())
      .then (data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
    <h1>Convert</h1>
    <CurrencyRow 
      currencyOptions={currencyOptions}
      selectedCurrency={fromCurrency}
      onChangeCurrency={e => setFromCurrency(e.target.value)}
      onChangeAmount={handleFromAmountChange}
      amount={fromAmount}
    />
    <div className='equals'>=</div>
    <CurrencyRow 
      currencyOptions={currencyOptions}
      selectedCurrency={toCurrency}
      onChangeCurrency={e => setToCurrency(e.target.value)}
      onChangeAmount={handleToAmountChange}
      amount={toAmount}
    />
    </>
    
  );
}

export default App;
