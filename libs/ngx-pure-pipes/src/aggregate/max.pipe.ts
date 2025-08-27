import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'max',
})
export class MaxPipe implements PipeTransform {
  transform<T, Key extends keyof T>(
    value: readonly T[],
    getter?: Key | ((item: T) => number)
  ): T;
  transform(value: null | undefined): null;
  transform<T, Key extends keyof T>(
    value: readonly T[] | null | undefined,
    getter?: Key | ((item: T) => number)
  ): T | null {
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    const get = (v: T) => {
      if (typeof getter === 'function') {
        return getter(v);
      }
      if (getter === undefined) {
        return v as unknown as number;
      }
      return v[getter as keyof T] as number;
    };

    return value.reduce((a, b) => (get(a) >= get(b) ? a : b));
  }
}
