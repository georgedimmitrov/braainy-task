import { Injectable } from '@angular/core';
import { get as objectGet } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  // utility method used to check if user is modifying datagrid columns visibility
  // built-in solution from Clarity exists via the *clrDgHideableColumn directive but
  // is currently not working in their latest stable version - https://github.com/vmware/clarity/issues/4227
  isModidfyingColumnsState(event): boolean {
    const attr = event?.target?.attributes;
    const parent = objectGet(event.target, 'parentNode.parentNode.parentNode');
    const parentTwo = objectGet(event.target, 'parentNode.parentNode');

    if (!attr || !parent) {
      return;
    }

    const parentClassName = parent?.className?.split(' ')[0];
    const parentTwoClassName = parentTwo?.className?.split(' ')[1];
    const attrName = attr[0].name;
    const attrValue = attr[0].value;

    return (
      (attrName === 'shape' &&
        attrValue === 'close' &&
        parentClassName === 'column-switch') ||
      (attrName === 'shape' &&
        attrValue === 'view-columns' &&
        parentClassName === 'datagrid-footer' &&
        parentTwoClassName !== 'active')
    );
  }

  isColumnHidden(column: Element) {
    return column.classList.contains('datagrid-hidden-column');
  }
}
