angular.module('MatrixPlaygroundApp').directive('renderCanvas', function () {
    'use strict';

    var CANVAS_WIDTH = 600;
    var CANVAS_HEIGHT = 400;
    var SUBJECT_WIDTH = 75;
    var SUBJECT_HEIGHT = 75;
    var IMAGE_SRC = 'assets/media/images/cat.jpg';

    var CanvasDirective = function($scope, $canvas) {
        this.$scope = $scope;
        this.$canvas = $canvas;

        // Set up canvas element
        this.context = this.$canvas[0].getContext('2d');
        this.$canvas
            .attr('width', CANVAS_WIDTH)
            .attr('height', CANVAS_HEIGHT);

        // Create image element
        this.$image = angular.element('<img/>')
            .on('load', this.onImageLoad.bind(this))
            .attr('src', IMAGE_SRC);
    };

    var proto = CanvasDirective.prototype;

    /**
     * The angular scope for this directive
     *
     * @property $scope
     * @type {Scope}
     */
    proto.$scope = null;

    /**
     * The canvas element this directive is attached to
     *
     * @property $canvas
     * @type {jQuery}
     */
    proto.$canvas = null;

    /**
     * The image to render
     *
     * @property $image
     * @type {jQuery}
     */
    proto.$image = null;

    /**
     * The canvas context
     *
     * @property context
     * @type {Canvas2DContext}
     */
    proto.context = null;

    proto.onImageLoad = function() {
        // Set up watch listener
        this.$scope.$watchCollection('matrix', this.onMatrixChange.bind(this));

        // Render for the first time
        this.render(this.context);
    };

    /**
     * Re-renders the scene upon change to the matrix transform
     *
     * @method  onMatrixChange
     * @param  {Array} newValue Matrix transform array in form [1,0,0,1,0,0]
     * @param  {Array} oldValue Matrix transform array in form [1,0,0,1,0,0]
     */
    proto.onMatrixChange = function(newValue, oldValue) {
        this.render(this.context);
    };

    proto.render = function(context) {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid before we do any other crazy transforms
        this.renderBackingGrid(context);

        context.save();

        // Center our stuff
        context.translate(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2
        );

        // Apply the transform
        var matrix = this.$scope.matrix;
        context.transform(
            matrix[0], // a
            matrix[1], // d
            matrix[2], // b
            matrix[3], // e
            matrix[4], // c
            matrix[5]  // f
        );

        this.renderSubject(context, this.$image[0]);
        this.renderAxis(context);

        context.restore();
    };

    proto.renderBackingGrid = function(context) {
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
    };

    proto.renderSubject = function(context, img) {
        context.save();

        context.drawImage(img, 0, 0, SUBJECT_WIDTH, SUBJECT_HEIGHT);
        
        context.restore();
    };

    proto.renderAxis = function(context) {
        context.save();

        this.renderArrow(context, 0, SUBJECT_WIDTH * 1.8);
        this.renderArrow(context, 90, SUBJECT_WIDTH * 1.8);

        context.fillStyle = '#000000';
        context.fillText('(0,0)', -10, -5);

        context.restore();
    };

    proto.renderArrow = function(context, rotationInDegrees, length) {
        context.save();

        context.strokeStyle = '#000000';
        context.lineWidth = '2';
        context.lineCap = 'round';

        context.rotate(rotationInDegrees * Math.PI / 180);

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
    };

    return {
        restrict: 'A',
        link: function($scope, $canvas) {
            new CanvasDirective($scope, $canvas);
        }
    };
});