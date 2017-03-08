(function($) {

  $.OpenSeadragon = function(options) {

    var osd = OpenSeadragon(

      jQuery.extend({
        preserveViewport: true,
        visibilityRatio:  1,
        minZoomLevel:     0,
        defaultZoomLevel: 0,
        blendTime:        0.1,
        alwaysBlend:      false,
        showNavigationControl: false,
        zoomPerClick: 1.2, // XXX seong default: 2.0
        zoomPerScroll: 1.1 // XXX seong default: 1.2
      }, options)

    );

    return osd;

  };

}(Mirador));
