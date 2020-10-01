import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringFormat'
})
export class StringFormatPipe implements PipeTransform {

  transform(str: string, ...val: string[]): string {
    for (let index = 0; index < val.length; index++) {
      str = str.replace(`{${index}}`, val[index]);
    }
    return str;
  }

}
