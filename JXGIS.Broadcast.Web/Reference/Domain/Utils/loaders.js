define(["xstyle/css!lib/css/loaders.css"], function () {
    jxgis = typeof (jxgis) == 'undefined' ? {} : jxgis;

    var loadingTypes = {
        ballPulse: {
            'class': 'ball-pulse',
            html:
                '<div class="ball-pulse">' +
                '<div></div>' +
                '<div></div>' +
                '<div></div>' +
                '</div>'
        },
        ballGridPulse: {
            'class': 'ball-grid-pulse',
            html:
               '<div class="ball-grid-pulse">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballClipRotate: {
            'class': 'ball-clip-rotate',
            html:
               '<div class="ball-clip-rotate">' +
               '<div></div>' +
               '</div>'
        },
        ballClipRotatePulse: {
            'class': 'ball-clip-rotate-pulse',
            html:
               '<div class="ball-clip-rotate-pulse">' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        squareSpin: {
            'class': 'square-spin',
            html:
                '<div class="square-spin">' +
                '<div></div>' +
                '</div>'
        },
        ballClipRotateMultiple: {
            'class': 'ball-clip-rotate-multiple',
            html:
               '<div class="ball-clip-rotate-multiple">' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballPulseRise: {
            'class': 'ball-pulse-rise',
            html:
               '<div class="ball-pulse-rise">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballRotat: {
            'class': 'ball-rotate',
            html:
               '<div class="ball-rotate">' +
               '<div></div>' +
               '</div>'
        },
        cubeTransition: {
            'class': 'cube-transition',
            html:
               '<div class="cube-transition">' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballZigZag: {
            'class': 'ball-zig-zag',
            html:
               '<div class="ball-zig-zag">' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballZigZagDeflect: {
            'class': 'ball-zig-zag-deflect',
            html:
               '<div class="ball-zig-zag-deflect">' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballTrianglePath: {
            'class': 'ball-triangle-path',
            html:
               '<div class="ball-triangle-path">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballScale: {
            'class': 'ball-scale',
            html:
               '<div class="ball-scale">' +
               '<div></div>' +
               '</div>'
        },
        lineScale: {
            'class': 'line-scale',
            html:
               '<div class="line-scale">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        lineScaleParty: {
            'class': 'line-scale-party',
            html:
               '<div class="line-scale-party">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballScaleMultiple: {
            'class': 'ball-scale-multiple',
            html:
               '<div class="ball-scale-multiple">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballPulseSync: {
            'class': 'ball-pulse-sync',
            html:
               '<div class="ball-pulse-sync">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballBeat: {
            'class': 'ball-beat',
            html:
               '<div class="ball-beat">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        lineScalePulseOut: {
            'class': 'line-scale-pulse-out',
            html:
               '<div class="line-scale-pulse-out">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        lineScalePulseOutRapid: {
            'class': 'line-scale-pulse-out-rapid',
            html:
               '<div class="line-scale-pulse-out-rapid">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballScaleRipple: {
            'class': 'ball-scale-ripple',
            html:
               '<div class="ball-scale-ripple">' +
               '<div></div>' +
               '</div>'
        },
        ballScaleRippleMultiple: {
            'class': 'ball-scale-ripple-multiple',
            html:
               '<div class="ball-scale-ripple-multiple">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballSpinFadeLoader: {
            'class': 'ball-spin-fade-loader',
            html:
               '<div class="ball-spin-fade-loader">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        lineSpinFadeLoader: {
            'class': 'line-spin-fade-loader',
            html:
               '<div class="line-spin-fade-loader">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        triangleSkewSpin: {
            'class': 'triangle-skew-spin',
            html:
               '<div class="triangle-skew-spin">' +
               '<div></div>' +
               '</div>'
        },
        pacman: {
            'class': 'pacman',
            html:
               '<div class="pacman">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        ballGridBeat: {
            'class': 'ball-grid-beat',
            html:
               '<div class="ball-grid-beat">' +
               '<div></div>' +
               '<div></div>' +
               '<div></div' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '<div></div>' +
               '</div>'
        },
        semiCircleSpin: {
            'class': 'semi-circle-spin',
            html:
               '<div class="semi-circle-spin">' +
               '<div></div>' +
               '</div>'
        },
        prettyAudioWave: {
            'class': 'loader--audioWave',
            html: '<div class="loader loader--audioWave"></div>'
        },
        prettySnake: {
            'class': 'loader--snake',
            html: '<div class="loader loader--snake"></div>'
        },
        prettySpinningDisc: {
            'class': 'loader--spinningDisc',
            html: '<div class="loader loader--spinningDisc"></div>'
        },
        prettyGlisteningWindow: {
            'class': 'loader--glisteningWindow',
            html: '<div class="loader loader--glisteningWindow"></div>'
        },
        prettyCircularSquare: {
            'class': 'loader--circularSquare',
            html: '<div class="loader loader--circularSquare"></div>'
        }
    };

    function showLoading($dom, type, message) {
        hideLoading($dom);
        var t = type ? type : loadingTypes.ballPulse;
        var $loading = $('<div class="ct-loader"><div>' + t.html + '</div>' + (message ? ('<div class="ct-loader-message">' + message + '</div>') : '') + '</div>');
        if (t.class.indexOf('loader--') == 0) $loading.css({
            'background-color': 'rgba(231, 231, 231, 0.7)',
            color: '#666'
        });
        $loading.appendTo($dom);
        return {
            loading: $loading,
            messager: $loading.find('.ct-loader-message'),
            hideLoading: function () {
                $loading.remove();
            }
        };
    }

    function hideLoading($dom) {
        $dom.find('.ct-loader').remove();
    }

    jxgis.loaders = {
        types: loadingTypes,
        showLoading: showLoading,
        hideLoading: hideLoading
    };

    return jxgis.loaders;
});