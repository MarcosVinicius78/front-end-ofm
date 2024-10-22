import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTex',
  standalone: true
})
export class FormatTexPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }

    // Transformar asteriscos (*) em <strong> para negrito
    let formattedText = value.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // Transformar quebras de linha (\n) em <br> para nova linha
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
  }

}
