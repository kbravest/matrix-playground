var app = angular.module('MatrixPlaygroundApp', []);

var transformList = new TransformList();

app.run(function($rootScope) {
	// Plop in some values from the model 
	// We want all of our controllers to be able to access
	$rootScope.matrix = transformList.matrix;
	$rootScope.transforms = transformList.transforms;
	$rootScope.lastChanged = null;
});