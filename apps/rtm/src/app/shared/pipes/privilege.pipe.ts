import { Pipe, PipeTransform } from '@angular/core';
import { Capabilities } from '@shared/capabilities.enum';

@Pipe({
  name: 'privilege',
})
export class PrivilegePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case Capabilities.MANAGEMENT:
        return 'Management';
      case Capabilities.EXECUTION:
        return 'Execution';
      default:
        return 'ERROR: Does not Match any existing Privilege.';
    }
    return null;
  }
}
