/**
 * Archives.com jQuery Modal Plugin
 * @version 1.1
 * @author Martin Przybyla
 */

/**
 * Main Modal Object
 * @type {Object}
 */
var RhModal = {

    /**
     * jQuery plugin name which can later be used to call the plugin
     * Example: $("#Elem").rhmodal();
     * @type {String}
     */
    name: "rhmodal",

    // plugin version
    version: 1.1,

    /**
     * Default options
     * Note: Any easing options besides "linear" or "swing" require jQuery
     * easing plugin or the jQuery UI FX Core and padding/margins should match CSS
     * @type {Object}
     */
    options: {
        contentId: null,
        autoResize: true,
        resizeTimeout: 0,
        responsive: true,
        scroll: true,
        position: "fixed",
        fadeOut: 200,
        fadeIn: 200,
        href: "",
        content: "",
        width: 670,
        height: null,
        autoContentHeight: true,
        initialHeight: 50,
        initialWidth: 50,
        padding: 8,
        offsetTopBottom: 100,
        marginTop: 0,
        scrollTop: true,
        innerOffset: 50,
        offsetRatio: 0.8,
        minHeight: 50,
        closeButton: true,
        closeButtonTemplate: "<div id=\"RhCloseWrap\"><span class=\"prev\"></span><span class=\"next\"></span><span class=\"next-proj\">Next Project</span><a id=\"RhClose\"></a></div>",
        closeOnBkgClick: true,
        animate: true,
        animateSpeed: 600,
        easingType: "easeInExpo",
        copyContent: false,
        overlayTemplate: "<div id=\"RhOverlay\"></div>",
        modalTemplate: "<div id=\"RhModal\"><div id=\"RhWrap\"><div id=\"RhContent\"/><div id=\"RhUp\"></div><div id=\"RhDown\"></div></div></div>",
        onOpen: function() {},
        onClose: function() {}
    },

    /**
     * Init constructor method
     * @constructor
     * @param  {Object} options Passed in options which are mixed with default options
     * @param  {Object} elem    HTML node calling the modal
     * @return {Object}         Return modal object
     */
    init: function(options, elem) {
        var _self = this,
            scrolled = 0;

        // Mix in the passed-in options with the default options
        this.options = $.extend({}, this.options, options);

        // Save reference to the element and the jQuery object
        this.elem = elem;
        this.$elem = $(elem);

        this.options.contentId = $(elem).data("content");

        // build modal markup on click
        this.$elem.click(function() {
            _self.show();
            _self.center();
            _self.setupResize();
            _self.checkHeight();

            $("#RhClose").click(function() {
                _self.close();
            });

            // close by clicking the overlay
            if (_self.options.closeOnBkgClick) {
                $("#RhOverlay").click(function() {
                    _self.close();
                });
            }

            $("#RhDown").on("click", function() {
                scrolled = scrolled + 300;
                $(".left").animate({
                    scrollTop:  scrolled
                });
            });

            $("#RhUp").on("click", function() {
                scrolled = scrolled - 300;
                $(".left").animate({
                    scrollTop:  scrolled
                });
            });

            $(".next, .next-proj").on("click", function() {
                scrolled = 0;
                $(".left").animate({
                    scrollTop:  scrolled
                });
            });
        });

        // Return this for chaining / prototyping
        return this;
    },

    /**
     * Retrieves content
     * @param  {String} href Content selector (class or ID)
     * @return {String}      HTML content
     */
    getContent: function(href) {
        var htmlContent;

        if (href && href !== "") {

            if (!this.options.copyContent) {
                htmlContent = $(href);
            } else {
                htmlContent = $(href).html();
            }

            return htmlContent;

        }
    },

    /**
     * Show the modal window
     */
    show: function() {
        var modalContent = "",
            modalWrappedContent;

        // wrap and show hidden content or append content passed as a parameter
        if (this.options.href && this.options.href !== "") {
            $(this.options.href).parent().append(this.options.overlayTemplate);
            modalContent = this.getContent(this.options.href);
            modalWrappedContent = $(modalContent).wrap(this.options.modalTemplate);
        } else {
            $("body").append(this.options.overlayTemplate, this.options.modalTemplate);
            modalContent = this.options.content;
            $("#RhContent").append(modalContent);
        }

        if (this.options.position === "absolute") {
            $("#RhModal").css({
                "position": "absolute"
            });
        }

        if (this.options.href) {
            $(this.options.href).css({
                "display": "block"
            });
        }

        if (this.options.autoContentHeight) {
            this.contentHeight = $("#RhContent").height();
        }

        // attach close button
        if (this.options.closeButton) {
            $("#RhModal").prepend(this.options.closeButtonTemplate);
        }

        // set dimensions, center and animate modal window
        if (this.options.animate) {
            this.setInitialDimensions(this.options.initialHeight, this.options.initialWidth);
        }

        this.center();

        // animate (grow) height and width on open or just fade in
        if (this.options.animate) {
            this.animate(this.contentHeight);
        } else {
            this.animate(false);
        }

        // callback
        if (typeof this.options.onOpen === "function") {
            this.options.onOpen();
        }

    },

    /** 
     * Sets the initial dimensions of the modal window
     * before animation begins
     * @param  {Number} initialHeight Height when modal window appears
     * @param  {Number} initialWidth  Width when modal window appears
     */
    setInitialDimensions: function(initialHeight, initialWidth) {
        $("#RhModal").height(initialHeight);
        $("#RhModal").width(initialWidth);
    },

    /**
     * Initial animation when modal dialog opens
     * @param  {Number} contentHeight Height of content for the purpose automatically animating to that height
     * @return {Undefined}            Animates modal dialog
     */
    animate: function(contentHeight) {
        var _self = this,
            $modal = $("#RhModal"),
            $modalWrap = $("#RhWrap"),
            $modalClose = $("#RhCloseWrap"),
            $overlay = $("#RhOverlay"),
            winHeight = $(window).height(),
            winWidth = $(window).width(),
            currentTop = Math.max(winHeight - $modal.height(), 0) / 2 - this.options.padding * 2,
            scrollPosition = $(window).scrollTop(),
            currentLeft = $modal.offset().left,
            oRatio = this.options.offsetRatio,
            minHeight = this.options.minHeight,
            toHeight,
            toWidth,
            newTopOffset,
            newLeftOffset,
            maxWidth = this.options.width || winWidth * oRatio;

        if (contentHeight !== false) {

            // figure out the height
            if (this.options.height) {
                if (winHeight < this.options.height) {
                    toHeight = winHeight < minHeight ? minHeight : winHeight * oRatio;
                } else {
                    toHeight = this.options.height;
                }
            } else if (this.options.autoContentHeight) {
                toHeight = contentHeight + this.options.innerOffset + (this.options.padding * 2);
                if (toHeight > winHeight) {
                    toHeight = winHeight * oRatio;
                }
            } else {
                toHeight = winHeight * oRatio;
            }

            // figure out top offset
            newTopOffset = currentTop - (toHeight - this.options.initialHeight) / 2;

            // if the window is smaller than the modal height make the offset 0
            if (this.options.height >= winHeight) {
                newTopOffset = 0;
            }

            // if responsive is enabled the width needs to be modified
            if (this.options.responsive && (winWidth * oRatio) < this.options.width) {
                toWidth = winWidth * oRatio;
            } else {
                toWidth = this.options.width;
            }

            // set new left offset and max-width
            newLeftOffset = currentLeft - (toWidth - this.options.initialWidth) / 2;
            $modal.css({
                "max-width": maxWidth
            });

            // hide modal content during animation
            $modalWrap.hide();
            $modalClose.hide();

            // animate
            $modal.animate({
                    width: toWidth,
                    height: toHeight,
                    top: newTopOffset,
                    left: newLeftOffset
                },
                this.options.animateSpeed,
                this.options.easingType,
                function() {
                    // set max content height and fade in
                    var innerHeight = $modal.height() - _self.options.innerOffset;
                    $modal.css({
                        "overflow": "hidden"
                    });
                    if (_self.options.scroll === true) {
                        $modalWrap.height(innerHeight).css({
                            "overflow-y": "auto"
                        });
                    }
                    $modalWrap.fadeIn(_self.options.fadeIn);
                    $modalClose.fadeIn(_self.options.fadeIn);
                }
            );

        } else {

            $overlay.hide();
            $modal.hide();

            if (this.options.width && this.options.responsive && winWidth < this.options.width) {
                $modal.width(winWidth * oRatio);
            } else if (this.options.width) {
                $modal.width(this.options.width);
            }
            this.center();

            $overlay.fadeIn(this.options.fadeIn);
            $modal.fadeIn(this.options.fadeIn);

            if (this.options.marginTop > 0 && !this.options.scrollTop) {
                $modal.css({
                    "margin-top": this.options.marginTop
                });
            } else if (this.options.position === "absolute") {
                $modal.css({
                    "margin-top": scrollPosition + this.options.marginTop
                });
            }

            this.checkHeight(contentHeight);

        }
    },

    /**
     * Center modal window in viewport
     */
    center: function() {
        var top,
            left,
            initialHeight = this.options.initialHeight,
            initialWidth = this.options.initialWidth,
            paddingOuter = this.options.padding * 2,
            $modal = $("#RhModal"),
            $modalHeight = $modal.height(),
            $modalWidth = $modal.width();

        initialHeight = $modalHeight > initialHeight ? $modalHeight : initialHeight;
        initialWidth = $modalWidth > initialWidth ? $modalWidth + paddingOuter : initialWidth;

        // get offsets - padding
        top = Math.max($(window).height() - $modalHeight, 0) / 2 - paddingOuter;
        left = (Math.max($(window).width() - initialWidth, 0) - paddingOuter) / 2;

        $modal.css({
            top: top,
            left: left
        });
    },

    /**
     * Keep width responsive on window resize
     */
    responsiveWidth: function() {
        if ($(window).width() < this.options.width && this.options.responsive === true) {
            $("#RhModal").css({
                "width": "80%"
            });
        } else {
            $("#RhModal").css({
                "width": this.options.width
            });
        }
    },

    /**
     * Checks the height of the content and resizes if necessary
     */
    checkHeight: function() {
        var winHeight = $(window).height(),
            modalHeight = $("#RhModal").height(),
            contentHeight = $("#RhContent").height();

        if (winHeight < modalHeight && this.options.scroll !== false) {
            this.resize(contentHeight);
        } else if (this.options.scroll !== false) {
            this.resize();
        }
    },

    /**
     * Adjust (animate) modal height to fit viewport on window resize
     */
    resize: function(contentHeight) {
        var winHeight = $(window).height(),
            oRatio = 0.8,
            paddingOuter = this.options.padding * 2,
            newHeight,
            newTopMargin,
            $modal = $("#RhModal"),
            $modalWrap = $("#RhWrap");

        this.center();

        if (!this.options.responsive) return;

        if (!this.options.height && !this.options.autoContentHeight) {
            newHeight = winHeight - this.options.offsetTopBottom;
        } else if (this.options.height) {
            if (winHeight < this.options.height) {
                newHeight = winHeight - this.options.offsetTopBottom;
            } else {
                newHeight = this.options.height - this.options.offsetTopBottom;
            }
        } else if (this.options.autoContentHeight && this.options.animate) {
            if (winHeight < this.contentHeight) {
                newHeight = winHeight * oRatio;
            } else {
                newHeight = this.contentHeight + this.options.innerOffset;
            }
        } else if (this.options.animate === false) {
            if (winHeight < contentHeight + this.options.innerOffset + (this.options.padding * 2)) {
                newHeight = winHeight * oRatio;
            } else {
                $modal.css({
                    "height": "auto"
                });
                $modalWrap.css({
                    "height": "auto"
                });
            }
            $modalWrap.css({
                "overflow-y": "auto"
            });
        }

        newTopMargin = Math.max(winHeight - newHeight, 0) / 2 - paddingOuter;

        $modal.animate({
            height: newHeight,
            top: newTopMargin
        });

        $modalWrap.height(newHeight - this.options.innerOffset);
    },

    /**
     * Sets up auto resize functionality (timeout set to zero to mimic current lightview functionality)
     */
    setupResize: function() {
        var _self = this;

        // if the height is not fixed animate the height on window resize
        if (this.options.height === null && this.options.autoResize === true) {

            var timeOut = false;
            $(window).on("resize.rhmodal", function() {

                if (timeOut !== false) {
                    clearTimeout(timeOut);
                }

                timeOut = setTimeout(timeOutFunc, _self.options.resizeTimeout);

                function timeOutFunc() {
                    $("#RhModal").clearQueue();
                    _self.resize();
                    _self.responsiveWidth();
                    _self.checkHeight();
                }

            });

            // otherwise just keep the modal centered and the width responsive
        } else {

            $(window).on("resize.rhmodal", function() {
                $("#RhModal").clearQueue();
                _self.center();
                _self.responsiveWidth();
            });

        }

    },

    /**
     * Closes modal window and calls removeModal()
     */
    close: function(callback) {
        var _self = this;

        if (this.options.fadeOut !== false) {
            $("#RhOverlay").fadeOut(_self.options.fadeOut);
            $("#RhModal").fadeOut(_self.options.fadeOut, function() {
                _self.remove(callback);
            });
        } else {
            this.remove(callback);
        }

    },

    /**
     * Removes modal modal markup and event handlers
     */
    remove: function(callback) {
        $("#RhOverlay").remove();

        if (this.options.href && this.options.href !== "") {
            this.unwrapContent();
            $(this.options.href).css({
                "display": "none"
            });
            $("#RhCloseWrap, #RhUp, #RhDown").remove();
        } else {
            $("#RhModal").remove();
        }

        $(window).off("resize.rhmodal");
        // callback
        if (typeof this.options.onClose === "function" || typeof callback === "function") {
            if (typeof callback !== "undefined") {
                callback();
            }
            if (typeof this.options.onClose !== "undefined") {
                this.options.onClose();
            }
        }
    },

    /**
     * Recursive function to remove RhModal wrap HTML from content
     */
    unwrapContent: function() {
        var rhmodal = $("#RhModal").length;

        if (!rhmodal) {
            return false;
        } else {
            $(this.options.href).unwrap();
            this.unwrapContent();
        }
    }

};

////////////////////////////
// END OF COMPONENT LOGIC //
////////////////////////////

// register RhModal object as a jQuery plugin
$.plugin(RhModal.name, RhModal);