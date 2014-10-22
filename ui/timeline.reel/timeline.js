/**
 * @module ui/timeline.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Timeline
 * @extends Component
 */
exports.Timeline = Component.specialize(/** @lends Timeline# */ {

    /**
        Duration in frames
    */
    _duration: {
        value: null
    },

    duration: {
        get: function () {
            return this._duration;
        },
        set: function (value) {
            if (this._duration !== value) {
                this._duration = value;
                this._needsUpdateTimeBar = true;
                this.needsDraw = true;
            }
        }
    },

    _framesPerSecond: {
        value: 30
    },

    framesPerSecond: {
        get: function () {
            return this._framesPerSecond;
        },
        set: function (value) {
            if (this._framesPerSecond !== value) {
                this._framesPerSecond = value;
                this._needsUpdateTimeBar = true;
                this.needsDraw = true;
            }
        }
    },

    _currentFrame: {
        value: 0
    },

    currentFrame: {
        get: function () {
            return this._currentFrame;
        },
        set: function (value) {
            if (this._currentFrame !== value) {
                if (value < 0) {
                    value = 0;
                }
                if (value > this._duration - 1) {
                    value = this._duration - 1;
                }
                this._currentFrame = value;
                this._needsUpdateTimeBar = true;
                this.needsDraw = true;
            }
        }
    },

    /**
        Zoom in percentage, 100% meaning full timeline width
    */
    _zoom: {
        value: 100
    },

    zoom: {
        get: function () {
            return this._zoom;
        },
        set: function (value) {
            if (this._zoom !== value) {
                var offset = this.offset;

                if (value < 100) {
                    value = 100;
                }
                this._zoom = value;
                this.offset = 0;
                this.offset = offset;
                this._hasAnimation = true;
                this.main.element.classList.add("animateBlocks");
                this._needsUpdateTimeBar = true;
                this.needsDraw = true;
            }
        }
    },

    /**
        Offset in frames
    */
    _offset: {
        value: 0
    },

    offset: {
        get: function () {
            return this._offset;
        },
        set: function (value) {
            if (this._offset !== value) {
                if (value > 0) {
                    value = 0;
                }
                if (value < -this._duration * (1 - 100 / this.zoom)) {
                    value = -this._duration * (1 - 100 / this.zoom);
                }
                this._offset = value;
                this._needsUpdateTimeBar = true;
                this._hasAnimation = false;
                this.main.element.classList.remove("animateBlocks");
                this.needsDraw = true;
                this._updateUnitaryOffset = true;
                this.unitaryOffset = -this._offset / this._duration;
            }
        }
    },

    _unitaryOffset: {
        value: 0
    },

    unitaryOffset: {
        get: function () {
            return this._unitaryOffset;
        },
        set: function (value) {
            this._unitaryOffset = value;
            if (!this._updateUnitaryOffset) {
                this.offset = -value * this._duration;
            } else {
                this._updateUnitaryOffset = false;
            }
        }
    },

    _needsUpdateTimeBar: {
        value: false
    },

    _needsUpdateTimeBarOpacity: {
        value: false
    },

    handleResize: {
        value: function () {
            this._needsUpdateTimeBar = true;
            this.needsDraw = true;
        }
    },

    computeFrame: {
        value: function (x) {
            var singleFrameSize = (this._timeBarWidth * this._zoom * .01) / this._duration;

            return (x - 130) / singleFrameSize - this._offset;
        }
    },

    handleMousedown: {
        value: function (event) {
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
            event.preventDefault();
            this._target = event.currentTarget;
            this._targetCurrentFrame = this.currentFrame;
            event.stopPropagation();
            switch (this._target) {
                case this.arrow:
                case this.zoomIn:
                case this.zoomOut:
                    this.selectedTool = this._target;
                    this._updateTool = true;
                    this.needsDraw = true;
                    break;
                case this.tagsAndFaces:
                    switch (this.selectedTool) {
                        case this.arrow:
                            this.main.element.classList.remove("animateBlocks");
                            this.currentFrame = this.computeFrame(event.pageX - 184);
                            break;
                        case this.zoomIn:
                            this.zoom *= 1.3;
                            break;
                        case this.zoomOut:
                            this.zoom /= 1.3;
                            break;
                    }
                    break;
            }
        }
    },

    _updateTool: {
        value: true
    },

    handleMousemove: {
        value: function (event) {
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY,
                singleFrameSize = (this._timeBarWidth * this._zoom * .01) / this._duration;

            if (this._target === this.timeBar) {
                this.offset += dX / singleFrameSize;
                //this.zoom *= Math.pow(1.01, dY);
            }
            if (this._target === this.currentFrameMark) {
                this._targetCurrentFrame += dX / singleFrameSize;
                this.currentFrame = this._targetCurrentFrame;
                this.main.element.classList.remove("animateBlocks");
            }
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
            if (this._target === this.currentFrameMark) {
                this.currentFrame = Math.round(this.currentFrame);
            }
        }
    },

    _timestampMinWidth: {
        value: 80
    },

    _potentialSteps: {
        get: function () {
            return [
                1, // 1 frame
                2, // 2 frames
                3, // 3 frames
                4, // 4 frames
                5, // 5 frames
                10, // 10 frames
                this._framesPerSecond, // 1 second
                this._framesPerSecond * 2, // 2 seconds
                this._framesPerSecond * 3, // 3 seconds
                this._framesPerSecond * 4, // 4 seconds
                this._framesPerSecond * 5, // 5 seconds
                this._framesPerSecond * 10, // 10 seconds
                this._framesPerSecond * 15, // 10 seconds
                this._framesPerSecond * 20, // 10 seconds
                this._framesPerSecond * 30, // 30 seconds
                this._framesPerSecond * 60, // 1 minute
                this._framesPerSecond * 120, // 2 minutes
                this._framesPerSecond * 180, // 3 minutes
                this._framesPerSecond * 240, // 4 minutes
                this._framesPerSecond * 300, // 5 minutes
                this._framesPerSecond * 600, // 10 minutes
                this._framesPerSecond * 900, // 15 minutes
                this._framesPerSecond * 1200, // 20 minutes
                this._framesPerSecond * 1800, // 30 minutes
                this._framesPerSecond * 3600, // 1 hour
                this._framesPerSecond * 7200, // 2 hours
                this._framesPerSecond * 18000, // 5 hours
                this._framesPerSecond * 36000 // 10 hours
            ];
        }
    },

    _computeTimestampStep: {
        value: function (singleFrameSize) {
            var length = this._potentialSteps.length,
                i;

            for (i = 0; i < length; i++) {
                if (singleFrameSize * this._potentialSteps[i] >= this._timestampMinWidth) {
                    return this._potentialSteps[i];
                }
            }
            return Infinity;
        }
    },

    _convertFrameNumberToTimeString: {
        value: function (frameNumber) {
            var hours = Math.floor(frameNumber / (this._framesPerSecond * 3600)),
                minutes = Math.floor(frameNumber / (this._framesPerSecond * 60)) % 60,
                seconds = Math.floor(frameNumber / this._framesPerSecond) % 60,
                frames = frameNumber % this._framesPerSecond;

            return hours + ":" + ((100 + minutes) + "").substr(1, 2) + ":" + ((100 + seconds) + "").substr(1, 2)  + ":" + ((100 + frames) + "").substr(1, 2) ;
        }
    },

    _computeX: {
        value: function (frame, singleFrameSize) {
            return ((parseFloat(frame) + this._offset) * singleFrameSize + 130) | 0;
        }
    },

    _hasAnimation: {
        value: false
    },

    getFacesInVideo: {
        value: function (videoId) {
            var faceKey,
                face,
                out = [],
                i = 0;

            for (faceKey in this.faces) {
                face = this.faces[faceKey];
                if (face[videoId]) {
                    face.color = [75 + i * 41, 84, 39];
                    out.push({
                        key: faceKey,
                        value: face,
                        isSelected: !!this.selection[faceKey]
                    });
                    i++;
                }
            }
            return out;
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.timeBar.addEventListener("mousedown", this, false);
                this.currentFrameMark.addEventListener("mousedown", this, false);
                this.arrow.addEventListener("mousedown", this, false);
                this.zoomIn.addEventListener("mousedown", this, false);
                this.zoomOut.addEventListener("mousedown", this, false);
                this.tagsAndFaces.addEventListener("mousedown", this, false);
                window.addEventListener("resize", this, false);
                this.facesInVideo = this.getFacesInVideo(this.selectedVideoId);
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
            this.facesInVideo = this.getFacesInVideo(this._selectedVideoId);
            this.currentFrame = 0;
            this._needsUpdateTimeBar = true;
            this.needsDraw = true;
        }
    },

    select: {
        value: function (key, value) {
            this.main.select(key, value);
        }
    },

    willDraw: {
        value: function () {
            this._timeBarWidth = this.timeBar.offsetWidth - 200;
        }
    },

    draw: {
        value: function () {
            var singleFrameSize,
                now = Date.now(),
                timestamp,
                time,
                step,
                i;

            if (this._updateTool) {
                this.arrow.classList.remove("selected");
                this.zoomIn.classList.remove("selected");
                this.zoomOut.classList.remove("selected");
                this.selectedTool.classList.add("selected");
                this._updateTool = false;
            }
            if (this._needsUpdateTimeBarOpacity) {
                this._needsUpdateTimeBarOpacity = false;
                for (i in this._timestampsHash) {
                    timestamp = this._timestampsHash[i];
                    time = (now - timestamp.startAnimation) / 300;
                    if (time < 1) {
                        timestamp.opacity = timestamp.fromOpacity * (1 - time) + timestamp.toOpacity * time;
                        timestamp.x = timestamp.fromX * (1 - time) + timestamp.toX * time;
                        this._needsUpdateTimeBarOpacity = true;
                        this.needsDraw = true;
                    } else {
                        timestamp.opacity = timestamp.toOpacity;
                        timestamp.x = timestamp.toX;
                        if (!timestamp.isUsed) {
                            this.timeBar.removeChild(timestamp.element);
                            delete this._timestampsHash[i];
                        }
                    }
                    timestamp.element.style.webkitTransform = "translate3d(" + timestamp.x + "px,0,0)";
                    timestamp.element.style.opacity = timestamp.opacity;
                    if ((timestamp.x > this._timeBarWidth + 200) || (timestamp.x < -this._timestampMinWidth)) {
                        if (timestamp.element.parentNode) {
                            this.timeBar.removeChild(timestamp.element);
                            delete this._timestampsHash[i];
                        }
                    }
                }
            }
            if (this._needsUpdateTimeBar) {
                singleFrameSize = (this._timeBarWidth * this._zoom * .01) / this._duration;
                step = this._computeTimestampStep(singleFrameSize);
                if (!this._timestampsHash) {
                    this._timestampsHash = {};
                }
                for (i in this._timestampsHash) {
                    this._timestampsHash[i].isUsed = false;
                }
                for (i = 0; i <= this.duration; i += step) {
                    timestamp = this._timestampsHash[i];
                    if (timestamp) {
                        timestamp.isUsed = true;
                        timestamp.fromOpacity = timestamp.opacity;
                        timestamp.toOpacity = 1;
                    } else {
                        if ((this._computeX(i, singleFrameSize) < this._timeBarWidth + 200) && (this._computeX(i, singleFrameSize) > -this._timestampMinWidth)) {
                            timestamp =
                            this._timestampsHash[i] = {
                                isUsed: true,
                                element: document.createElement("div")
                            };
                            timestamp.element.textContent = this._convertFrameNumberToTimeString(i);
                            timestamp.element.style.opacity = 0;
                            timestamp.opacity = 0;
                            timestamp.fromOpacity = 0;
                            timestamp.toOpacity = 1;
                            this.timeBar.appendChild(timestamp.element);
                        }
                    }
                }
                for (i in this._timestampsHash) {
                    timestamp = this._timestampsHash[i];
                    if (this._hasAnimation) {
                        timestamp.startAnimation = Date.now();
                    } else {
                        timestamp.startAnimation = -Infinity;
                    }
                    if (!timestamp.isUsed) {
                        timestamp.fromOpacity = timestamp.opacity;
                        timestamp.toOpacity = 0;
                    }
                    timestamp.toX = this._computeX(i, singleFrameSize);
                    if (!timestamp.x || !this._hasAnimation) {
                        timestamp.x = timestamp.toX;
                        timestamp.element.style.webkitTransform = "translate3d(" + timestamp.x + "px,0,0)";
                    }
                    timestamp.fromX = timestamp.x;
                }
                this._needsUpdateTimeBar = false;
                this._needsUpdateTimeBarOpacity = true;
                this.needsDraw = true;
                this.currentFrameMark.style.webkitTransform = "translate3d(" + this._computeX(this.currentFrame, singleFrameSize) + "px,0,0)";
            }
        }
    }

});
