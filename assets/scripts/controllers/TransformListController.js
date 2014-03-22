angular.module('MatrixPlaygroundApp').controller('TransformListController', function ($timeout, $scope, $rootScope) {
    'use strict';

    $scope.transforms = $rootScope.transforms;
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

        transformList.removeAll();
        transformList.addRange(transforms);

        $scope.$apply();
    });

    $scope.isActive = function() {
        return $rootScope.lastChanged === 'transformList' ? true : false
    };

    $scope.add = function(transformtype) {
        transformList.add(transformtype);
        $rootScope.lastChanged = 'transformList';
    };

    $scope.remove = function(transform) {
        transformList.remove(transform);
        $rootScope.lastChanged = 'transformList';
    };

    $scope.$watch('transforms', function(newValue, oldValue) {
        transformList.recomputeMatrix();
        $rootScope.lastChanged = 'transformList';
    }, true);
});