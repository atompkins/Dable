import {bind} from './utils';

export default function(columnCell) {
  var tag = columnCell.tagName;
  //prevent sorting from some form elements
  if (tag != 'INPUT' && tag != 'BUTTON' && tag != 'SELECT' &&
      tag != 'TEXTAREA') {
    var sortSpan = columnCell.querySelector('.' + this.sortClass);
    var columnTag = columnCell.getAttribute('data-tag');
    var columnIndex = -1;
    for (var i = 0; i < this.columnData.length; ++i) {
      if (this.columnData[i].Tag.toLowerCase() == columnTag.toLowerCase()) {
        columnIndex = i;
        break;
      }
    }

    if (columnIndex == -1) {
      return false;
    }

    var ascend = true;
    if (this.sortColumn === columnIndex &&
        this.sortOrder.length === 3 &&
        this.sortOrder.toLowerCase() == 'asc') {
      ascend = false;
    }
    this.sortColumn = columnIndex;

    if (ascend) {
      this.sortOrder = 'asc';
      sortSpan.innerHTML = '^';
    } else {
      this.sortOrder = 'desc';
      sortSpan.innerHTML = 'v';
    }

    if (this.async) {
      this.asyncRequest(this.asyncStart, this.currentFilter, columnIndex,
        ascend, bind(function(error) {
          if (error) {throw error;}
          this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
          this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
          this.UpdateStyle();
        }, this));
    } else if (this.columnData[columnIndex].CustomSortFunc) {
      this.visibleRowObjects = this.columnData[columnIndex]
        .CustomSortFunc(columnIndex, ascend, this.visibleRowObjects);
      this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
      this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
      this.UpdateStyle();
    } else {
      this.visibleRowObjects = this
        .baseSort(columnIndex, ascend, this.visibleRowObjects);
      this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
      this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
      this.UpdateStyle();
    }
  }
}
