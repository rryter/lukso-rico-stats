import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict, toDate } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      return formatDistanceToNowStrict(toDate(parseFloat(value) - 1000), {
        addSuffix: true,
      });
    } else {
      return '...';
    }
  }
}
