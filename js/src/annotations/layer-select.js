(function($) {
  
  $.LayerSelect = function(options) {
    jQuery.extend(this, {
      parent: null,
      endpoint: null,
      changeCallback: null
    }, options);

    this.init();
  };
  
  $.LayerSelect.prototype = {
    
    init: function() {
      var _this = this;
      this.select = jQuery('<select/>').addClass('layer_select');
      this.parent.append(this.select);
      var layers = this.endpoint.annotationLayers || [];
      var option = jQuery('<option />')
        .attr('selected', true)
        .val(null)
        .text('Select a layer');

      this.select.append(option);

      jQuery.each(layers, function (index, value) {
        var option = jQuery('<option/>').val(value['@id']).text(value.label);
        _this.select.append(option);
      });
      
      this.select.change(function(event) {
        var layerID = _this.select.val();
        console.log('LAYER SELECTED: ' + layerID);
        if (_this.changeCallback === 'function') {
          _this.changeCallback(layerID);
        }
      });
    },
    
    value: function() {
      return this.select.val();
    }

  };
  
})(Mirador);
