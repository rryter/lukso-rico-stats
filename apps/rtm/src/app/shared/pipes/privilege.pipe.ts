import { Pipe, PipeTransform } from '@angular/core';
import { Privileges } from '@shared/capabilities.enum';

@Pipe({
  name: 'privilege',
})
export class PrivilegePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case Privileges.MANAGEMENT:
        return 'Management';
      case Privileges.EXECUTION:
        return 'Execution';
      default:
        return 'ERROR: Does not Match any existing Privilege.';
    }
    return null;
  }
}
