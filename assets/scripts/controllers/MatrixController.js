angular.module('MatrixPlaygroundApp')
    .controller('MatrixController', function ($scope, transformation) {

    'use strict';

    var DECIMAL_PLACES = 2;

    var MatrixController = function($scope, transformation) {
        this.$scope = $scope;
        this.transformation = transformation;

        this.createChildren();
        this.enable();
    };

    var proto = MatrixController.prototype;

    /**
     * The angular scope for this controller
     *
     * @property $scope
     * @type {Scope}
     */
    proto.$scope = null;

    /**
     * The underlying transformation model
     *
     * @property transformation
     * @type {Tranformation}
     */
    proto.transformation = null;

    proto.createChildren = function() {
        // Which properties to expose to angular
        this.$scope.matrix = this.transformation.matrix;
    };

    proto.enable = function() {
        // Which functions to expose to angular
        this.$scope.changeMatrix = this.changeMatrix.bind(this);
        this.$scope.formatEquationX = this.formatEquationX.bind(this);
        this.$scope.formatEquationY = this.formatEquationY.bind(this);
        this.$scope.formatCodeBlock = this.formatCodeBlock.bind(this);
        this.$scope.roundTo = this.roundTo.bind(this);
        this.$scope.formatEquation = this.formatEquation.bind(this);
    };

    proto.changeMatrix = function() {
        this.transformation.lastChanged = 'matrix';
    };

    proto.formatEquationX = function() {
        return this.formatEquation(
            this.$scope.matrix[0], 
            this.$scope.matrix[2], 
            this.$scope.matrix[4]
        );
    };

    proto.formatEquationY = function() {
        return this.formatEquation(
            this.$scope.matrix[1],
            this.$scope.matrix[3],
            this.$scope.matrix[5]
        );
    };

    proto.formatCodeBlock = function() {
        var matrixRounded = [
            this.roundTo(this.$scope.matrix[0], 2), // a
            this.roundTo(this.$scope.matrix[1], 2), // d
            this.roundTo(this.$scope.matrix[2], 2), // b
            this.roundTo(this.$scope.matrix[3], 2), // e
            this.roundTo(this.$scope.matrix[4], 2), // c
            this.roundTo(this.$scope.matrix[5], 2)  // f
        ];

        return 'context.setTransform(' + matrixRounded + ');';
    };

    proto.formatEquation = function(x, y, z) {
        var i = 0;
        var expression = [];
        var expressionString = '';

        x = this.roundTo(x, DECIMAL_PLACES);
        y = this.roundTo(y, DECIMAL_PLACES);
        z = this.roundTo(z, DECIMAL_PLACES);

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

    proto.roundTo = function(number, decimalPlaces) {
        // plus sign drops any extra zeroes at the end
        var result = +parseFloat(number).toFixed(decimalPlaces);
        return result;
    };    

    new MatrixController($scope, transformation);

});