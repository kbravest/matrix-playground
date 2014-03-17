
// ==============================
// Binding
// ==============================
var transformList = [];
var globalMatrix = [1,0,0,1,0,0];

var $transformButtons = $('.js-transformButtons');
$transformButtons.on('click', '.js-transformAdd', onTransformAddClick);

var $transformList = $('.js-transformList');
$transformList.on('click', '.js-transformDelete', onTransformDeleteClick);
$transformList.on('change', 'input', onTransformChange);
$transformList.on('keyup', 'input', onTransformKeyup);
$transformList.on('focus', 'input', onTransformFocus);

$transformList.sortable({
    forcePlaceholderSize: true
});
$transformList.sortable().bind('sortupdate', onTransformSort);

//$transformList.sortable();
/*
$('.sortable').sortable({
    handle: '.handle'
})
.bind('sortupdate', function() {
    console.log(123)
    //Triggered when the user stopped sorting and the DOM position has changed.
});
*/
//$transformList.on('sortupdate', onTransformSort);

var $transformListTemplate = $('.js-transformList-template');


var $outputMatrixArray = $('.js-outputMatrixArray');
var $outputMatrix = $('.js-outputMatrix');

$outputMatrix.on('keyup', 'input', onMatrixKeyUp);
$outputMatrix.on('change', 'input', onMatrixChange);
$outputMatrix.on('focus', 'input', onMatrixFocus);

var width = 75;
var height = 75;
var canvasWidth = 600;
var canvasHeight = 400;
var $canvas = $('.js-outputCanvas canvas');
$canvas
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);

var context = $canvas[0].getContext('2d');


var $img = $('<img/>');
$img.attr('src', 'assets/media/images/cat.jpg');

renderList();

// ==============================
// Event handlers
// ==============================

function onTransformAddClick(event) {
    var $button = $(event.currentTarget);
    var transformtype = $button.attr('data-transformtype');

    // update underlying model
    addRow(transformtype);

    // render output
    renderList();
}

function onTransformDeleteClick(event) {
    var $button = $(event.currentTarget);
    var $row = $button.parents('.js-transformList-row');

    var rowNumber = $row.index();

    // update underlying model
    removeRow(rowNumber);

    // render output
    renderList();
}

function onTransformChange(event) {
    console.log('onTransformChange');

    var $input = $(event.currentTarget);
    var $row = $input.parents('.js-transformList-row');

    updateRowFromView($row);

    // render output
    renderMatrix();
}

function onTransformKeyup(event) {
    console.log('onTransformKeyup');
    var $input = $(event.currentTarget);
    var $row = $input.parents('.js-transformList-row');

    updateRowFromView($row);

    // render output
    renderMatrix();
}
 

function updateRowFromView($row) {
    var rowNumber = $row.index();
    var $inputs = $row.find('input');

    var transformtype = $row.attr('data-transformtype');
    var arg1 = $inputs.eq(0).val();
    var arg2 = $inputs.eq(1).val();

    // update underlying model
    console.log(rowNumber, transformtype,  arg1, arg2)
    updateRow(rowNumber, transformtype, arg1, arg2); 
}


function onTransformSort(event) {
    console.log('onTransformSort');

    removeAllRows();

    var $rows = $transformList.find('.js-transformList-row');

    for (var i = 0; i < $rows.length; i++) {
        var $row = $rows.eq(i);
        addRowFromView($row)
    }

    renderMatrix();
};

function addRowFromView($row) {
    var rowNumber = $row.index();
    var $inputs = $row.find('input');

    var transformtype = $row.attr('data-transformtype');
    var arg1 = $inputs.eq(0).val();
    var arg2 = $inputs.eq(1).val();

    // update underlying model
    addRow(transformtype, arg1, arg2); 
}

function onTransformFocus(event) {
    var input = event.currentTarget;
    //input.select();
}

function onMatrixKeyUp(event) {
    console.log('onMatrixKeyUp');

    removeAllRows();

    globalMatrix = viewToMatrix();
    renderCanvas();
}

function onMatrixChange(event) {
    console.log('onMatrixChange');

    removeAllRows();

    globalMatrix = viewToMatrix();
    renderList();
}

function onMatrixFocus(event) {
    var input = event.currentTarget;
    //input.select();
}

// ==============================
// Render
// ==============================


function renderList() {
    //transformList;
    console.log('renderList');

    $transformList.empty();

    for (var i = 0; i < transformList.length; i++) {
        var transform = transformList[i];
        var type = transform.type;
        var arg1 = transform.arg1
        var arg2 = transform.arg2;

        var selector = "[data-transformtype='" + type + "']";
        var $template = $transformListTemplate.find(selector);

        var $transformClone = $template.clone(true);
        $inputs = $transformClone.find('input');
        $inputs.eq(0).val(arg1);
        $inputs.eq(1).val(arg2);

        $transformList.append($transformClone);
    }

    // Need to refresh the sortable
    // every time the list contents change
    $transformList.sortable();
    //$transformList.sortable('enable');

    renderMatrix();
}

function roundToPlace(num, decimals) {
    var result = +parseFloat(num).toFixed(decimals); // Note the plus sign that drops any "extra" zeroes at the end.
    return result;
}

function renderMatrix() {

    console.log('renderMatrix');

    var matrix = globalMatrix;

    var $a = $outputMatrix.find('[data-index="a"] input');
    var $b = $outputMatrix.find('[data-index="b"] input');
    var $c = $outputMatrix.find('[data-index="c"] input');
    var $d = $outputMatrix.find('[data-index="d"] input');
    var $e = $outputMatrix.find('[data-index="e"] input');
    var $f = $outputMatrix.find('[data-index="f"] input');

    $a.val(roundToPlace(matrix[0], 2));
    $b.val(roundToPlace(matrix[2], 2));
    $c.val(roundToPlace(matrix[4], 2));
    $d.val(roundToPlace(matrix[1], 2));
    $e.val(roundToPlace(matrix[3], 2));
    $f.val(roundToPlace(matrix[5], 2));

    renderCanvas();
}

function viewToMatrix() {
    var matrix = [];

    var $a = $outputMatrix.find('[data-index="a"] input');
    var $b = $outputMatrix.find('[data-index="b"] input');
    var $c = $outputMatrix.find('[data-index="c"] input');
    var $d = $outputMatrix.find('[data-index="d"] input');
    var $e = $outputMatrix.find('[data-index="e"] input');
    var $f = $outputMatrix.find('[data-index="f"] input');

    matrix[0] = $a.val();
    matrix[2] = $b.val();
    matrix[4] = $c.val();
    matrix[1] = $d.val();
    matrix[3] = $e.val();
    matrix[5] = $f.val();

    return matrix;
}


function renderCanvas() {
    var matrix = globalMatrix;

    var matrixRounded = [
        roundToPlace(matrix[0], 2), // a
        roundToPlace(matrix[1], 2), // d
        roundToPlace(matrix[2], 2), // b
        roundToPlace(matrix[3], 2), // e
        roundToPlace(matrix[4], 2), // c
        roundToPlace(matrix[5], 2)  // f
    ];

    var xExpression = [];
    xExpression.push(matrixRounded[0] == 0 ? '' : matrixRounded[0] + 'x');
    xExpression.push(matrixRounded[2] == 0 ? '' : matrixRounded[2] + 'y');
    xExpression.push(matrixRounded[4] == 0 ? '' : matrixRounded[4]);

    var yExpression = [];
    yExpression.push(matrixRounded[1] == 0 ? '' : matrixRounded[1] + 'x');
    yExpression.push(matrixRounded[3] == 0 ? '' : matrixRounded[3] + 'y');
    yExpression.push(matrixRounded[5] == 0 ? '' : matrixRounded[5]);

    var xExpressionString = '';
    for (var i = 0; i < xExpression.length; i++) {
        if (xExpression[i] !== '') {
            if (xExpressionString !== '') {
                xExpressionString += ' + ';
            }
            xExpressionString += xExpression[i];
        }
    }
    if(xExpressionString === '') { xExpressionString = 0; }

    var yExpressionString = '';
    for (var i = 0; i < yExpression.length; i++) {
        if (yExpression[i] !== '') {
            if (yExpressionString !== '') {
                yExpressionString += ' + ';
            }
            yExpressionString += yExpression[i];
        }
    }
    if(yExpressionString === '') { yExpressionString = 0; }

    $outputMatrix
        .find('[data-index="x"]')
        .text(xExpressionString);

    $outputMatrix
        .find('[data-index="y"]')
        .text(yExpressionString);

    $outputMatrixArray
        .text('context.setTransform(' + matrixRounded + ');');

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid before we do any other crazy transforms
    drawGrid();

    context.save();

    context.translate(
        canvasWidth / 2, 
        canvasHeight / 2
    );

    context.transform(
        matrix[0], // a
        matrix[1], // d
        matrix[2], // b
        matrix[3], // e
        matrix[4], // c
        matrix[5]  // f
    );

    drawAxis();

    context.restore();  
}

function drawAxis() {
    context.save();
    context.fillStyle = '#ff0000';
    context.fillRect(0, 0, width, height);

    if ($img[0].complete) {
        context.drawImage($img[0], 0, 0, width, height);
    }
    
    drawArrow(0, width * 1.8);
    drawArrow(90, width * 1.8);

    context.fillStyle = '#000000';
    context.fillText('(0,0)', -10, -5);
    context.restore();
}

function drawGrid() {
    context.save();

    context.strokeStyle = '#000000';
    context.lineWidth = '1';
    context.globalAlpha = 0.5;

    context.beginPath();
    context.moveTo(canvasWidth / 2, 0);
    context.lineTo(canvasWidth / 2 , canvasHeight);
    context.stroke();

    context.beginPath();
    context.moveTo(0, canvasHeight / 2);
    context.lineTo(canvasWidth, canvasHeight / 2);
    context.stroke();

    context.restore();
}

function drawArrow(deg, length) {
    context.save();

    context.strokeStyle = '#000000';
    context.lineWidth = '2';
    context.lineCap= 'round';

    context.rotate(deg * Math.PI / 180);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.stroke();

    context.moveTo(length, 0);
    context.lineTo(length - 5, -5);
    context.stroke();

    context.moveTo(length, 0);
    context.lineTo(length - 5, 5);
    context.stroke();

    context.restore();
}

// ==============================
// Transform List Model
// ==============================


function updateRow(rowNumber, transformtype, arg1, arg2) {
    
    var row = transformList[rowNumber];
    //if (row == null) return; //TODO fix this bug which occcurs after sorting

    row.transformtype = transformtype;
    row.arg1 = arg1;
    row.arg2 = arg2;

    recomputeMatrix();

    console.log('updateRow', rowNumber, arg1, arg2, transformList);
}

function addRow(transformtype, arg1, arg2) {
    //console.log('addRow', transformtype, transformList);

    if (arg1 == null && arg2 == null) {
        switch(transformtype) {
            case 'translate':
                arg1 = 0;
                arg2 = 0;
                break;

            case 'scale':
                arg1 = 1;
                arg2 = 1;
                break;

            case 'rotate':
                arg1 = 0;
                arg2 = 0;
                break;

            case 'shear':
                arg1 = 0;
                arg2 = 0;
                break;
        }
    }

    transformList.push(
        {
            type: transformtype,
            arg1: arg1, 
            arg2: arg2
        }
    );

    recomputeMatrix();

    
}

function removeAllRows() {
    transformList = [];

    recomputeMatrix();
}

function removeRow(rowNumber) {
    //console.log('removeRow', rowNumber, transformList);
    transformList.splice(rowNumber, 1);

    recomputeMatrix();
}

function setGlobalMatrix(matrix) {
    globalMatrix = matrix;
}

function recomputeMatrix() {

    var matrix = new Transform();

    for (var i = 0; i < transformList.length; i++) {
        var transform = transformList[i];

        //console.log(transform.type, transform.arg1, transform.arg2);

        switch(transform.type) {
            case 'translate':
                var x = transform.arg1;
                var y = transform.arg2;

                matrix.translate(x, y);
                break;

            case 'scale':
                var x = transform.arg1;
                var y = transform.arg2;

                matrix.scale(x, y);
                break;

            case 'rotate':
                var degrees = transform.arg1;

                matrix.rotateDegrees(degrees)
                break;

            case 'shear':
                var x = transform.arg1;
                var y = transform.arg2;

                matrix.shear(x, y);
                break;
        }
    }

    globalMatrix = matrix.getMatrix();
}
