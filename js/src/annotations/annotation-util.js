(function($) {
  
  $.annoUtil = {

    // Get bounds of multiple paper.js shapes.
    getCombinedBounds: function (shapes) {
      var bounds = null;
      jQuery.each(shapes, function (index, shape) {
        if (bounds) {
          bounds = bounds.unite(shape.strokeBounds);
        } else {
          bounds = shape.strokeBounds;
        }
      });
      return bounds;
    },
    
    highlightShape: function (shape) {
      shape.strokeColor = 'orange';
      shape.strokeWidth = 10;
    },
    
    deHighlightShape: function (shape) {
      shape.strokeColor = 'blue';
      shape.strokeWidth = 1;
    }
    
  };
  
})(Mirador);
