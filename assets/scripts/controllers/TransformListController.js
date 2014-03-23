angular.module('MatrixPlaygroundApp').controller('TransformListController', function ($timeout, $scope, transformation) {
    'use strict';

    $scope.transforms = transformation.transforms;
    $scope.transformTypes = ['translate','scale','rotate','shear'];

    var $transformList = $('.js-transformList');
    $transformList.sortable({
        forcePlaceholderSize: true
    });

    $scope.onBeforeRender = function() {
        $transformList.sortable();
    };

    $transformList.sortable().bind('sortupdate', function(event) {
        var transforms = [];

        //TODO: change to Array.map?
        $transformList.children().each(function(index, element) {
            var scope = angular.element(element).scope()
            transforms.push(scope.transform);
        });

        transformation.removeAll();
        transformation.addRange(transforms);

        $scope.$apply();
    });

    $scope.isActive = function() {
        return transformation.lastChanged === 'transforms' ? true : false
    };

    $scope.add = function(transformtype) {
        transformation.add(transformtype);
        transformation.lastChanged = 'transforms';
    };

    $scope.remove = function(transform) {
        transformation.remove(transform);
        transformation.lastChanged = 'transforms';
    };

    $scope.$watch('transforms', function(newValue, oldValue) {
        transformation.recomputeMatrix();
        transformation.lastChanged = 'transforms';
    }, true);
});