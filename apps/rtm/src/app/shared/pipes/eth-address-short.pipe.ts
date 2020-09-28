import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ethAddressShort',
})
export class EthAddressShortPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (!value) {
      return value;
    }
    const match = value.match(/^(.{6})\s*(.*)(.{4})\s*$/);
    return `${match[1]}...${match[3]}`;
  }
}
