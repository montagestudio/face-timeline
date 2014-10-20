/**
 * @module ui/horizontal-scrollbar.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class HorizontalScrollbar
 * @extends Component
 */
exports.HorizontalScrollbar = Component.specialize(/** @lends HorizontalScrollbar# */ {

    _length: {
        value: 1
    },

    length: {
        get: function () {
            return this._length;
        },
        set: function (value) {
            if (this._length !== value) {
                this._length = value;
                this.needsDraw = true;
            }
        }
    },

    _offset: {
        value: 0
    },

    offset: {
        get: function () {
            return this._offset;
        },
        set: function (value) {
            if (this._offset !== value) {
                if (value < 0) {
                    value = 0
                }
                if (value > (this.length - this._handleLength)) {
                    value = (this.length - this._handleLength);
                }
                this._offset = value;
                this.needsDraw = true;
            }
        }
    },

    _handleLength: {
        value: 1
    },

    handleLength: {
        get: function () {
            return this._handleLength;
        },
        set: function (value) {
            if (this._handleLength !== value) {
                this._handleLength = value;
                this.needsDraw = true;
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.handle.addEventListener("mousedown", this, false);
                window.addEventListener("resize", this, false);
            }
        }
    },

    handleMousedown: {
        value: function (event) {
            this.pointerX = event.pageX;
            this.pointerY = event.pageY;
            this.targetOffset = this.offset;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
            event.preventDefault();
        }
    },

    handleMousemove: {
        value: function (event) {
            var dX = event.pageX - this.pointerX;
                dY = event.pageY - this.pointerY;

            this.targetOffset += dX * this._length / this._width;
            this.offset = this.targetOffset;
            this.pointerX = event.pageX;
            this.pointerY = event.pageY;
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
        }
    },

    handleResize: {
        value: function () {
            this.needsDraw = true;
        }
    },

    willDraw: {
        value: function () {
            this._width = this._element.offsetWidth - 22;
        }
    },

    draw: {
        value: function () {
            var handlePixelWidth = Math.floor(this._width * this._handleLength / this._length),
                x = 3 + this._width * this._offset / this._length;

            if (handlePixelWidth > this._width) {
                handlePixelWidth = this._width;
                x = 3;
            }
            this.handle.style.width = handlePixelWidth + "px";
            this.handle.style.webkitTransform = "translate3d(" + x + "px,0,0)";
        }
    }

});
