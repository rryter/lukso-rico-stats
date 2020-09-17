import { Pipe, PipeTransform } from '@angular/core';
import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  toDate,
} from 'date-fns';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return formatDistanceToNowStrict(toDate(parseFloat(value)), {
      addSuffix: true,
    });
  }
}
