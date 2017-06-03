/* eslint-disable max-lines, max-statements, no-global-assign*/
/* jshint -W071 */

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    // 'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    // eslint-disable-next-line no-prototype-builtins
    var hasDontEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];
    var dontEnumsLength = dontEnums.length;
    return function(obj) {
      if (typeof obj !== 'object' &&
          (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [];
      var prop;
      var i;
      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

function makeSimpleTable(div) {
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  var thead = document.createElement('thead');
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var headCell = document.createElement('th');

  var currentCell;
  var headRow = row.cloneNode(false);
  for (var i = 0; i < 4; ++i) {
    currentCell = headCell.cloneNode(false);
    currentCell.innerHTML = 'Column ' + i.toString();
    headRow.appendChild(currentCell);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  for (var k = 0; k < 20; ++k) {
    var currentRow = row.cloneNode(false);
    for (var j = 0; j < 4; ++j) {
      currentCell = cell.cloneNode(false);
      currentCell.innerHTML = (k + j).toString();
      currentRow.appendChild(currentCell);
    }
    tbody.appendChild(currentRow);
  }
  table.appendChild(tbody);
  div.appendChild(table);
}

function makeNestedTable(div) {
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var innerDiv = document.createElement('DIV');
  div.appendChild(table);
  table.appendChild(tbody);
  tbody.appendChild(row);
  row.appendChild(cell);
  cell.appendChild(innerDiv);
  makeSimpleTable(innerDiv);
  return innerDiv;
}

function hex(x) {
  return ('0' + parseInt(x, 10).toString(16)).slice(-2);
}

function rgb2hex(rgb) {
  if (rgb.indexOf('rgb') === -1) {return rgb;}
  var res = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
  return '#' + hex(res[1]) + hex(res[2]) + hex(res[3]);
}

function triggerEvent(el, type) {
  var e;
  if ('createEvent' in document) {
    // modern browsers, IE9+
    e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    e = document.createEventObject();
    e.eventType = type;
    el.fireEvent('on' + e.eventType, e);
  }
}

function floatStyle(el) {
  return el.styleFloat || el.cssFloat || '';
}

function indexOf(arr, val) {
  for (var i = 0; i < arr.length; i += 1) {
    if (arr[i] === val) {
      return i;
    }
  }
  return -1;
}

function customSortFn(columnIndex, ascending, currentRowObjects) {
  var order = ['First', 'Second', 'Third', 'Fourth'];
  currentRowObjects.sort(function(a, b) {
    var valueA = a.Row[columnIndex];
    var valueB = b.Row[columnIndex];
    return indexOf(order, valueA) - indexOf(order, valueB);
  });

  if (!ascending) {
    currentRowObjects.reverse();
  }

  return currentRowObjects;
}

function makeCustomDable(testDiv) {
  var dable = new Dable();
  var data = [
    [1, '12/1/12', 'Porcupine', 'Second'],
    [2, '12/2/2012', 'Cat', 'Fourth'],
    [3, '1/1/2001', 'bat', 'First'],
    [4, '2/22/02', 'Zebra', 'Third']
  ];
  var columns = ['Numbers', 'Dates', 'Text', 'Custom'];
  dable.SetDataAsRows(data);
  dable.SetColumnNames(columns);
  dable.columnData[3].CustomSortFunc = customSortFn;
  dable.BuildAll(testDiv);
}

function makePagerDable(testDiv) {
  var dable = new Dable();
  var data = [
    [1, 2], [3, 4], [5, 6], [7, 8], [9, 10],
    [11, 12], [13, 14], [15, 16], [17, 18], [19, 20]
  ];
  var columns = ['Odd', 'Even'];
  dable.SetDataAsRows(data);
  dable.SetColumnNames(columns);
  dable.pageSizes = [1, 2, 5];           // replace the possible page sizes with our own
  dable.pageSize = 1;                    // select a tiny page size for the example
  dable.pagerSize = 5;                   // The pager is our previous/next buttons, we're adding a 5 page display to it
  dable.pagerIncludeFirstAndLast = true; // we're going to include first and last buttons
  dable.BuildAll(testDiv);
  return dable;
}

var consoleOutput;
if (!console) {console = {};}
console.error = function() {
  consoleOutput = arguments[0];
};

var testDiv = document.getElementById('qunit-fixture');
module('Baseline Tests');
test('Dable exists', function() {
  //Given: Nothing
  //When: We check the type of Dable
  //Then: Dable's type is a function
  strictEqual(typeof Dable, 'function', 'Dable is a function');
});
test('Dable defaults are empty, not null', function() {
  //Given: Nothing

  //When: we create a new Dable
  var dable = new Dable();

  //Then: It's defaults are empty, not null
  notStrictEqual(dable, null, 'Dable is not null');
  notStrictEqual(dable.id, null, 'ID is not null');
  strictEqual(dable.id, '', 'ID is empty');
  notStrictEqual(dable.columns, null, 'Columns is not null');
  ok(dable.columns instanceof Array, 'Columns is an Array');
  strictEqual(dable.columns.length, 0, 'Columns is empty');
  notStrictEqual(dable.columnData, null, 'ColumnData is not null');
  ok(dable.columnData instanceof Array, 'ColumnData is an Array');
  strictEqual(dable.columnData.length, 0, 'ColumnData is empty');
  notStrictEqual(dable.rows, null, 'Rows is not null');
  ok(dable.rows instanceof Array, 'Rows is an Array');
  strictEqual(dable.rows.length, 0, 'Rows is empty');
  notStrictEqual(dable.rowObjects, null, 'RowObjects is not null');
  ok(dable.rowObjects instanceof Array, 'RowObjects is an Array');
  strictEqual(dable.rowObjects.length, 0, 'RowObjects is empty');
  notStrictEqual(dable.hiddenColumns, null, 'HiddenColumns is not null');
  ok(dable.hiddenColumns instanceof Array, 'HiddenColumns is an Array');
  strictEqual(dable.hiddenColumns.length, 0, 'HiddenColumns is empty');
  notStrictEqual(dable.filters, null, 'Filters is not null');
  ok(dable.filters instanceof Array, 'Filters is an Array');
  strictEqual(dable.filters.length, 2,
    'Filters contains the 2 default filters');
  notStrictEqual(dable.pageSizes, null, 'PageSizes is not null');
  ok(dable.pageSizes instanceof Array, 'PageSizes is an Array');
  strictEqual(dable.pageSizes.length, 4,
    'PageSizes contains the 4 default page sizes');
  notStrictEqual(dable.async, null, 'Async is not null');
  strictEqual(dable.async, false, 'Async is false');
  notStrictEqual(dable.asyncData, null, 'AsyncData is not null');
  ok(dable.asyncData instanceof Object, 'AsyncData is an object');
  strictEqual(Object.keys(dable.asyncData).length, 0,
    'AsyncData has no properties');
  notStrictEqual(dable.asyncLength, null, 'AsyncLength is not null');
  strictEqual(dable.asyncLength, 1000, 'AsyncLength is the default: 1000');
  notStrictEqual(dable.asyncStart, null, 'AsyncStart is not null');
  strictEqual(dable.asyncStart, 0, 'AsyncStart is the default: 0');
  notStrictEqual(dable.currentFilter, null, 'CurrentFilter is not null');
  strictEqual(dable.currentFilter, '', 'CurrentFilter is empty');
  notStrictEqual(dable.dableClass, null, 'DableClass is not null');
  strictEqual(dable.dableClass, '', 'DableClass is empty');
  notStrictEqual(dable.evenRowColor, null, 'EvenRowColor is not null');
  strictEqual(dable.evenRowColor, '#E2E4FF',
    'EvenRowColor is the default: #E2E4FF');
  notStrictEqual(dable.evenRowClass, null, 'EvenRowClass is not null');
  strictEqual(dable.evenRowClass, 'table-row-even',
    'EvenRowClass is the default: table-row-even');
  notStrictEqual(dable.footerClass, null, 'FooterClass is not null');
  strictEqual(dable.footerClass, '', 'FooterClass is empty');
  notStrictEqual(dable.headerClass, null, 'HeaderClass is not null');
  strictEqual(dable.headerClass, '', 'HeaderClass is empty');
  notStrictEqual(dable.oddRowColor, null, 'OddRowColor is not null');
  strictEqual(dable.oddRowColor, 'white',
    'OddRowColor is the default: #E2E4FF');
  notStrictEqual(dable.oddRowClass, null, 'OddRowClass is not null');
  strictEqual(dable.oddRowClass, 'table-row-odd',
    'OddRowClass is the default: table-row-odd');
  notStrictEqual(dable.pageNumber, null, 'PageNumber is not null');
  strictEqual(dable.pageNumber, 0, 'PageNumber is the default: 0');
  notStrictEqual(dable.pageSize, null, 'PageSize is not null');
  strictEqual(dable.pageSize, 10, 'PageSize is the default: 10');
  notStrictEqual(dable.minimumSearchLength, null,
    'MinimumSearchLength is not null');
  strictEqual(dable.minimumSearchLength, 1,
    'MinimumSearchLength is the default: 1');
  notStrictEqual(dable.pagerButtonsClass, null,
    'PagerButtonsClass is not null');
  strictEqual(dable.pagerButtonsClass, 'table-page',
    'PagerButtonsClass is the default: table-page');
  notStrictEqual(dable.pagerIncludeFirstAndLast, null,
    'PagerIncludeFirstAndLast is not null');
  strictEqual(dable.pagerIncludeFirstAndLast, false,
    'PagerIncludeFirstAndLast is the default: false');
  notStrictEqual(dable.pagerSize, null, 'PagerSize is not null');
  strictEqual(dable.pagerSize, 0, 'PagerSize is the default: 0');
  notStrictEqual(dable.sortClass, null, 'SortClass is not null');
  strictEqual(dable.sortClass, 'table-sort',
    'SortClass is the default: table-sort');
  strictEqual(dable.sortColumn, null, 'SortColumn is null');
  notStrictEqual(dable.sortOrder, null, 'SortOrder is not null');
  strictEqual(dable.sortOrder, 'descending',
    'SortOrder is the default: descending');
  notStrictEqual(dable.style, null, 'Style is not null');
  strictEqual(dable.style, 'none', 'Style is the default: none');
  notStrictEqual(dable.tableClass, null, 'TableClass is not null');
  strictEqual(dable.tableClass, '', 'TableClass is empty');
  notStrictEqual(dable.tfoothtml, null, 'TFootHtml is not null');
  strictEqual(dable.tfoothtml, '', 'TFootHtml is empty');
});

module('Pager Tests');
test('Dable Pager goes forward', function() {
  //Given: a table made into a Dable with more than 1 page
  makeSimpleTable(testDiv);
  var dable = new Dable(testDiv.id);

  //When: we call page forward and check the first cell of the table
  // dable.NextPage();
  testDiv.children[2].children[1].children[1].children[0].click();
  var firstCell = testDiv.querySelector('td');

  //Then: we see the next page
  strictEqual(dable.pageNumber, 1, 'Current page is 1');
  strictEqual(firstCell.innerHTML, '10', 'First cell contains 10');
});
test('Dable Pager goes backward', function() {
  //Given: a table made into a Dable with more than 1 page and go to page 2
  makeSimpleTable(testDiv);
  var dable = new Dable(testDiv.id);
  testDiv.children[2].children[1].children[1].children[0].click();

  //When: we call page backward and check the first cell of the table
  testDiv.children[2].children[1].children[0].children[0].click();
  var firstCell = testDiv.querySelector('td');

  //Then: we see the first page
  strictEqual(dable.pageNumber, 0, 'Current page is 0');
  strictEqual(firstCell.innerHTML, '0', 'First cell contains 0');
});
test('Dable multi page Pager looks right', function() {
  //Given: a Dable with a multi page Pager
  makePagerDable(testDiv);

  //Then: it looks right
  var pager = testDiv.children[2].children[1];
  //Element pattern
  strictEqual(pager.children.length, 9, 'Pager has 9 elements');
  strictEqual(pager.children[0].children.length, 1,
    'First element has one child');
  strictEqual(pager.children[1].children.length, 1,
    'Second element has one child');
  strictEqual(pager.children[2].children.length, 1,
    'Third element has one child');
  strictEqual(pager.children[3].children.length, 1,
    'Fourth element has one child');
  strictEqual(pager.children[4].children.length, 1,
    'Fifth element has one child');
  strictEqual(pager.children[5].children.length, 1,
    'Sixth element has one child');
  strictEqual(pager.children[6].children.length, 1,
    'Seventh element has one child');
  strictEqual(pager.children[7].children.length, 1,
    'Eighth element has one child');
  strictEqual(pager.children[8].children.length, 1,
    'Ninth element has one child');
  strictEqual(pager.children[0].children[0].children.length, 0,
    'First element child has no decendants');
  strictEqual(pager.children[1].children[0].children.length, 0,
    'Second element child has no decendants');
  strictEqual(pager.children[2].children[0].children.length, 0,
    'Third element child has no decendants');
  strictEqual(pager.children[3].children[0].children.length, 0,
    'Fourth element child has no decendants');
  strictEqual(pager.children[4].children[0].children.length, 0,
    'Fifth element child has no decendants');
  strictEqual(pager.children[5].children[0].children.length, 0,
    'Sixth element child has no decendants');
  strictEqual(pager.children[6].children[0].children.length, 0,
    'Seventh element child has no decendants');
  strictEqual(pager.children[7].children[0].children.length, 0,
    'Eighth element child has no decendants');
  strictEqual(pager.children[8].children[0].children.length, 0,
    'Ninth element child has no decendants');
  //IDs
  strictEqual(pager.children[0].id, testDiv.id + '_page_first');
  strictEqual(pager.children[1].id, testDiv.id + '_page_prev');
  strictEqual(pager.children[2].id, '');
  strictEqual(pager.children[3].id, '');
  strictEqual(pager.children[4].id, '');
  strictEqual(pager.children[5].id, '');
  strictEqual(pager.children[6].id, '');
  strictEqual(pager.children[7].id, testDiv.id + '_page_next');
  strictEqual(pager.children[8].id, testDiv.id + '_page_last');
  //Text
  strictEqual(pager.children[0].children[0].innerHTML, 'First');
  strictEqual(pager.children[1].children[0].innerHTML, 'Prev');
  strictEqual(pager.children[2].children[0].innerHTML, '1');
  strictEqual(pager.children[3].children[0].innerHTML, '2');
  strictEqual(pager.children[4].children[0].innerHTML, '3');
  strictEqual(pager.children[5].children[0].innerHTML, '4');
  strictEqual(pager.children[6].children[0].innerHTML, '5');
  strictEqual(pager.children[7].children[0].innerHTML, 'Next');
  strictEqual(pager.children[8].children[0].innerHTML, 'Last');
  //Attributes
  strictEqual(pager.children[0].getAttribute('disabled'), 'disabled',
    'First is disabled');
  strictEqual(pager.children[1].getAttribute('disabled'), 'disabled',
    'Prev is disabled');
  strictEqual(pager.children[2].getAttribute('disabled'), 'disabled',
    '1 is disabled');
  notOk(pager.children[3].getAttribute('disabled'), '2 is not disabled');
  notOk(pager.children[4].getAttribute('disabled'), '3 is not disabled');
  notOk(pager.children[5].getAttribute('disabled'), '4 is not disabled');
  notOk(pager.children[6].getAttribute('disabled'), '5 is not disabled');
  notOk(pager.children[7].getAttribute('disabled'), 'Next is not disabled');
  notOk(pager.children[8].getAttribute('disabled'), 'Last is not disabled');
});
test('Dable multi page Pager Last button works', function() {
  //Given: a Dable with a multi page Pager
  var dable = makePagerDable(testDiv);

  //When: we click on Last and check the first cell of the table
  testDiv.children[2].children[1].children[8].children[0].click();
  var firstCell = testDiv.querySelector('td');
  var pager = testDiv.children[2].children[1];

  //Then: we see the last page
  strictEqual(dable.pageNumber, 9, 'Current page is 9');
  strictEqual(firstCell.innerHTML, '19', 'First cell contains 19');
  strictEqual(pager.children[2].children[0].innerHTML, '6');
  strictEqual(pager.children[3].children[0].innerHTML, '7');
  strictEqual(pager.children[4].children[0].innerHTML, '8');
  strictEqual(pager.children[5].children[0].innerHTML, '9');
  strictEqual(pager.children[6].children[0].innerHTML, '10');
  //Attributes
  notOk(pager.children[0].getAttribute('disabled'), 'First is not disabled');
  notOk(pager.children[1].getAttribute('disabled'), 'Prev is not disabled');
  notOk(pager.children[2].getAttribute('disabled'), '6 is not disabled');
  notOk(pager.children[3].getAttribute('disabled'), '7 is not disabled');
  notOk(pager.children[4].getAttribute('disabled'), '8 is not disabled');
  notOk(pager.children[5].getAttribute('disabled'), '9 is not disabled');
  strictEqual(pager.children[6].getAttribute('disabled'), 'disabled',
    '10 is disabled');
  strictEqual(pager.children[7].getAttribute('disabled'), 'disabled',
    'Next is disabled');
  strictEqual(pager.children[8].getAttribute('disabled'), 'disabled',
    'Last is disabled');
});
test('Dable multi page Pager go to page 5 works', function() {
  //Given: a Dable with a multi page Pager
  var dable = makePagerDable(testDiv);

  //When: we click on 5 and check the first cell of the table
  testDiv.children[2].children[1].children[6].children[0].click();
  var firstCell = testDiv.querySelector('td');
  var pager = testDiv.children[2].children[1];

  //Then: we see the 5th page
  strictEqual(dable.pageNumber, 4, 'Current page is 4');
  strictEqual(firstCell.innerHTML, '9', 'First cell contains 9');
  strictEqual(pager.children[2].children[0].innerHTML, '3');
  strictEqual(pager.children[3].children[0].innerHTML, '4');
  strictEqual(pager.children[4].children[0].innerHTML, '5');
  strictEqual(pager.children[5].children[0].innerHTML, '6');
  strictEqual(pager.children[6].children[0].innerHTML, '7');
  //Attributes
  notOk(pager.children[0].getAttribute('disabled'), 'First is not disabled');
  notOk(pager.children[1].getAttribute('disabled'), 'Prev is not disabled');
  notOk(pager.children[2].getAttribute('disabled'), '3 is not disabled');
  notOk(pager.children[3].getAttribute('disabled'), '4 is not disabled');
  strictEqual(pager.children[4].getAttribute('disabled'), 'disabled',
    '5 is disabled');
  notOk(pager.children[5].getAttribute('disabled'), '6 is not disabled');
  notOk(pager.children[6].getAttribute('disabled'), '7 is not disabled');
  notOk(pager.children[7].getAttribute('disabled'), 'Next is not disabled');
  notOk(pager.children[8].getAttribute('disabled'), 'Last is not disabled');
});
test('Dable multi page Pager First button works', function() {
  //Given: a Dable with a multi page Pager and go to page 5
  var dable = makePagerDable(testDiv);
  testDiv.children[2].children[1].children[6].children[0].click();

  //When: we click on First and check the first cell of the table
  testDiv.children[2].children[1].children[0].children[0].click();
  var firstCell = testDiv.querySelector('td');
  var pager = testDiv.children[2].children[1];

  //Then: we see the first page
  strictEqual(dable.pageNumber, 0, 'Current page is 0');
  strictEqual(firstCell.innerHTML, '1', 'First cell contains 1');
  strictEqual(pager.children[2].children[0].innerHTML, '1');
  strictEqual(pager.children[3].children[0].innerHTML, '2');
  strictEqual(pager.children[4].children[0].innerHTML, '3');
  strictEqual(pager.children[5].children[0].innerHTML, '4');
  strictEqual(pager.children[6].children[0].innerHTML, '5');
  //Attributes
  strictEqual(pager.children[0].getAttribute('disabled'), 'disabled',
    'First is disabled');
  strictEqual(pager.children[1].getAttribute('disabled'), 'disabled',
    'Prev is disabled');
  strictEqual(pager.children[2].getAttribute('disabled'), 'disabled',
    '1 is disabled');
  notOk(pager.children[3].getAttribute('disabled'), '2 is not disabled');
  notOk(pager.children[4].getAttribute('disabled'), '3 is not disabled');
  notOk(pager.children[5].getAttribute('disabled'), '4 is not disabled');
  notOk(pager.children[6].getAttribute('disabled'), '5 is not disabled');
  notOk(pager.children[7].getAttribute('disabled'), 'Next is not disabled');
  notOk(pager.children[8].getAttribute('disabled'), 'Last is not disabled');
});

module('Style Tests');
test('Dable with style="none" has basic elements', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable
  // eslint-disable-next-line no-unused-vars
  var dable = new Dable(testDiv.id); // jshint ignore:line

  //Then: we see the elements we expect
  //Element pattern
  strictEqual(testDiv.children.length, 3);
  var header = testDiv.children[0];
  var pager = header.children[0];
  var pageSelect = pager.children[1];
  var search = header.children[1];
  var table = testDiv.querySelector('table');
  var headRow = table.children[0].children[0];
  var tbody = table.children[1];
  var footer = testDiv.children[2];
  strictEqual(header.children.length, 3);
  strictEqual(pager.children.length, 2);
  strictEqual(pager.children[0].children.length, 0);
  strictEqual(pageSelect.children.length, 4);
  strictEqual(pageSelect.children[0].children.length, 0);
  strictEqual(pageSelect.children[1].children.length, 0);
  strictEqual(pageSelect.children[2].children.length, 0);
  strictEqual(pageSelect.children[3].children.length, 0);
  strictEqual(search.children.length, 2);
  strictEqual(search.children[0].children.length, 0);
  strictEqual(search.children[1].children.length, 0);
  strictEqual(header.children[2].children.length, 0);
  strictEqual(footer.children.length, 3);
  strictEqual(footer.children[0].children.length, 1);
  strictEqual(footer.children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children.length, 2);
  strictEqual(footer.children[1].children[0].children.length, 1);
  strictEqual(footer.children[1].children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children[1].children[0].children.length, 0);
  strictEqual(footer.children[2].children.length, 0);
  strictEqual(table.children.length, 2);
  strictEqual(table.children[0].children.length, 1);
  strictEqual(headRow.children.length, 4);
  strictEqual(headRow.children[0].children.length, 3);
  strictEqual(headRow.children[1].children.length, 3);
  strictEqual(headRow.children[2].children.length, 3);
  strictEqual(headRow.children[3].children.length, 3);
  strictEqual(headRow.children[0].children[0].children.length, 0);
  strictEqual(headRow.children[1].children[0].children.length, 0);
  strictEqual(headRow.children[2].children[0].children.length, 0);
  strictEqual(headRow.children[3].children[0].children.length, 0);
  strictEqual(headRow.children[0].children[1].children.length, 0);
  strictEqual(headRow.children[1].children[1].children.length, 0);
  strictEqual(headRow.children[2].children[1].children.length, 0);
  strictEqual(headRow.children[3].children[1].children.length, 0);
  strictEqual(headRow.children[0].children[2].children.length, 0);
  strictEqual(headRow.children[1].children[2].children.length, 0);
  strictEqual(headRow.children[2].children[2].children.length, 0);
  strictEqual(headRow.children[3].children[2].children.length, 0);
  strictEqual(tbody.children.length, 10);
  strictEqual(tbody.children[0].children.length, 4);
  strictEqual(tbody.children[0].children[0].children.length, 0);
  strictEqual(tbody.children[0].children[1].children.length, 0);
  strictEqual(tbody.children[0].children[2].children.length, 0);
  strictEqual(tbody.children[0].children[3].children.length, 0);
  //IDs
  strictEqual(header.id, testDiv.id + '_header');
  strictEqual(footer.id, testDiv.id + '_footer');
  strictEqual(search.children[1].id, testDiv.id + '_search');
  strictEqual(footer.children[0].children[0].id, testDiv.id + '_showing');
  strictEqual(footer.children[1].children[0].id, testDiv.id + '_page_prev');
  strictEqual(footer.children[1].children[1].id, testDiv.id + '_page_next');
  strictEqual(tbody.id, testDiv.id + '_body');
  //Text
  strictEqual(pager.children[0].innerHTML, 'Show ');
  strictEqual(search.children[0].innerHTML, 'Search ');
  strictEqual(footer.children[0].children[0].innerHTML,
    'Showing 1 to 10 of 20 entries');
  strictEqual(pageSelect.children[0].innerHTML, '10');
  strictEqual(pageSelect.children[1].innerHTML, '25');
  strictEqual(pageSelect.children[2].innerHTML, '50');
  strictEqual(pageSelect.children[3].innerHTML, '100');
  strictEqual(footer.children[1].children[0].children[0].innerHTML, 'Prev');
  strictEqual(footer.children[1].children[1].children[0].innerHTML, 'Next');
  strictEqual(headRow.children[0].children[0].innerHTML, 'Column 0 ');
  strictEqual(headRow.children[1].children[0].innerHTML, 'Column 1 ');
  strictEqual(headRow.children[2].children[0].innerHTML, 'Column 2 ');
  strictEqual(headRow.children[3].children[0].innerHTML, 'Column 3 ');
  strictEqual(tbody.children[0].children[0].innerHTML, '0');
  strictEqual(tbody.children[0].children[1].innerHTML, '1');
  strictEqual(tbody.children[0].children[2].innerHTML, '2');
  strictEqual(tbody.children[0].children[3].innerHTML, '3');
  //Values
  strictEqual(pageSelect.children[0].value, '10');
  strictEqual(pageSelect.children[1].value, '25');
  strictEqual(pageSelect.children[2].value, '50');
  strictEqual(pageSelect.children[3].value, '100');
  //Styles
  strictEqual(table.style.width, '100%');
  strictEqual(header.style.padding, '5px');
  strictEqual(footer.style.padding, '5px');
  var myTest = pager.style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = search.style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(header.children[2].style.clear, 'both');
  myTest = footer.children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = footer.children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(footer.children[1].style.listStyleType, 'none');
  strictEqual(footer.children[2].style.clear, 'both');
  strictEqual(footer.children[1].children[0].style.display, 'inline');
  strictEqual(footer.children[1].children[1].style.display, 'inline');
  strictEqual(footer.children[1].children[0].style.marginRight, '5px');
  strictEqual(footer.children[1].children[1].style.marginRight, '5px');
  strictEqual(headRow.children[0].style.padding, '5px');
  strictEqual(headRow.children[1].style.padding, '5px');
  strictEqual(headRow.children[2].style.padding, '5px');
  strictEqual(headRow.children[3].style.padding, '5px');
  myTest = headRow.children[0].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[0].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[0].children[2].style.clear, 'both');
  myTest = headRow.children[1].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[1].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[1].children[2].style.clear, 'both');
  myTest = headRow.children[2].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[2].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[2].children[2].style.clear, 'both');
  myTest = headRow.children[3].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[3].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[3].children[2].style.clear, 'both');
  strictEqual(rgb2hex(tbody.children[0].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[1].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[2].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[3].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[4].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[5].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[6].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[7].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[8].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[9].style.backgroundColor, 'white');
  strictEqual(tbody.children[0].children[0].style.padding, '5px');
  strictEqual(tbody.children[0].children[1].style.padding, '5px');
  strictEqual(tbody.children[0].children[2].style.padding, '5px');
  strictEqual(tbody.children[0].children[3].style.padding, '5px');
  //Classes
  strictEqual(footer.children[1].children[0].className, 'table-page');
  strictEqual(footer.children[1].children[1].className, 'table-page');
  strictEqual(headRow.children[0].children[1].className, 'table-sort');
  strictEqual(headRow.children[1].children[1].className, 'table-sort');
  strictEqual(headRow.children[2].children[1].className, 'table-sort');
  strictEqual(headRow.children[3].children[1].className, 'table-sort');
  strictEqual(tbody.children[0].className, 'table-row-even');
  strictEqual(tbody.children[1].className, 'table-row-odd');
  strictEqual(tbody.children[2].className, 'table-row-even');
  strictEqual(tbody.children[3].className, 'table-row-odd');
  strictEqual(tbody.children[4].className, 'table-row-even');
  strictEqual(tbody.children[5].className, 'table-row-odd');
  strictEqual(tbody.children[6].className, 'table-row-even');
  strictEqual(tbody.children[7].className, 'table-row-odd');
  strictEqual(tbody.children[8].className, 'table-row-even');
  strictEqual(tbody.children[9].className, 'table-row-odd');
  //State
  strictEqual(footer.children[1].children[0].getAttribute('disabled'),
    'disabled');
});
test('Dable with style="clear" has basic elements but no style', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable with style 'clear'
  var dable = new Dable(testDiv.id);
  dable.style = 'clear';
  dable.UpdateStyle();

  //Then: we see the elements we expect
  //Element pattern
  strictEqual(testDiv.children.length, 3);
  var header = testDiv.children[0];
  var pager = header.children[0];
  var pageSelect = pager.children[1];
  var search = header.children[1];
  var table = testDiv.querySelector('table');
  var headRow = table.children[0].children[0];
  var tbody = table.children[1];
  var footer = testDiv.children[2];
  strictEqual(header.children.length, 3);
  strictEqual(pager.children.length, 2);
  strictEqual(pager.children[0].children.length, 0);
  strictEqual(pageSelect.children.length, 4);
  strictEqual(pageSelect.children[0].children.length, 0);
  strictEqual(pageSelect.children[1].children.length, 0);
  strictEqual(pageSelect.children[2].children.length, 0);
  strictEqual(pageSelect.children[3].children.length, 0);
  strictEqual(search.children.length, 2);
  strictEqual(search.children[0].children.length, 0);
  strictEqual(search.children[1].children.length, 0);
  strictEqual(header.children[2].children.length, 0);
  strictEqual(footer.children.length, 3);
  strictEqual(footer.children[0].children.length, 1);
  strictEqual(footer.children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children.length, 2);
  strictEqual(footer.children[1].children[0].children.length, 1);
  strictEqual(footer.children[1].children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children[1].children[0].children.length, 0);
  strictEqual(footer.children[2].children.length, 0);
  strictEqual(table.children.length, 2);
  strictEqual(table.children[0].children.length, 1);
  strictEqual(headRow.children.length, 4);
  strictEqual(headRow.children[0].children.length, 3);
  strictEqual(headRow.children[1].children.length, 3);
  strictEqual(headRow.children[2].children.length, 3);
  strictEqual(headRow.children[3].children.length, 3);
  strictEqual(headRow.children[0].children[0].children.length, 0);
  strictEqual(headRow.children[1].children[0].children.length, 0);
  strictEqual(headRow.children[2].children[0].children.length, 0);
  strictEqual(headRow.children[3].children[0].children.length, 0);
  strictEqual(headRow.children[0].children[1].children.length, 0);
  strictEqual(headRow.children[1].children[1].children.length, 0);
  strictEqual(headRow.children[2].children[1].children.length, 0);
  strictEqual(headRow.children[3].children[1].children.length, 0);
  strictEqual(headRow.children[0].children[2].children.length, 0);
  strictEqual(headRow.children[1].children[2].children.length, 0);
  strictEqual(headRow.children[2].children[2].children.length, 0);
  strictEqual(headRow.children[3].children[2].children.length, 0);
  strictEqual(tbody.children.length, 10);
  strictEqual(tbody.children[0].children.length, 4);
  strictEqual(tbody.children[0].children[0].children.length, 0);
  strictEqual(tbody.children[0].children[1].children.length, 0);
  strictEqual(tbody.children[0].children[2].children.length, 0);
  strictEqual(tbody.children[0].children[3].children.length, 0);
  //IDs
  strictEqual(header.id, testDiv.id + '_header');
  strictEqual(footer.id, testDiv.id + '_footer');
  strictEqual(search.children[1].id, testDiv.id + '_search');
  strictEqual(footer.children[0].children[0].id, testDiv.id + '_showing');
  strictEqual(footer.children[1].children[0].id, testDiv.id + '_page_prev');
  strictEqual(footer.children[1].children[1].id, testDiv.id + '_page_next');
  strictEqual(tbody.id, testDiv.id + '_body');
  //Text
  strictEqual(pager.children[0].innerHTML, 'Show ');
  strictEqual(search.children[0].innerHTML, 'Search ');
  strictEqual(footer.children[0].children[0].innerHTML,
    'Showing 1 to 10 of 20 entries');
  strictEqual(pageSelect.children[0].innerHTML, '10');
  strictEqual(pageSelect.children[1].innerHTML, '25');
  strictEqual(pageSelect.children[2].innerHTML, '50');
  strictEqual(pageSelect.children[3].innerHTML, '100');
  strictEqual(footer.children[1].children[0].children[0].innerHTML, 'Prev');
  strictEqual(footer.children[1].children[1].children[0].innerHTML, 'Next');
  strictEqual(headRow.children[0].children[0].innerHTML, 'Column 0 ');
  strictEqual(headRow.children[1].children[0].innerHTML, 'Column 1 ');
  strictEqual(headRow.children[2].children[0].innerHTML, 'Column 2 ');
  strictEqual(headRow.children[3].children[0].innerHTML, 'Column 3 ');
  strictEqual(tbody.children[0].children[0].innerHTML, '0');
  strictEqual(tbody.children[0].children[1].innerHTML, '1');
  strictEqual(tbody.children[0].children[2].innerHTML, '2');
  strictEqual(tbody.children[0].children[3].innerHTML, '3');
  //Values
  strictEqual(pageSelect.children[0].value, '10');
  strictEqual(pageSelect.children[1].value, '25');
  strictEqual(pageSelect.children[2].value, '50');
  strictEqual(pageSelect.children[3].value, '100');
  //Styles
  strictEqual(table.style.width, '', 'table.style.width');
  strictEqual(header.style.padding, '');
  strictEqual(footer.style.padding, '');
  strictEqual(floatStyle(pager.style), '', 'pager.style.float');
  strictEqual(floatStyle(search.style), '');
  strictEqual(header.children[2].style.clear, '');
  strictEqual(floatStyle(footer.children[0].style), '');
  strictEqual(floatStyle(footer.children[1].style), '');
  strictEqual(footer.children[1].style.listStyle, '');
  strictEqual(footer.children[2].style.clear, '');
  strictEqual(footer.children[1].children[0].style.display, '');
  strictEqual(footer.children[1].children[1].style.display, '');
  strictEqual(footer.children[1].children[0].style.marginRight, '');
  strictEqual(footer.children[1].children[1].style.marginRight, '');
  strictEqual(headRow.children[0].style.padding, '');
  strictEqual(headRow.children[1].style.padding, '');
  strictEqual(headRow.children[2].style.padding, '');
  strictEqual(headRow.children[3].style.padding, '');
  var myTest = headRow.children[0].children[0].style;
  strictEqual(floatStyle(myTest), '');
  myTest = headRow.children[0].children[1].style;
  strictEqual(floatStyle(myTest), '');
  strictEqual(headRow.children[0].children[2].style.clear, '');
  myTest = headRow.children[1].children[0].style;
  strictEqual(floatStyle(myTest), '');
  myTest = headRow.children[1].children[1].style;
  strictEqual(floatStyle(myTest), '');
  strictEqual(headRow.children[1].children[2].style.clear, '');
  myTest = headRow.children[2].children[0].style;
  strictEqual(floatStyle(myTest), '');
  myTest = headRow.children[2].children[1].style;
  strictEqual(floatStyle(myTest), '');
  strictEqual(headRow.children[2].children[2].style.clear, '');
  myTest = headRow.children[3].children[0].style;
  strictEqual(floatStyle(myTest), '');
  myTest = headRow.children[3].children[1].style;
  strictEqual(floatStyle(myTest), '');
  strictEqual(headRow.children[3].children[2].style.clear, '');
  strictEqual(rgb2hex(tbody.children[0].style.backgroundColor), '');
  strictEqual(tbody.children[1].style.backgroundColor, '');
  strictEqual(rgb2hex(tbody.children[2].style.backgroundColor), '');
  strictEqual(tbody.children[3].style.backgroundColor, '');
  strictEqual(rgb2hex(tbody.children[4].style.backgroundColor), '');
  strictEqual(tbody.children[5].style.backgroundColor, '');
  strictEqual(rgb2hex(tbody.children[6].style.backgroundColor), '');
  strictEqual(tbody.children[7].style.backgroundColor, '');
  strictEqual(rgb2hex(tbody.children[8].style.backgroundColor), '');
  strictEqual(tbody.children[9].style.backgroundColor, '');
  strictEqual(tbody.children[0].children[0].style.padding, '');
  strictEqual(tbody.children[0].children[1].style.padding, '');
  strictEqual(tbody.children[0].children[2].style.padding, '');
  strictEqual(tbody.children[0].children[3].style.padding, '');
  //Classes
  strictEqual(footer.children[1].children[0].className, 'table-page');
  strictEqual(footer.children[1].children[1].className, 'table-page');
  strictEqual(headRow.children[0].children[1].className, 'table-sort');
  strictEqual(headRow.children[1].children[1].className, 'table-sort');
  strictEqual(headRow.children[2].children[1].className, 'table-sort');
  strictEqual(headRow.children[3].children[1].className, 'table-sort');
  strictEqual(tbody.children[0].className, 'table-row-even');
  strictEqual(tbody.children[1].className, 'table-row-odd');
  strictEqual(tbody.children[2].className, 'table-row-even');
  strictEqual(tbody.children[3].className, 'table-row-odd');
  strictEqual(tbody.children[4].className, 'table-row-even');
  strictEqual(tbody.children[5].className, 'table-row-odd');
  strictEqual(tbody.children[6].className, 'table-row-even');
  strictEqual(tbody.children[7].className, 'table-row-odd');
  strictEqual(tbody.children[8].className, 'table-row-even');
  strictEqual(tbody.children[9].className, 'table-row-odd');
  //State
  strictEqual(footer.children[1].children[0].getAttribute('disabled'),
    'disabled');
});
test('Dable with style="bootstrap" has basic elements and slightly ' +
    'different styling and classes', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable
  var dable = new Dable(testDiv.id);
  dable.style = 'bootstrap';
  dable.UpdateStyle();

  //Then: we see the elements we expect
  //Element pattern
  strictEqual(testDiv.children.length, 3);
  var header = testDiv.children[0];
  var pager = header.children[0];
  var pageSelect = pager.children[1];
  var search = header.children[1];
  var table = testDiv.querySelector('table');
  var headRow = table.children[0].children[0];
  var tbody = table.children[1];
  var footer = testDiv.children[2];
  strictEqual(header.children.length, 3);
  strictEqual(pager.children.length, 2);
  strictEqual(pager.children[0].children.length, 0);
  strictEqual(pageSelect.children.length, 4);
  strictEqual(pageSelect.children[0].children.length, 0);
  strictEqual(pageSelect.children[1].children.length, 0);
  strictEqual(pageSelect.children[2].children.length, 0);
  strictEqual(pageSelect.children[3].children.length, 0);
  strictEqual(search.children.length, 2);
  strictEqual(search.children[0].children.length, 0);
  strictEqual(search.children[1].children.length, 0);
  strictEqual(header.children[2].children.length, 0);
  strictEqual(footer.children.length, 3);
  strictEqual(footer.children[0].children.length, 1);
  strictEqual(footer.children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children.length, 2);
  strictEqual(footer.children[1].children[0].children.length, 1);
  strictEqual(footer.children[1].children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children[1].children[0].children.length, 0);
  strictEqual(footer.children[2].children.length, 0);
  strictEqual(table.children.length, 2);
  strictEqual(table.children[0].children.length, 1);
  strictEqual(headRow.children.length, 4);
  strictEqual(headRow.children[0].children.length, 3);
  strictEqual(headRow.children[1].children.length, 3);
  strictEqual(headRow.children[2].children.length, 3);
  strictEqual(headRow.children[3].children.length, 3);
  strictEqual(headRow.children[0].children[0].children.length, 0);
  strictEqual(headRow.children[1].children[0].children.length, 0);
  strictEqual(headRow.children[2].children[0].children.length, 0);
  strictEqual(headRow.children[3].children[0].children.length, 0);
  strictEqual(headRow.children[0].children[1].children.length, 0);
  strictEqual(headRow.children[1].children[1].children.length, 0);
  strictEqual(headRow.children[2].children[1].children.length, 0);
  strictEqual(headRow.children[3].children[1].children.length, 0);
  strictEqual(headRow.children[0].children[2].children.length, 0);
  strictEqual(headRow.children[1].children[2].children.length, 0);
  strictEqual(headRow.children[2].children[2].children.length, 0);
  strictEqual(headRow.children[3].children[2].children.length, 0);
  strictEqual(tbody.children.length, 10);
  strictEqual(tbody.children[0].children.length, 4);
  strictEqual(tbody.children[0].children[0].children.length, 0);
  strictEqual(tbody.children[0].children[1].children.length, 0);
  strictEqual(tbody.children[0].children[2].children.length, 0);
  strictEqual(tbody.children[0].children[3].children.length, 0);
  //IDs
  strictEqual(header.id, testDiv.id + '_header');
  strictEqual(footer.id, testDiv.id + '_footer');
  strictEqual(search.children[1].id, testDiv.id + '_search');
  strictEqual(footer.children[0].children[0].id, testDiv.id + '_showing');
  strictEqual(footer.children[1].children[0].id, testDiv.id + '_page_prev');
  strictEqual(footer.children[1].children[1].id, testDiv.id + '_page_next');
  strictEqual(tbody.id, testDiv.id + '_body');
  //Text
  strictEqual(pager.children[0].innerHTML, 'Show ');
  strictEqual(search.children[0].innerHTML, 'Search ');
  strictEqual(footer.children[0].children[0].innerHTML,
    'Showing 1 to 10 of 20 entries');
  strictEqual(pageSelect.children[0].innerHTML, '10');
  strictEqual(pageSelect.children[1].innerHTML, '25');
  strictEqual(pageSelect.children[2].innerHTML, '50');
  strictEqual(pageSelect.children[3].innerHTML, '100');
  // different from default
  strictEqual(footer.children[1].children[0].children[0].innerHTML, '');
  strictEqual(footer.children[1].children[1].children[0].innerHTML, '');
  // /different
  strictEqual(headRow.children[0].children[0].innerHTML, 'Column 0 ');
  strictEqual(headRow.children[1].children[0].innerHTML, 'Column 1 ');
  strictEqual(headRow.children[2].children[0].innerHTML, 'Column 2 ');
  strictEqual(headRow.children[3].children[0].innerHTML, 'Column 3 ');
  strictEqual(tbody.children[0].children[0].innerHTML, '0');
  strictEqual(tbody.children[0].children[1].innerHTML, '1');
  strictEqual(tbody.children[0].children[2].innerHTML, '2');
  strictEqual(tbody.children[0].children[3].innerHTML, '3');
  //Values
  strictEqual(pageSelect.children[0].value, '10');
  strictEqual(pageSelect.children[1].value, '25');
  strictEqual(pageSelect.children[2].value, '50');
  strictEqual(pageSelect.children[3].value, '100');
  //Styles
  strictEqual(table.style.width, '100%');
  strictEqual(header.style.padding, '5px');
  strictEqual(footer.style.padding, '5px');
  var myTest = pager.style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = search.style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(header.children[2].style.clear, 'both');
  myTest = footer.children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = footer.children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(footer.children[1].style.listStyleType, 'none');
  strictEqual(footer.children[2].style.clear, 'both');
  // different from default
  strictEqual(footer.children[1].children[0].style.display, '');
  strictEqual(footer.children[1].children[1].style.display, '');
  strictEqual(footer.children[1].children[0].style.marginRight, '');
  strictEqual(footer.children[1].children[1].style.marginRight, '');
  // /different
  strictEqual(headRow.children[0].style.padding, '5px');
  strictEqual(headRow.children[1].style.padding, '5px');
  strictEqual(headRow.children[2].style.padding, '5px');
  strictEqual(headRow.children[3].style.padding, '5px');
  myTest = headRow.children[0].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[0].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[0].children[2].style.clear, 'both');
  myTest = headRow.children[1].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[1].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[1].children[2].style.clear, 'both');
  myTest = headRow.children[2].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[2].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[2].children[2].style.clear, 'both');
  myTest = headRow.children[3].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[3].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[3].children[2].style.clear, 'both');
  // different from default
  strictEqual(tbody.children[0].style.backgroundColor, '');
  strictEqual(tbody.children[1].style.backgroundColor, '');
  strictEqual(tbody.children[2].style.backgroundColor, '');
  strictEqual(tbody.children[3].style.backgroundColor, '');
  strictEqual(tbody.children[4].style.backgroundColor, '');
  strictEqual(tbody.children[5].style.backgroundColor, '');
  strictEqual(tbody.children[6].style.backgroundColor, '');
  strictEqual(tbody.children[7].style.backgroundColor, '');
  strictEqual(tbody.children[8].style.backgroundColor, '');
  strictEqual(tbody.children[9].style.backgroundColor, '');
  // /different
  strictEqual(tbody.children[0].children[0].style.padding, '5px');
  strictEqual(tbody.children[0].children[1].style.padding, '5px');
  strictEqual(tbody.children[0].children[2].style.padding, '5px');
  strictEqual(tbody.children[0].children[3].style.padding, '5px');
  //Classes
  // different from default
  strictEqual(footer.children[1].children[0].className,
    'btn btn-default table-page');
  strictEqual(footer.children[1].children[1].className,
    'btn btn-default table-page');
  strictEqual(headRow.children[0].children[1].className, 'table-sort');
  strictEqual(headRow.children[1].children[1].className, 'table-sort');
  strictEqual(headRow.children[2].children[1].className, 'table-sort');
  strictEqual(headRow.children[3].children[1].className, 'table-sort');
  // /different
  strictEqual(tbody.children[0].className, 'table-row-even');
  strictEqual(tbody.children[1].className, 'table-row-odd');
  strictEqual(tbody.children[2].className, 'table-row-even');
  strictEqual(tbody.children[3].className, 'table-row-odd');
  strictEqual(tbody.children[4].className, 'table-row-even');
  strictEqual(tbody.children[5].className, 'table-row-odd');
  strictEqual(tbody.children[6].className, 'table-row-even');
  strictEqual(tbody.children[7].className, 'table-row-odd');
  strictEqual(tbody.children[8].className, 'table-row-even');
  strictEqual(tbody.children[9].className, 'table-row-odd');
  //State
  strictEqual(footer.children[1].children[0].getAttribute('disabled'),
    'disabled');
});
test('Dable with style="JqueryUI" has basic elements and slightly ' +
    'different styling and classes', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable
  var dable = new Dable(testDiv.id);
  dable.style = 'JqueryUI';
  dable.UpdateStyle();

  //Then: we see the elements we expect
  //Element pattern
  strictEqual(testDiv.children.length, 3);
  var header = testDiv.children[0];
  var pager = header.children[0];
  var pageSelect = pager.children[1];
  var search = header.children[1];
  var table = testDiv.querySelector('table');
  var headRow = table.children[0].children[0];
  var tbody = table.children[1];
  var footer = testDiv.children[2];
  strictEqual(header.children.length, 3);
  strictEqual(pager.children.length, 2);
  strictEqual(pager.children[0].children.length, 0);
  strictEqual(pageSelect.children.length, 4);
  strictEqual(pageSelect.children[0].children.length, 0);
  strictEqual(pageSelect.children[1].children.length, 0);
  strictEqual(pageSelect.children[2].children.length, 0);
  strictEqual(pageSelect.children[3].children.length, 0);
  strictEqual(search.children.length, 2);
  strictEqual(search.children[0].children.length, 0);
  strictEqual(search.children[1].children.length, 0);
  strictEqual(header.children[2].children.length, 0);
  strictEqual(footer.children.length, 3);
  strictEqual(footer.children[0].children.length, 1);
  strictEqual(footer.children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children.length, 2);
  strictEqual(footer.children[1].children[0].children.length, 1);
  strictEqual(footer.children[1].children[0].children[0].children.length, 0);
  strictEqual(footer.children[1].children[1].children[0].children.length, 0);
  strictEqual(footer.children[2].children.length, 0);
  strictEqual(table.children.length, 2);
  strictEqual(table.children[0].children.length, 1);
  strictEqual(headRow.children.length, 4);
  strictEqual(headRow.children[0].children.length, 3);
  strictEqual(headRow.children[1].children.length, 3);
  strictEqual(headRow.children[2].children.length, 3);
  strictEqual(headRow.children[3].children.length, 3);
  strictEqual(headRow.children[0].children[0].children.length, 0);
  strictEqual(headRow.children[1].children[0].children.length, 0);
  strictEqual(headRow.children[2].children[0].children.length, 0);
  strictEqual(headRow.children[3].children[0].children.length, 0);
  strictEqual(headRow.children[0].children[1].children.length, 0);
  strictEqual(headRow.children[1].children[1].children.length, 0);
  strictEqual(headRow.children[2].children[1].children.length, 0);
  strictEqual(headRow.children[3].children[1].children.length, 0);
  strictEqual(headRow.children[0].children[2].children.length, 0);
  strictEqual(headRow.children[1].children[2].children.length, 0);
  strictEqual(headRow.children[2].children[2].children.length, 0);
  strictEqual(headRow.children[3].children[2].children.length, 0);
  strictEqual(tbody.children.length, 10);
  strictEqual(tbody.children[0].children.length, 4);
  strictEqual(tbody.children[0].children[0].children.length, 0);
  strictEqual(tbody.children[0].children[1].children.length, 0);
  strictEqual(tbody.children[0].children[2].children.length, 0);
  strictEqual(tbody.children[0].children[3].children.length, 0);
  //IDs
  strictEqual(header.id, testDiv.id + '_header');
  strictEqual(footer.id, testDiv.id + '_footer');
  strictEqual(search.children[1].id, testDiv.id + '_search');
  strictEqual(footer.children[0].children[0].id, testDiv.id + '_showing');
  strictEqual(footer.children[1].children[0].id, testDiv.id + '_page_prev');
  strictEqual(footer.children[1].children[1].id, testDiv.id + '_page_next');
  strictEqual(tbody.id, testDiv.id + '_body');
  //Text
  strictEqual(pager.children[0].innerHTML, 'Show ');
  strictEqual(search.children[0].innerHTML, 'Search ');
  strictEqual(footer.children[0].children[0].innerHTML,
    'Showing 1 to 10 of 20 entries');
  strictEqual(pageSelect.children[0].innerHTML, '10');
  strictEqual(pageSelect.children[1].innerHTML, '25');
  strictEqual(pageSelect.children[2].innerHTML, '50');
  strictEqual(pageSelect.children[3].innerHTML, '100');
  // different from default
  strictEqual(footer.children[1].children[0].children[0].innerHTML, '');
  strictEqual(footer.children[1].children[1].children[0].innerHTML, '');
  // /different
  strictEqual(headRow.children[0].children[0].innerHTML, 'Column 0 ');
  strictEqual(headRow.children[1].children[0].innerHTML, 'Column 1 ');
  strictEqual(headRow.children[2].children[0].innerHTML, 'Column 2 ');
  strictEqual(headRow.children[3].children[0].innerHTML, 'Column 3 ');
  strictEqual(tbody.children[0].children[0].innerHTML, '0');
  strictEqual(tbody.children[0].children[1].innerHTML, '1');
  strictEqual(tbody.children[0].children[2].innerHTML, '2');
  strictEqual(tbody.children[0].children[3].innerHTML, '3');
  //Values
  strictEqual(pageSelect.children[0].value, '10');
  strictEqual(pageSelect.children[1].value, '25');
  strictEqual(pageSelect.children[2].value, '50');
  strictEqual(pageSelect.children[3].value, '100');
  //Styles
  strictEqual(table.style.width, '100%');
  strictEqual(header.style.padding, '5px');
  strictEqual(footer.style.padding, '5px');
  var myTest = pager.style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = search.style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(header.children[2].style.clear, 'both');
  myTest = footer.children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = footer.children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(footer.children[1].style.listStyleType, 'none');
  strictEqual(footer.children[2].style.clear, 'both');
  // different from default
  strictEqual(footer.children[1].children[0].style.display, '');
  strictEqual(footer.children[1].children[1].style.display, '');
  strictEqual(footer.children[1].children[0].style.marginRight, '');
  strictEqual(footer.children[1].children[1].style.marginRight, '');
  // /different
  strictEqual(headRow.children[0].style.padding, '5px');
  strictEqual(headRow.children[1].style.padding, '5px');
  strictEqual(headRow.children[2].style.padding, '5px');
  strictEqual(headRow.children[3].style.padding, '5px');
  myTest = headRow.children[0].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[0].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[0].children[2].style.clear, 'both');
  myTest = headRow.children[1].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[1].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[1].children[2].style.clear, 'both');
  myTest = headRow.children[2].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[2].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[2].children[2].style.clear, 'both');
  myTest = headRow.children[3].children[0].style;
  strictEqual(floatStyle(myTest), 'left');
  myTest = headRow.children[3].children[1].style;
  strictEqual(floatStyle(myTest), 'right');
  strictEqual(headRow.children[3].children[2].style.clear, 'both');
  // different from default
  strictEqual(rgb2hex(tbody.children[0].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[1].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[2].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[3].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[4].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[5].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[6].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[7].style.backgroundColor, 'white');
  strictEqual(rgb2hex(tbody.children[8].style.backgroundColor), '#e2e4ff');
  strictEqual(tbody.children[9].style.backgroundColor, 'white');
  // /different
  strictEqual(tbody.children[0].children[0].style.padding, '5px');
  strictEqual(tbody.children[0].children[1].style.padding, '5px');
  strictEqual(tbody.children[0].children[2].style.padding, '5px');
  strictEqual(tbody.children[0].children[3].style.padding, '5px');
  //Classes
  // different from default
  strictEqual(footer.children[1].children[0].className,
    'fg-button ui-button ui-state-default ' +
    'ui-corner-left table-page ui-state-disabled');
  strictEqual(footer.children[1].children[1].className,
    'fg-button ui-button ui-state-default ui-corner-left table-page');
  strictEqual(headRow.children[0].children[1].className, 'table-sort');
  strictEqual(headRow.children[1].children[1].className, 'table-sort');
  strictEqual(headRow.children[2].children[1].className, 'table-sort');
  strictEqual(headRow.children[3].children[1].className, 'table-sort');
  // /different
  strictEqual(tbody.children[0].className, 'table-row-even');
  strictEqual(tbody.children[1].className, 'table-row-odd');
  strictEqual(tbody.children[2].className, 'table-row-even');
  strictEqual(tbody.children[3].className, 'table-row-odd');
  strictEqual(tbody.children[4].className, 'table-row-even');
  strictEqual(tbody.children[5].className, 'table-row-odd');
  strictEqual(tbody.children[6].className, 'table-row-even');
  strictEqual(tbody.children[7].className, 'table-row-odd');
  strictEqual(tbody.children[8].className, 'table-row-even');
  strictEqual(tbody.children[9].className, 'table-row-odd');
  //State
  strictEqual(footer.children[1].children[0].getAttribute('disabled'),
    'disabled');
});

module('Function Counts');
test('Creating an Dable from Data', function() {
  //Given: a spy on UpdateDisplayedRows, an empty dable, and some data for our Dable
  var dable = new Dable();
  sinon.spy(dable, 'UpdateDisplayedRows');
  sinon.spy(dable, 'UpdateStyle');
  var data = [[1, 2], [3, 4]];
  var columns = ['Odd', 'Even'];
  dable.SetDataAsRows(data);
  dable.SetColumnNames(columns);

  //When: we build the Dable
  dable.BuildAll(testDiv.id);

  //Then: We get the mock only called once
  strictEqual(dable.UpdateDisplayedRows.callCount, 1);
  strictEqual(dable.UpdateStyle.callCount, 1);
});
test('Creating a Dable from a table', function() {
  //Given: a spy on UpdateDisplayedRows, an empty dable, and a table full of data
  var dable = new Dable();
  sinon.spy(dable, 'UpdateDisplayedRows');
  sinon.spy(dable, 'UpdateStyle');
  makeSimpleTable(testDiv);

  //When: we build the Dable
  dable.BuildAll(testDiv.id);

  //Then: we get the mock only called once
  strictEqual(dable.UpdateDisplayedRows.callCount, 1);
  strictEqual(dable.UpdateStyle.callCount, 1);
});
test('Calling UpdateStyle', function() {
  //Given: a spy on UpdateDisplayedRows, and a dable built from a table
  var dable = new Dable();
  makeSimpleTable(testDiv);
  dable.BuildAll(testDiv.id);
  sinon.spy(dable, 'UpdateDisplayedRows');

  //When: we change the dable style and call UpdateStyle
  dable.UpdateStyle();

  //Then: the mock is never called
  strictEqual(dable.UpdateDisplayedRows.callCount, 0);
});
test('Calling UpdateDisplayedRows', function() {
  //Given: a spy on UpdateStyle, and a dable built from a table
  var dable = new Dable();
  makeSimpleTable(testDiv);
  dable.BuildAll(testDiv.id);
  sinon.spy(dable, 'UpdateStyle');

  //When: we change the dable style and call UpdateDisplayedRows
  dable.UpdateDisplayedRows();

  //Then: the mock is never called
  strictEqual(dable.UpdateStyle.callCount, 0);
});

module('Public Function Tests');
test('Dable Exists() returns true if Dable Exists', function() {
  //Given: a dable
  var dable = new Dable();
  makeSimpleTable(testDiv);
  dable.BuildAll(testDiv.id);

  //When: we call dable.Exists()
  var result = dable.Exists();

  //Then: we should get "true"
  ok(result);
});
test('Dable Exists() returns false if Dable doesnt exist', function() {
  //Given: an unbuilt dable
  var dable = new Dable();

  //When: we call dable.Exists()
  var result = dable.Exists();

  //Then: we should get "false"
  notOk(result);
});
test('Dable Exists(testDiv) returns true if Dable Exists', function() {
  //Given: a dable
  var dable = new Dable();
  makeSimpleTable(testDiv);
  dable.BuildAll(testDiv.id);

  //When: we call dable.Exists()
  var result = dable.Exists(testDiv);

  //Then: we should get "true"
  ok(result);
});
test('Dable Exists(testDiv) returns false if Dable doesnt exist', function() {
  //Given: an unbuilt dable
  var dable = new Dable();

  //When: we call dable.Exists()
  var result = dable.Exists(testDiv);

  //Then: we should get "false"
  notOk(result);
});
test('Dable Exists($(testDiv)) returns true if Dable Exists', function() {
  //Given: a dable
  var dable = new Dable();
  makeSimpleTable(testDiv);
  dable.BuildAll(testDiv.id);

  //When: we call dable.Exists()
  var result = dable.Exists($(testDiv));

  //Then: we should get "true"
  ok(result);
});
test('Dable Exists($(testDiv)) returns false if Dable doesnt exist',
  function() {
    //Given: an unbuilt dable
    var dable = new Dable();

    //When: we call dable.Exists()
    var result = dable.Exists($(testDiv));

    //Then: we should get "false"
    notOk(result);
  }
);
test('Dable Exists(testDiv.id) returns true if Dable Exists', function() {
  //Given: a dable
  var dable = new Dable();
  makeSimpleTable(testDiv);
  dable.BuildAll(testDiv.id);

  //When: we call dable.Exists()
  var result = dable.Exists(testDiv.id);

  //Then: we should get "true"
  ok(result);
});
test('Dable Exists(testDiv.id) returns false if Dable doesnt exist',
  function() {
    //Given: an unbuilt dable
    var dable = new Dable();

    //When: we call dable.Exists()
    var result = dable.Exists(testDiv.id);

    //Then: we should get "false"
    notOk(result);
  }
);

module('Header Tests');
test('Preselected Page Size Populates in the UI', function() {
  //Given: a dable with a specific selected page size
  var dable = new Dable();
  makeSimpleTable(testDiv);
  var selectedPageSize = 25;
  dable.pageSize = selectedPageSize;

  //When: we build the dable
  dable.BuildAll(testDiv.id);

  //Then: the dropdown value equals the selected page size
  var header = document.getElementById(testDiv.id + '_header');
  var pageSizeDropDown = header.querySelector('select');
  strictEqual(Number(
    pageSizeDropDown.options[pageSizeDropDown.selectedIndex].value),
    selectedPageSize);
});

module('Dable from HTML Tests');
test('With no thead the dable is not created', function() {
  //Given: a dable made from a table with no thead element
  var dable = new Dable();
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  for (var i = 0; i < 20; ++i) {
    var currentRow = row.cloneNode(false);
    for (var j = 0; j < 4; ++j) {
      var currentCell = cell.cloneNode(false);
      currentCell.innerHTML = (i + j).toString();
      currentRow.appendChild(currentCell);
    }
    tbody.appendChild(currentRow);
  }
  table.appendChild(tbody);
  testDiv.appendChild(table);

  //When: we build the dable
  dable.BuildAll(testDiv.id);

  //Then: we output an error message to the console
  strictEqual(consoleOutput, 'Dable Error: No thead element in table',
    'Output correct message to console.error');

  //Then: the dable doesn't exist
  // var dableHeader = document.getElementById(testDiv.id + '_header');
  notOk(dable.Exists(), 'the dable doesn\'t exist');
});
test('Creating a Dable from a jQuery table', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we build the Dable
  // eslint-disable-next-line no-unused-vars
  var dable = new Dable($(testDiv)); // jshint ignore:line

  //Then: we see the elements we expect
  //Element pattern
  strictEqual(testDiv.children.length, 3);
  var table = testDiv.querySelector('table');
  var footer = testDiv.children[2];
  strictEqual(footer.children[0].children[0].innerHTML,
    'Showing 1 to 10 of 20 entries');
  strictEqual(table.children[1].children[0].children[0].innerHTML, '0');
  strictEqual(table.children[1].children[0].children[1].innerHTML, '1');
  strictEqual(table.children[1].children[0].children[2].innerHTML, '2');
  strictEqual(table.children[1].children[0].children[3].innerHTML, '3');
});

module('Dable from nested HTML Tests');
test('basic Dable from nested HTML looks right', function() {
  //Given: a table
  var innerDiv = makeNestedTable(testDiv);

  //When: we make it a dable
  // eslint-disable-next-line no-unused-vars
  var dable = new Dable(innerDiv); // jshint ignore:line

  //Then: we see the elements we expect
  //Element pattern
  strictEqual(innerDiv.children.length, 3);
  var table = innerDiv.querySelector('table');
  var footer = innerDiv.children[2];
  strictEqual(footer.children[0].children[0].innerHTML,
    'Showing 1 to 10 of 20 entries');
  strictEqual(table.children[1].children[0].children[0].innerHTML, '0');
  strictEqual(table.children[1].children[0].children[1].innerHTML, '1');
  strictEqual(table.children[1].children[0].children[2].innerHTML, '2');
  strictEqual(table.children[1].children[0].children[3].innerHTML, '3');
});

module('Event Tests');
test('basic Dable integer ascending sort', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable and click on a header
  // eslint-disable-next-line no-unused-vars
  var dable = new Dable(testDiv); // jshint ignore:line
  var table = testDiv.querySelector('table');
  var theadRow = table.children[0].children[0];
  theadRow.children[0].children[0].click();

  //Then: we see the elements we expect
  strictEqual(theadRow.children[0].children[1].innerText.charCodeAt(0), 9650);
  strictEqual(table.children[1].children[0].children[0].innerText, '0');
});
test('basic Dable integer decending sort', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable and click on a header
  // eslint-disable-next-line no-unused-vars
  var dable = new Dable(testDiv); // jshint ignore:line
  var table = testDiv.querySelector('table');
  var theadRow = table.children[0].children[0];
  theadRow.children[0].children[0].click();
  theadRow.children[0].children[0].click();

  //Then: we see the elements we expect
  strictEqual(theadRow.children[0].children[1].innerText.charCodeAt(0), 9660);
  strictEqual(table.children[1].children[0].children[0].innerText, '19');
});
test('basic Dable search filter', function() {
  //Given: a table
  makeSimpleTable(testDiv);

  //When: we make it a dable and click on a header
  // eslint-disable-next-line no-unused-vars
  var dable = new Dable(testDiv); // jshint ignore:line
  var table = testDiv.querySelector('table');
  var search = testDiv.children[0].children[1].children[1];
  search.value = '11';
  triggerEvent(search, 'keyup');

  //Then: we see the elements we expect
  strictEqual(table.children[1].children[0].children[0].innerText, '8');
});
test('Ascending sort column 2 with sort disabled column 1', function() {
  //Given: a Dable with sorting turned off on column 1
  makeSimpleTable(testDiv);
  var dable = new Dable(testDiv);
  dable.columnData[0].CustomSortFunc = false;
  dable.BuildAll(testDiv);

  //When: we click on second header
  var table = testDiv.querySelector('table');
  var theadRow = table.children[0].children[0];
  theadRow.children[1].children[0].click();

  //Then: we see the elements we expect
  strictEqual(theadRow.children[1].children[1].innerText.charCodeAt(0), 9650);
  strictEqual(table.children[1].children[0].children[1].innerText, '1');
});
test('basic Dable US dates ascending sort', function() {
  //Given: a Dable
  makeCustomDable(testDiv);

  //When: we click on a header
  var table = testDiv.querySelector('table');
  var theadRow = table.children[0].children[0];
  theadRow.children[1].click();

  //Then: we see the elements we expect
  strictEqual(theadRow.children[1].children[1].innerText.charCodeAt(0), 9650);
  strictEqual(table.children[1].children[0].children[1].innerText, '1/1/2001');
});
test('basic Dable lexicographic ascending sort', function() {
  //Given: a Dable
  makeCustomDable(testDiv);

  //When: we click on a header
  var table = testDiv.querySelector('table');
  var theadRow = table.children[0].children[0];
  theadRow.children[2].click();

  //Then: we see the elements we expect
  strictEqual(theadRow.children[2].children[1].innerText.charCodeAt(0), 9650);
  strictEqual(table.children[1].children[0].children[2].innerText, 'Cat');
});
test('basic Dable custom ascending sort', function() {
  //Given: a Dable
  makeCustomDable(testDiv);

  //When: we click on a header
  var table = testDiv.querySelector('table');
  var theadRow = table.children[0].children[0];
  theadRow.children[3].click();

  //Then: we see the elements we expect
  strictEqual(theadRow.children[3].children[1].innerText.charCodeAt(0), 9650);
  strictEqual(table.children[1].children[0].children[3].innerText, 'First');
});
