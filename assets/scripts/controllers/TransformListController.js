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

var $transformListTemplate = $('.js-transformList-template');


// ==============================
// Event handlers
// ==============================

function onTransformAddClick(event) {
    var $button = $(event.currentTarget);
    var transformtype = $button.attr('data-transformtype');

    // update underlying model
    transformList.add(transformtype);

    // render output
    renderList();
}

function onTransformDeleteClick(event) {
    var $button = $(event.currentTarget);
    var $row = $button.parents('.js-transformList-row');

    var rowNumber = $row.index();

    // update underlying model
    transformList.remove(rowNumber);

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
    transformList.update(rowNumber, transformtype, arg1, arg2); 
}


function onTransformSort(event) {
    console.log('onTransformSort');

    transformList.removeAll();

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
    transformList.add(transformtype, arg1, arg2); 
}

function onTransformFocus(event) {
    var input = event.currentTarget;
    //input.select();
}

function renderList() {
    //transformList;
    console.log('renderList');

    var transforms = transformList.getTransforms();

    $transformList.empty();

    for (var i = 0; i < transforms.length; i++) {
        var transform = transforms[i];
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

    renderMatrix();
}
