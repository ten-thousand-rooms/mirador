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
        console.log('bounds: ' + bounds);
      });
      return bounds;
    },
    
    highlightShapes: function (shapes) {
      jQuery.each(shapes, function (index, shape) {
        shape.strokeColor = 'orange';
        shape.strokeWidth = 2;
      });
    }
    
  };
  
})(Mirador);
