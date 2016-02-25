(function($) {

  $.AnnotationWindow = function(options) {
    console.log('AnnotationWindow constructor');

    jQuery.extend(this, {
      element: null,
      imageWindow: null
    }, options);

    this.init();
    this.bindEvents();
  };

  $.AnnotationWindow.prototype = {
    
    init: function () {
      var _this = this;
      console.log('AnnotationWindow#init this.appendTo: ' + this.appendTo);
      var templateData = {};
      this.element = jQuery(this.template(templateData)).appendTo(this.appendTo);
      console.log('this.element: ' + this.element.html());
      
      this.updateList();
      this.initLayers();
    },
    
    initLayers: function () {
      var layers = this.imageWindow.endpoint.annotationLayers;
      console.log('AnnotationWindow#initLayers layers: ' + JSON.stringify(layers, null, 2));
      var layerSelect = this.element.find('.annowin_select_layer');
      var option = jQuery('<option/>').val('Any').text('Any');
      layerSelect.append(option);
      
      jQuery.each(layers, function (index, value) {
        option = jQuery('<option/>').val(value.label).text(value.label);
        layerSelect.append(option);
      });
    },
    
    updateList: function() {
      var _this = this;
      var annotationsList = this.imageWindow.annotationsList;
      console.log('annotationsList:');
      console.dir(annotationsList);
      
      this.listElem = this.element.find('.annowin_list');
      
      jQuery.each(annotationsList, function(index, value) {
        try {
          _this.addAnnotation(value);
        } catch (e) {
          console.log('ERROR AnnotationWindow#updateList ' + e);
        }
      });
    },
    
    addAnnotation: function(annotation) {
      var _this = this;
      var content = annotation.resource[0].chars;
      var annoHtml = this.annotationTemplate({content: content});
      var annoElem = jQuery(annoHtml);
      
      annoElem.click(function (event) {
        var windowId = _this.imageWindow.id;
        console.log('anno click anno:'); 
        console.dir(annotation);
        var selectorStr = annotation.on.selector.value;
        console.log('windowId: ' + windowId);
        console.log('selectorStr: ' + selectorStr);
        jQuery.publish('annotation_focused.' + windowId, selectorStr);
      });
      
      this.listElem.append(annoElem);
    },
    
    bindEvents: function () {
      var _this = this;
      
      jQuery('.annowin_remove_slot').click(function(event) {
        console.log('click');
        event.stopPropagation();
        event.preventDefault();
        var slot = _this.parent;
        var workspace = slot.parent;
        workspace.removeNode(slot);
      });
    },
    
    // template should be based on workspace type
    template: Handlebars.compile([
      '<div class="window annowin">',
      '  <div class="annowin_header">',
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
