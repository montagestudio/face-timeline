/**
 * @module ui/block.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Block
 * @extends Component
 */
exports.Block = Component.specialize(/** @lends Block# */ {

    _positions: {
        value: [0, 0]
    },

    positions: {
        get: function () {
            return this._positions;
        },
        set: function (value) {
            this._positions = value;
            this.needsDraw = true;
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
            this._offset = value;
            this.needsDraw = true;
        }
    },

    _width: {
        value: 0
    },

    width: {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
            this.needsDraw = true;
        }
    },

    _zoom: {
        value: 0
    },

    zoom: {
        get: function () {
            return this._zoom;
        },
        set: function (value) {
            this._zoom = value;
            this.needsDraw = true;
        }
    },

    _computeX: {
        value: function (frame) {
            var singleFrameSize = (this.width * this.zoom * .01) / this.duration;

            return ((parseFloat(frame) + this.offset) * singleFrameSize + 130) | 0;
        }
    },

    _duration: {
        value: 1
    },

    duration: {
        get: function () {
            return this._duration;
        },
        set: function (value) {
            this._duration = value;
            this.needsDraw = true;
        }
    },

    draw: {
        value: function () {
            this._element.style.width = (this._computeX(this._positions[1]) - this._computeX(this._positions[0]) - 2) + "px";
            this._element.style.left = (this._computeX(this._positions[0])) + "px";
            this._element.style.backgroundColor = "hsla(" + this.color[0] + "," + this.color[1] + "%," + this.color[2] + "%,.6)";
            this._element.style.border = "1px solid hsla(" + this.color[0] + "," + this.color[1] + "%," + this.color[2] + "%,1)";
        }
    }

});
