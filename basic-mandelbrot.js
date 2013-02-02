// Extend JavaScript API with useful functions
(function() {
    "use strict";
    
    if (typeof window.Math !== 'undefined') {
        // Map val from a coordinate plane bounded by x1, x2 onto a coordinate plane bounded by y1, y2
        window.Math.map = function(val, x1, x2, y1, y2) {
            return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
        }
    }

    if (typeof window.ImageData !== 'undefined') {
        /**
         * Set the color values for the pixel at the specified x, y index
         * @param c [r,g,b,a]
         * @param x
         * @param y
         */
        ImageData.prototype.setPixel = function setPixel(c, x, y) {
            var data = this.data;
            var r = 4 * (x + y * this.width);

            data[r] = c[0];
            data[r + 1] = c[1];
            data[r + 2] = c[2];
            data[r + 3] = c[3];
        }
    }
})();

// Mandelbrot Set Code
(function(){
    var canvasWidth = 500, canvasHeight = 400, startX = -1.95, endX = 2.05, startY = -0.95, endY = 4.05;

    $(function() {
        var canvas = $('#cvsMandelbrot'); // Find the canvas
        $(canvas).css('width', canvasWidth).css('height', canvasHeight); // Set the canvas height and width
        var ctx = canvas[0].getContext('2d');

        var startTime = new Date().getTime();

        drawMandelbrotSet(startX, endX, startY, endY, ctx); // Draw the set

        var endTime = new Date().getTime();
        var timeTaken = endTime - startTime;

        function drawMandelbrotSet(startX, endX, startY, endY, ctx) {
            // get the image data for the graphics context
            var imageData = ctx.getImageData(0,0, canvas.width(), canvas.height());

            // Iterate over all pixels in our canvas and paint their value
            for (var x = 0; x < canvasWidth; x++) {
                for (var y = 0; y < canvasHeight; y++) {
                    // Map our canvas coordinates onto the complex plane
                    var cReal = Math.map(x, 0, canvasWidth, startX, endX);
                    var cImaginary = Math.map(y, 0, canvasHeight, startY, endY);

                    if (inMandelbrotSet(cReal, cImaginary)) {
                        setBlackPixel(x, y, imageData);
                    }
                }
            }

            ctx.putImageData(imageData,0,0);
        }

        // Update the UI, indicating that processing is complete
        $('#lblStatus').text('Done');
        $('#lblSetInfo').text('Showing [' + startX + ' - ' + endX + '] x [' + startY + ' x ' + endY + '] Completed in: ' + timeTaken + ' ms');
    });

    function setBlackPixel(x, y, imageData) {
        imageData.setPixel([0,0,0,255], x, y);
    }

    function inMandelbrotSet(cReal, cImaginary) {
        var zReal = 0, zImaginary = 0, maxCount = 1000;

        for (var i = 0; i < maxCount; i++) {
            if (Math.pow(zReal, 2) + Math.pow(zImaginary, 2) > 4) {
                return false; // Not in the mandelbrot set, it broke out
            }

            // Calculate the next value of z
            var nextValReal = Math.pow(zReal, 2) - Math.pow(zImaginary, 2) + cReal;
            var nextValImaginary = 2 * zReal * zImaginary + cImaginary;

            zReal = nextValReal;
            zImaginary = nextValImaginary;
        }

        // Z remained bounded by the circle for the maximum number of iterations, it is in the set
        return true;
    }
})();