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