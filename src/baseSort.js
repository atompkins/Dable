var splitDateRe = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2}(?:\d{2})?)$/;
var direction;
var isInt;
var isDate;
var newRowObjects;

function ifDate(val) {
  var datePartArray = splitDateRe.exec(val);
  if (datePartArray) {
    var month = ('0' + datePartArray[1]).slice(-2);
    var day = ('0' + datePartArray[2]).slice(-2);
    var year = ('20' + datePartArray[3]).slice(-4);
    return year + month + day;
  }
}

function detectDate(value, i) {
  isInt = false;
  var maybeDate = ifDate(value);
  if (maybeDate) {
    newRowObjects.push({index: i, sortkey: maybeDate});
  } else {
    isDate = false;
  }
}

function testCellContents(value, i) {
  var maybeInt = parseInt(value, 10);
  if (maybeInt.toString().toLowerCase() === 'nan') {
    isInt = false;
    isDate = false;
  } else if (value === maybeInt.toString()) {
    isDate = false;
    newRowObjects.push({index: i, sortkey: maybeInt});
  } else {
    detectDate(value, i);
  }
}

function detectColumnType(columnIndex, currentRowObjects) {
  var i = 0;
  while ((isInt || isDate) && i < currentRowObjects.length) {
    testCellContents(currentRowObjects[i].Row[columnIndex].toString(), i);
    i += 1;
  }
}

function lexSort(columnIndex, currentRowObjects) {
  return currentRowObjects.sort(function(a, b) {
    if (a.Row[columnIndex] > b.Row[columnIndex]) {
      return direction;
    } else if (a.Row[columnIndex] < b.Row[columnIndex]) {
      return -direction;
    }
    return 0;
  });
}

function hydrate(currentRowObjects) {
  var res = [];
  for (var i = 0; i < newRowObjects.length; i++) {
    res.push(currentRowObjects[newRowObjects[i].index]);
  }
  return res;
}

function schwTrans(currentRowObjects) {
  newRowObjects.sort(function(a, b) {
    if (a.sortkey > b.sortkey) {
      return direction;
    } else if (a.sortkey < b.sortkey) {
      return -direction;
    }
    return 0;
  });
  return hydrate(currentRowObjects);
}

export default function(columnIndex, ascending, currentRowObjects) {
  isInt = true;
  isDate = true;
  newRowObjects = [];
  detectColumnType(columnIndex, currentRowObjects);

  direction = -1;
  if (ascending) {direction = 1;}

  if (!isInt && !isDate) {
    return lexSort(columnIndex, currentRowObjects);
  }

  return schwTrans(currentRowObjects);
}
