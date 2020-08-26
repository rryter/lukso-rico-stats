import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, toDate } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return formatDistanceToNow(toDate(parseFloat(value)), {
      includeSeconds: true,
      addSuffix: true,
    });
  }
}
