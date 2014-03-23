angular.module('MatrixPlaygroundApp').controller('CanvasController', function ($scope, transformation) {
    'use strict';

    $scope.matrix = transformation.matrix;
});