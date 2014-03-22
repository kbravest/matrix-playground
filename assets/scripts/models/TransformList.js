var TransformList = (function() {
    'use strict';

    var TransformList = function() {
        this.transforms = [];
        this.matrix = [1,0,0,1,0,0];
    };

    var proto = TransformList.prototype;

    proto.update = function(rowNumber, transformtype, arg1, arg2) {
        var row = this.transforms[rowNumber];

        row.transformtype = transformtype;
        row.arg1 = arg1;
        row.arg2 = arg2;

        this.recomputeMatrix();

        console.log('updateRow', rowNumber, arg1, arg2, this.transforms);
    };

    proto.addRange = function(transforms) {
        for (var i = 0; i < transforms.length; i++) {
            var transform = transforms[i];
            this.add(transform.type, transform.arg1, transform.arg2);
        }
    };

    proto.add = function(transformtype, arg1, arg2) {
        //console.log('add', transformtype, transformList);

        if (arg1 == null && arg2 == null) {
            switch(transformtype) {
                case 'translate':
                    arg1 = 0;
                    arg2 = 0;
                    break;

                case 'scale':
                    arg1 = 1;
                    arg2 = 1;
                    break;

                case 'rotate':
                    arg1 = 0;
                    arg2 = 0;
                    break;

                case 'shear':
                    arg1 = 0;
                    arg2 = 0;
                    break;
            }
        }

        this.transforms.push(
            {
                type: transformtype,
                arg1: arg1, 
                arg2: arg2
            }
        );

        this.recomputeMatrix();
    };

    proto.removeAll = function() {
        // Intentionally not doing [] here because I don't want to 
        // create a new array reference
        this.transforms.length = 0; 

        this.recomputeMatrix();
    };

    proto.remove = function(objectOrRownumber) {
        var rowNumber = null;

        if (typeof objectOrRownumber === 'number') {
            rowNumber = objectOrRownumber;
        } else {
            for (var i = 0; i < this.transforms.length; i++) {
                if (objectOrRownumber === this.transforms[i]) {
                    rowNumber = i;
                    break;
                }
            }
        }

        if (rowNumber != null) {
            this.transforms.splice(rowNumber, 1);
            this.recomputeMatrix();
        }
    };

    proto.getTransforms = function() {
        return this.transforms;
    };

    proto.setMatrix = function(matrix) {
        this.matrix[0] = matrix[0];
        this.matrix[1] = matrix[1];
        this.matrix[2] = matrix[2];
        this.matrix[3] = matrix[3];
        this.matrix[4] = matrix[4];
        this.matrix[5] = matrix[5];
    };

    proto.getMatrix = function() {
        return this.matrix;
    };    

    proto.recomputeMatrix = function() {
        var x;
        var y;
        var degrees;
        var transformTracker = new TransformTracker();

        for (var i = 0; i < this.transforms.length; i++) {
            var transform = this.transforms[i];

            //console.log(transform.type, transform.arg1, transform.arg2);

            switch(transform.type) {
                case 'translate':
                    x = transform.arg1;
                    y = transform.arg2;

                    transformTracker.translate(x, y);
                    break;

                case 'scale':
                    x = transform.arg1;
                    y = transform.arg2;

                    transformTracker.scale(x, y);
                    break;

                case 'rotate':
                    degrees = transform.arg1;

                    transformTracker.rotateDegrees(degrees);
                    break;

                case 'shear':
                    x = transform.arg1;
                    y = transform.arg2;

                    transformTracker.shear(x, y);
                    break;
            }
        }

        this.setMatrix(transformTracker.getMatrix());
    };

    return TransformList;
})();