(function($) {

  $.AnnotationWindow = function(options) {
    jQuery.extend(this, {
      element: null,
      canvasWindow: null, // window that contains the canvas for the annotations
    }, options);

    this.init();
  };

  $.AnnotationWindow.prototype = {
    
    init: function () {
      console.log('AnnotationWindow#init this.appendTo: ' + this.appendTo);
      this.element = jQuery(this.template({})).appendTo(this.appendTo);
      this.layerSelect = this.element.find('.annowin_select_layer');
      this.currentLayerID = 'any';
      
      this.reload();
      this.bindEvents();
    },
    
    reload: function () {
      var canvas = this.getCurrentCanvas();
      this.element.find('.title').text(canvas.label);
      this.updateLayers();
      this.updateList(this.layerSelect.val());
    },
    
    updateLayers: function () {
      var _this = this;
      var layers = this.canvasWindow.endpoint.annotationLayers;
      var layerSelect = this.layerSelect;
      
      layerSelect.empty();
      layers.unshift({ '@id': 'any', label: 'Any' });
      
      jQuery.each(layers, function (index, value) {
        var layerID = value['@id'];
        option = jQuery('<option/>').val(layerID).text(value.label);
        console.log('CUR: ' + this.currentLayerID);
        console.log('OPT: ' + layerID);
        if (layerID === _this.currentLayerID) {
          option.attr('selected', true);
        }
        layerSelect.append(option);
      });
    },
    
    updateList: function(layerId) {
      var _this = this;
      var annotationsList = this.canvasWindow.annotationsList;
      console.log('annotationsList:');
      console.dir(annotationsList);
      
      this.listElem = this.element.find('.annowin_list');
      this.listElem.empty();
      
      jQuery.each(annotationsList, function(index, value) {
        try {
          if (layerId === 'any' || layerId === value.layerId) {
            _this.addAnnotation(value);
          }
        } catch (e) {
          console.log('ERROR AnnotationWindow#updateList ' + e);
        }
      });
    },
    
    addAnnotation: function(annotation) {
      //console.log('AnnotationWindow#addAnnotation:');
      //console.dir(annotation);
      var _this = this;
      var content = annotation.resource[0].chars;
      var annoHtml = this.annotationTemplate({content: content});
      var annoElem = jQuery(annoHtml);
      
      annoElem.click(function (event) {
        var windowId = _this.canvasWindow.id;
        var selectorStr = annotation.on.selector.value;
        jQuery.publish('annotation_focused.' + windowId, selectorStr);
      });
      
      this.listElem.append(annoElem);
    },
    
    getCurrentCanvas: function() {
      var window = this.canvasWindow;
      var id = window.currentCanvasID;
      var canvases = window.manifest.getCanvases();
      return canvases.filter(function (canvas) {
        return canvas['@id'] === id;
      })[0];
    },
    
    bindEvents: function () {
      var _this = this;
      
      jQuery('.annowin_remove_slot').click(function(event) {
        event.stopPropagation();
        event.preventDefault();
        var slot = _this.parent;
        var workspace = slot.parent;
        workspace.removeNode(slot);
      });
      
      // When a new layer is selected
      this.layerSelect.change(function(event) {
        console.log('LAYER SELECTED: ' + _this.layerSelect.val());
        _this.currentLayerID = _this.layerSelect.val();
        _this.updateList(_this.currentLayerID);
      });
      
      jQuery.subscribe('endpointAnnoListLoaded', function(event, windowID) {
        _this.reload();
      });
    },
    
    // template should be based on workspace type
    template: Handlebars.compile([
      '<div class="window annowin">',
      '  <div class="annowin_header">',
      '    <span class="title"></span>',
      '    <a class="annowin_remove_slot"><i class="fa fa-times fa-lg fa-fw"></i></a>',
      '  </div>',
      '  <div class="annowin_layer_row">', 
      '    Layer: <select class="annowin_select_layer"></select>',
      '  </div>',
      '  <div class="annowin_list">',
      '  </div>',
      '</div>'
    ].join('')),
    
    annotationTemplate: Handlebars.compile([
      '<div class="annowin_anno">{{{content}}}</div>'
    ].join(''))

  };

})(Mirador);
