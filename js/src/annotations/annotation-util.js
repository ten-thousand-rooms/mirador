// XXX seong

(function($) {
  
  $.annoUtil = {

    // Get bounds of multiple paper.js shapes.
    getCombinedBounds: function (shapes) {
      console.log('shapes: ' + shapes);
      var bounds = null;
      jQuery.each(shapes, function (index, shape) {
        if (bounds) {
          bounds = bounds.unite(shape.strokeBounds);
        } else {
          bounds = shape.strokeBounds;
        }
        console.log('index: ' + index + ', bounds: ' + bounds);
      });
      return bounds;
    },
    
    highlightShape: function (shape) {
      if (!shape._ym_oldStrokeColor) {
        shape._ym_oldStrokeColor = shape.strokeColor;
      }
      if (!shape._ym_oldStrokeWdth) {
        shape._ym_oldStrokeWidth = shape.strokeWidth;
      }
      shape.set({ 
        //strokeColor: 'yellow',
        strokeWidth: 30,
        opacity: 1 
      });
    },
    
    deHighlightShape: function (shape) {
      if (shape._ym_oldStrokeColor) {
        shape.set({ strokeColor: shape._ym_oldStrokeColor });
      }
      if (shape._ym_oldStrokeWidth) {
        shape.set({ strokeWidth: shape._ym_oldStrokeWidth });
      }
      shape.opacity = 0;
    },
    
    getAnnotation: function (annotationID, successCallback, errorCallback) {
      var url = annotationID;
      
      jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          if (typeof successCallback === 'function') {
            successCallback(data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (typeof errorCallback === 'function') {
            errorCallback();
          } else {
            console.log('annoUtil#getAnnotation failed to retrieve annotation url: ' + url);
          }
        }
      });
    }

  };
  
})(Mirador);
