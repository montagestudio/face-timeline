/**
 * @module ui/face-row.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FaceRow
 * @extends Component
 */
exports.FaceRow = Component.specialize(/** @lends FaceRow# */ {

    _face: {
        value: null
    },

    face: {
        set: function (value) {
            if (value) {
                this.key = value.key;
                this.isSelected = value.isSelected;
                this._face = value.value;
            }
        }
    },

    _selectedVideoId: {
        value: null
    },

    selectedVideoId: {
        get: function () {
            return this._selectedVideoId;
        },
        set: function (value) {
            this._selectedVideoId = value;
            this._computeBlocks = true;
            this.needsDraw = true;
        }
    },

    enterDocument: {
        value: function (firstTime) {
            this._computeBlocks = true;
            if (firstTime) {
                this.facePhoto.addEventListener("click", this, false);
                this.facePhoto.addEventListener("mousedown", this, false);
            }
        }
    },

    isSelected: {
        value: false
    },

    handleMousedown: {
        value: function (event) {
            event.stopPropagation();
        }
    },

    handleClick: {
        value: function () {
            this.isSelected = !this.isSelected;
            this.timeline.select(this.key, this.isSelected);
            this.needsDraw = true;
        }
    },

    draw: {
        value: function () {
            if (this._computeBlocks) {
                var video = this._face[this.selectedVideoId],
                    frames = [],
                    blocks = [],
                    i, j;


                for (i in video) {
                    frames[parseInt(i)] = true;
                }
                i = 0;
                while ((i < frames.length) && !frames[i]) {
                    i++;
                }
                j = i;
                while ((j < frames.length) && frames[j]) {
                    j++;
                }
                if (j > i) {
                    blocks.push([i, j]);
                }
                this.blocks = blocks;
                this._computeBlocks = false;
            }
            if (this.isSelected) {
                this.facePhoto.classList.add("selected");
            } else {
                this.facePhoto.classList.remove("selected");
            }
            this.facePhoto.style.backgroundImage = "url(assets/faces/" + this.key + ".jpg)";
            this.bar.style.backgroundColor = "hsla(" + this._face.color[0] + "," + this._face.color[1] + "%," + this._face.color[2] + "%,.2)";
        }
    }

});
