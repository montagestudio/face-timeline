/**
 * @module ui/video-frame.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class VideoFrame
 * @extends Component
 */
exports.VideoFrame = Component.specialize(/** @lends VideoFrame# */ {

    enterDocument: {
        value: function () {
            this._context = this.canvas.getContext("2d");
            window.addEventListener("resize", this, false);
        }
    },

    handleResize: {
        value: function () {
            this._imageNeedsDraw = true;
            this.needsDraw = true;
        }
    },

    _frameSrc: {
        value: null
    },

    frameSrc: {
        get: function () {
            return this._frameSrc;
        },
        set: function (value) {
            if (this._frameSrc !== value) {
                this._frameSrc = value;
                if (!this._image) {
                    this._image = new Image();
                    document.body.appendChild(this._image);
                    this._image.style.width = "0";
                    this._image.style.height = "0";
                    this._image.style.position = "absolute";
                    this._image.addEventListener("load", this, false);
                }
                this._image.src = this._frameSrc;
            }
        }
    },

    handleLoad: {
        value: function () {
            this._imageNeedsDraw = true;
            this.needsDraw = true;
        }
    },

    willDraw: {
        value: function () {
            this._width = this._element.offsetWidth;
            this._height = this._element.offsetHeight;
        }
    },

    _selection: {
        value: {}
    },

    selection: {
        get: function () {
            return this._selection;
        },
        set: function (value) {
            this._selection = value;
            this._imageNeedsDraw = true;
            this.needsDraw = true;
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
            if (this.currentFrame) {
                this.frameSrc = "assets/videos/" + this._selectedVideoId + "/frame-" + (((1000000 + Math.round(this.currentFrame)) + "").substr(1, 6)) + ".jpg";
            }
            this._imageNeedsDraw = true;
            this.needsDraw = true;
        }
    },

    _currentFrame: {
        value: null
    },

    currentFrame: {
        get: function () {
            return this._currentFrame;
        },
        set: function (value) {
            this._currentFrame = value;
            if (this.selectedVideoId) {
                this.frameSrc = "assets/videos/" + this._selectedVideoId + "/frame-" + (((1000000 + Math.round(value)) + "").substr(1, 6)) + ".jpg";
            }
            this._imageNeedsDraw = true;
            this.needsDraw = true;
        }
    },

    drawCircles: {
        value: function () {
            var face,
                movie,
                frame,
                i;

            for (i in this.faces) {
                if (this._selection[i]) {
                    face = this.faces[i];
                    if (movie = face[this._selectedVideoId]) {
                        if (frame = movie[Math.round(this._currentFrame)]) {
                            this._context.beginPath();
                            this._context.lineWidth = 9;
                            this._context.strokeStyle = "hsla(" + face.color[0] + "," + face.color[1] + "%," + face.color[2] + "%,.75)";
                            this._context.arc(frame.x, frame.y, frame.radius * .625, 0, Math.PI*2, true);
                            this._context.stroke();
                        }
                    }
                }
            }
        }
    },

    draw: {
        value: function () {
            var margin = 0;

                this.frameSrc = "assets/videos/" + this._selectedVideoId + "/frame-" + (((1000000 + Math.round(this._currentFrame)) + "").substr(1, 6)) + ".jpg";

            if (this._imageNeedsDraw) {
                if (this._image.width && this._image.height) {
                    if (this.canvas.width !== this._image.width) {
                        this.canvas.width = this._image.width;
                    }
                    if (this.canvas.height !== this._image.height) {
                        this.canvas.height = this._image.height;
                    }
                    if ((this.canvas.width - margin * 2) / (this.canvas.height - margin * 2) > (this._width - margin * 2) / (this._height - margin * 2)) {
                        this.canvas.style.width = (this._width - margin * 2) + "px";
                        this.canvas.style.height = "auto";
                    } else {
                        this.canvas.style.width = "auto";
                        this.canvas.style.height = (this._height - margin * 2) + "px";
                    }
                    this._imageNeedsDraw = false;
                    this._context.drawImage(this._image, 0, 0);
                    this.drawCircles();
                } else {
                    this._imageNeedsDraw = true;
                    this.needsDraw = true;
                }
            }
        }
    }

});
