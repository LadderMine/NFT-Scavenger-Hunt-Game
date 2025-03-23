import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const rate = response.data.rates[toCurrency];
    return amount * rate;
  }
}
