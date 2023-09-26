import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descending'
})
export class DescendingPipe implements PipeTransform {
  
    transform(array: any[]): any[] {
      if (!Array.isArray(array)) {
        return array;
      }
  
    return array.slice().sort((a, b) => (b > a? 1: -1));
  }

}
