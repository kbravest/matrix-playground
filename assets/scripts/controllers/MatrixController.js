angular.module('MatrixPlaygroundApp').controller('MatrixController', function ($scope, transformation) {
    'use strict';

    var DECIMAL_PLACES = 2;

    $scope.matrix = transformation.matrix;

    $scope.changeMatrix = function() {
        transformation.lastChanged = 'matrix';
    };

    $scope.formatEquationX = function() {
        return formatEquation(
            $scope.matrix[0], 
            $scope.matrix[2], 
            $scope.matrix[4]
        );
    };

    $scope.formatEquationY = function() {
        return formatEquation(
            $scope.matrix[1],
            $scope.matrix[3],
            $scope.matrix[5]
        );
    };

    $scope.formatCodeBlock = function() {
        var matrixRounded = [
            roundTo($scope.matrix[0], 2), // a
            roundTo($scope.matrix[1], 2), // d
            roundTo($scope.matrix[2], 2), // b
            roundTo($scope.matrix[3], 2), // e
            roundTo($scope.matrix[4], 2), // c
            roundTo($scope.matrix[5], 2)  // f
        ];

        return 'context.setTransform(' + matrixRounded + ');';
    };

    var roundTo = function(number, decimalPlaces) {
        // plus sign drops any extra zeroes at the end
        var result = +parseFloat(number).toFixed(decimalPlaces); 
        return result;
    };

    var formatEquation = function(x, y, z) {
        var i = 0;
        var expression = [];
        var expressionString = '';

        x = roundTo(x, DECIMAL_PLACES);
        y = roundTo(y, DECIMAL_PLACES);
        z = roundTo(z, DECIMAL_PLACES);

        expression.push(x === 0 ? '' : x + 'x');
        expression.push(y === 0 ? '' : y + 'y');
        expression.push(z === 0 ? '' : z);

        for (i = 0; i < expression.length; i++) {
            if (expression[i] !== '') {
                if (expressionString !== '') {
                    expressionString += ' + ';
                }
                expressionString += expression[i];
            }
        }
        if (expressionString === '') { 
            expressionString = 0; 
        }

        return expressionString;
    };

});