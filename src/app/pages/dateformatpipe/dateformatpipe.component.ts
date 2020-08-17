import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'DateFormatPipeComponent',
})
export class DateFormatPipeComponent implements PipeTransform {

  /* date pipe to format a date in the template and it returns the date type in given format*/
  transform(value: string, format: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, format);
    return value;
  }
}
