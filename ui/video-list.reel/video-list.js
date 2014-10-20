/**
 * @module ui/video-list.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class VideoList
 * @extends Component
 */
exports.VideoList = Component.specialize(/** @lends VideoList# */ {
    constructor: {
        value: function VideoList() {
            this.super();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.list.selection = [this.list.content[0]];
            }
        }
    }
});
