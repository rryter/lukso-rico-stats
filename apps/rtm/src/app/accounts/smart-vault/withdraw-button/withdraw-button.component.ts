import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addWeeks, getDay, getHours, formatDistanceToNow } from 'date-fns';
import { setDay, setHours, setSeconds, setMinutes } from 'date-fns/fp';

@Component({
  selector: 'lukso-withdraw-button',
  templateUrl: './withdraw-button.component.html',
})
export class WithdrawButtonComponent implements OnInit {
  @Input() hasPendingTransaction: boolean;
  @Input() vaultLocked: boolean;
  @Output() withdrawFunds = new EventEmitter();

  timeUntilUnlockInWords: string;

  ngOnInit(): void {
    this.timeUntilUnlockInWords = this.getNextUnlockTimeRelative();
  }

  private getNextUnlockTimeRelative(): string {
    const setTuesday = setDay(2);
    const set17oClock = setHours(17);
    const set0Minutes = setMinutes(0);
    const set0Seconds = setSeconds(0);
    const now = Date.now();

    let nextTuesday17oClock = set0Seconds(set0Minutes(setTuesday(set17oClock(now))));

    if (this.isDeadlineThisWeek(now)) {
      nextTuesday17oClock = addWeeks(nextTuesday17oClock, 1);
    }

    return formatDistanceToNow(nextTuesday17oClock);
  }

  private isDeadlineThisWeek(now: number) {
    return !(getDay(now) <= 2 && getHours(now) <= 17);
  }
}
