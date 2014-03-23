angular.module('MatrixPlaygroundApp')
    .controller('TransformListController', function ($scope, transformation) {

    'use strict';

    var TransformListController = function($scope, transformation) {
        this.$scope = $scope;
        this.transformation = transformation;

        this.createChildren();
        this.enable();
    };

    var proto = TransformListController.prototype;

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
        this.$scope.transforms = transformation.transforms;
        this.$scope.transformTypes = ['translate','scale','rotate','shear'];

        this.$transformList = $('.js-transformList');
    };

    proto.enable = function() {
        // Which functions to expose to angular
        this.$scope.isActive = this.isActive.bind(this);
        this.$scope.add = this.add.bind(this);
        this.$scope.remove = this.remove.bind(this);
        this.$scope.onRender = this.onRender.bind(this);
        this.$scope.$watch('transforms', this.onModelChange.bind(this), true);

        // jQuery events
        this.$transformList.sortable({ forcePlaceholderSize: true });
        this.$transformList.sortable().bind('sortupdate', this.onAfterDrag.bind(this));
    };

    proto.isActive = function() {
        var isActive = this.transformation.lastChanged === 'transforms' ? true : false;
        return isActive;
    };

    proto.add = function(transformType) {
        this.transformation.add(transformType);
        this.transformation.lastChanged = 'transforms';
    };

    proto.remove = function(transform) {
        this.transformation.remove(transform);
        this.transformation.lastChanged = 'transforms';
    };

    /**
     * Re-renders the scene upon change to the matrix transform
     *
     * @method  onModelChange
     * @param  {Array} newValue Array of transforms
     * @param  {Array} oldValue Array of transforms
     */
    proto.onModelChange = function(newValue, oldValue) {
        this.transformation.recomputeMatrix();
        this.transformation.lastChanged = 'transforms';
    };

    /**
     * Re-attaches sortable jquery plugin every time
     * angular re-renders the list so that new elements
     * will be recognized
     *
     * @method onRender
     */
    proto.onRender = function() {
        this.$transformList.sortable();
    };

    /**
     * Fires upon completion of drag-and-drop
     *
     * This is a DOM element update -> model update
     * Retrieve the transform for each DOM element in the list
     * And then update the model
     *
     * @method  onAfterDrag
     * @param  {Event} event
     */
    proto.onAfterDrag = function(event) {
        var $elements = this.$transformList.children();

        var transformArray = $elements.map(function(index, element) {
            var scope = angular.element(element).scope()
            return scope.transform;
        });

        this.transformation.removeAll();
        this.transformation.addRange(transformArray);

        console.log(transformation);


        // We've updated the matrix transform list,
        // so force angular to re-apply data bindings
        this.$scope.$apply();
    };

    new TransformListController($scope, transformation);
});