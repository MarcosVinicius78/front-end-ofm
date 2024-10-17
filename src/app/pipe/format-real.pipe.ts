import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatReal',
  standalone: true
})
export class FormatRealPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'number') {
      return this.formatarNumero(value);
    }

    // Se o valor for string com R$, usa regex para remover e converter para número
    if (typeof value === 'string') {
      const valorNumerico = parseFloat(value.replace(/[^\d.-]/g, ''));
      return this.formatarNumero(valorNumerico);
    }

    return value;
  }

  formatarNumero(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

}
