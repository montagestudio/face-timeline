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
            this._needsRefresh = true;
            this.needsDraw = true;
        }
    },

    _isProcessingImage: {
        value: false
    },

    _scheduledFrame: {
        value: null
    },

    tryToLoadFrame: {
        value: function () {
            this._scheduledFrame = "assets/videos/" + this._selectedVideoId + "/frame-" + (((1000000 + Math.round(this._currentFrame)) + "").substr(1, 6)) + ".jpg";
            if (!this._isProcessingImage && (this._currentImage !== this._scheduledFrame)) {
                this._isProcessingImage = true;
                if (!this._image) {
                    this._image = new Image();
                    this._image.addEventListener("load", this, false);
                    this._image.addEventListener("error", this, false);
                    document.body.appendChild(this._image);
                    this._image.style.display = "none";
                }
                this._image.src = this._scheduledFrame;
                this._currentImage = this._scheduledFrame;
            }
        }
    },

    handleError: {
        value: function () {
            this.needsDraw = true;
        }
    },

    handleLoad: {
        value: function () {
            this.needsDraw = true;
        }
    },

    _needsRefresh: {
        value: true
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
            this._needsRefresh = true;
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

    willDraw: {
        value: function () {
            this._width = this._element.offsetWidth;
            this._height = this._element.offsetHeight;
            this.tryToLoadFrame();
        }
    },

    draw: {
        value: function () {
            if (this._isProcessingImage || this._needsRefresh) {
                if (this._image.complete) {
                    if (this.canvas.width !== this._image.width) {
                        this.canvas.width = this._image.width;
                    }
                    if (this.canvas.height !== this._image.height) {
                        this.canvas.height = this._image.height;
                    }
                    if ((this.canvas.width) / (this.canvas.height) > (this._width) / (this._height)) {
                        this.canvas.style.width = (this._width) + "px";
                        this.canvas.style.height = "auto";
                    } else {
                        this.canvas.style.width = "auto";
                        this.canvas.style.height = (this._height) + "px";
                    }
                    this._context.drawImage(this._image, 0, 0);
                    this.drawCircles();
                    this._isProcessingImage = false;
                    this._needsRefresh = false;
                    this.tryToLoadFrame();
                } else {
                    this.needsDraw = true;
                }
            }
        }
    }

});
