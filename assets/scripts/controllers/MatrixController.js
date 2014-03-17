var $outputMatrixArray = $('.js-outputMatrixArray');
var $outputMatrix = $('.js-outputMatrix');

$outputMatrix.on('keyup', 'input', onMatrixKeyUp);
$outputMatrix.on('change', 'input', onMatrixChange);
$outputMatrix.on('focus', 'input', onMatrixFocus);

function onMatrixKeyUp(event) {
    console.log('onMatrixKeyUp');

    transformList.removeAll();

    var matrix = viewToMatrix();
    transformList.setMatrix(matrix);

    renderCanvas();
}

function onMatrixChange(event) {
    console.log('onMatrixChange');

    transformList.removeAll();

    var matrix = viewToMatrix();
    transformList.setMatrix(matrix);

    renderList();
}

function onMatrixFocus(event) {
    var input = event.currentTarget;
    //input.select();
}

function renderMatrix() {
    console.log('renderMatrix');

    var matrix = transformList.getMatrix();

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

function roundToPlace(number, decimalPlaces) {
    // plus sign drops any extra zeroes at the end
    var result = +parseFloat(number).toFixed(decimalPlaces); 
    return result;
}