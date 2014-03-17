
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

function renderCanvas() {
    var matrix = transformList.getMatrix();

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