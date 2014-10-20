/**
 * @module ui/video-list-item.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class VideoListItem
 * @extends Component
 */
exports.VideoListItem = Component.specialize(/** @lends VideoListItem# */ {

    _image: {
        value: null
    },

    _hasImageChanged: {
        value: false
    },

    image: {
        get: function () {
            return this._image;
        },
        set: function (value) {
            if (value !== undefined && this._image !== value) {
                this._image = value;
                this._hasImageChanged = true;
                this.needsDraw = true;
            }
        }
    },

    draw: {
        value: function () {
            if (this._hasImageChanged) {
                this.element.style.backgroundImage = "url(" + this.image + ")";
                this._hasImageChanged = false;
            }
            this.nameElement.textContent = this.name;
        }
    }
});
