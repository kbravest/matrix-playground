angular.module('MatrixPlaygroundApp').filter('safe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});