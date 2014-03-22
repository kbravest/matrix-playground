angular.module('MatrixPlaygroundApp').directive('onBeforeRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last) {
               scope.$evalAsync(attr.onBeforeRender);
            }
        }
    }
});

angular.module('MatrixPlaygroundApp').directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $timeout(function() { 
                scope.$eval(attr.onFinishRender);
            });
        }
    }
});

angular.module('MatrixPlaygroundApp').directive('draw', function () {
    'use strict';

    var WIDTH = 75;
    var HEIGHT = 75;
    var CANVAS_WIDTH = 600;
    var CANVAS_HEIGHT = 400;
    var context = null;
    var $img = null;

    var init = function($scope, $element) {

        $scope.$watchCollection('matrix', function(newValue, oldValue) {
            renderCanvas(newValue);
        });

        $element[0].width = CANVAS_WIDTH;
        $element[0].height = CANVAS_HEIGHT;

        context = $element[0].getContext('2d');

        $img = $('<img/>');
        $img.attr('src', 'assets/media/images/cat.jpg');
    };

    var renderCanvas = function(matrix) {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid before we do any other crazy transforms
        renderGrid();

        context.save();

        // Center our stuff
        context.translate(
            CANVAS_WIDTH / 2, 
            CANVAS_HEIGHT / 2
        );

        // Apply the transform
        context.transform(
            matrix[0], // a
            matrix[1], // d
            matrix[2], // b
            matrix[3], // e
            matrix[4], // c
            matrix[5]  // f
        );

        renderSubject();

        context.restore();  
    }

    function renderSubject() {
        context.save();
        context.fillStyle = '#ff0000';
        context.fillRect(0, 0, WIDTH, HEIGHT);

        if ($img[0].complete) {
            context.drawImage($img[0], 0, 0, WIDTH, HEIGHT);
        }
        
        renderArrow(0, WIDTH * 1.8);
        renderArrow(90, WIDTH * 1.8);

        context.fillStyle = '#000000';
        context.fillText('(0,0)', -10, -5);
        context.restore();
    }

    function renderGrid() {
        context.save();

        context.strokeStyle = '#000000';
        context.lineWidth = '1';
        context.globalAlpha = 0.5;

        context.beginPath();
        context.moveTo(CANVAS_WIDTH / 2, 0);
        context.lineTo(CANVAS_WIDTH / 2 , CANVAS_HEIGHT);
        context.stroke();

        context.beginPath();
        context.moveTo(0, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
        context.stroke();

        context.restore();
    }

    function renderArrow(deg, length) {
        context.save();

        context.strokeStyle = '#000000';
        context.lineWidth = '2';
        context.lineCap = 'round';

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

    return {
        restrict: 'A',
        link: init
    };
});