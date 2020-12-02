import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanReadableNumber',
})
export class HumanReadableNumberPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    if (isNaN(value)) return value;

    if (value < 9999) {
      return value;
    }

    if (value < 1000000) {
      return Math.round(value / 1000) + 'K';
    }
    if (value < 10000000) {
      return (value / 1000000).toFixed(2) + 'M';
    }

    if (value < 1000000000) {
      return Math.round(value / 1000000) + 'M';
    }

    if (value < 1000000000000) {
      return Math.round(value / 1000000000) + 'B';
    }

    return '1T+';
  }
}
