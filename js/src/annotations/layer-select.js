(function($) {
  
  $.LayerSelect = function(options) {
    jQuery.extend(this, {
      id: null,
      parent: null,
      mode: null // "create" or "update"
    }, options);

    this.init();
  };
  
  $.LayerSelect.prototype = {
    
    init: function() {
      var selectContainer = jQuery('<div/>');
      var select = jQuery('<select/>').addClass('layer_select');
      selectContainer.append(select);
      var endpoint = $.viewer.workspace.getWindowById(this.windowId).endpoint;
      var layers = endpoint.annotationLayers || [];
      var option = jQuery('<option />')
        .attr('selected', true)
        .val(null)
        .text('None');

      select.append(option);

      jQuery.each(layers, function (index, value) {
        var option = jQuery('<option/>').val(value['@id']).text(value.label);
        select.append(option);
      });
    }

  };
  
})(Mirador);
