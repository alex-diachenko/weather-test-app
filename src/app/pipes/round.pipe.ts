import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number, method: 'floor' | 'ceil' | 'round' = 'round'): number {
    return Math[method](value);
  }
}