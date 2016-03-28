// XXX seong

(function($) {

  $.AnnotationWindow = function(options) {
    jQuery.extend(this, {
      element: null,
      parent: null, // slot
      canvasWindow: null, // window that contains the canvas for the annotations
    }, options);

    this.init();
  };

  $.AnnotationWindow.prototype = {
    
    init: function () {
      console.log('AnnotationWindow#init this.appendTo: ' + this.appendTo);
      this.endpoint = this.canvasWindow.endpoint;
      this.element = jQuery(this.template({})).appendTo(this.appendTo);
      this.layerSelect = this.element.find('.annowin_select_layer');
      this.currentLayerID = 'any';
      this.editorRow = this.element.find('.annowin_creator'); // placeholder for annotation editor for creation
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
      var layers = this.endpoint.annotationLayers;
      var layerSelect = this.layerSelect;
      
      layerSelect.empty();
      layers = [{ '@id': 'any', label: 'Any' }].concat(layers);
      
      jQuery.each(layers, function (index, value) {
        var layerID = value['@id'];
        option = jQuery('<option/>').val(layerID).text(value.label);
        if (layerID === _this.currentLayerID) {
          option.attr('selected', true);
        }
        layerSelect.append(option);
      });
    },
    
    updateList: function(layerID) {
      var _this = this;
      var annotationsList = this.canvasWindow.annotationsList;
      console.log('annotationsList:');
      console.dir(annotationsList);
      
      this.listElem = this.element.find('.annowin_list');
      this.listElem.empty();
      
      jQuery.each(annotationsList, function(index, value) {
        try {
          if (layerID === 'any' || layerID === value.layerID) {
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
      
      annoElem.data('annotationID', annotation['@id']);
      
      annoElem.click(function(event) {
        var windowId = _this.canvasWindow.id;
        
        if ($.getLinesOverlay().isActive()) {
          jQuery.publish('target_annotation_selected', annotation);
        } else {
          _this.highlightFocusedAnnotation(annotation);
          jQuery.publish('annotation_focused.' + windowId, annotation);
        }
      });
      
      annoElem.find('.annowin_edit').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        var editor = new $.AnnotationEditor({
          parent: annoElem,
          canvasWindow: _this.canvasWindow,
          mode: 'update',
          endpoint: _this.endpoint,
          annotation: annotation,
          closedCallback: function () {
            annoElem.find('.normal_view').show();
          }
        });
        
        annoElem.find('.normal_view').hide();
        editor.show();
      });
      
      annoElem.find('.annowin_delete').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (window.confirm('Do you really want to delete the annotation?')) {
          jQuery.publish('annotationDeleted.' + _this.canvasWindow.id, [annotation['@id']]);
        }
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
    
    highlightFocusedAnnotation: function(annotation) {
      this.listElem.find('.annowin_anno').each(function(index, value) {
        var annoElem = jQuery(value);
        var annoID = annoElem.data('annotationID');
        if (annoID === annotation['@id']) {
          annoElem.addClass('annowin_focused');
        } else {
          annoElem.removeClass('annowin_focused');
        }
      });
    },
    
    highlightTargetedAnnotation: function(targetAnnotationID) {
      this.listElem.find('.annowin_anno').each(function(index, value) {
        var annoElem = jQuery(value);
        var annoID = annoElem.data('annotationID');
        if (annoID === targetAnnotationID) {
          annoElem.addClass('annowin_targeted');
        } else {
          annoElem.removeClass('annowin_targeted');
        }
      });
    },

    bindEvents: function() {
      var _this = this;
      
      this.element.find('.mirador-icon-window-menu').on('mouseenter',
        function() {
          _this.element.find('.slot-controls').stop().slideFadeToggle(300);
      }).on('mouseleave',
        function() {
          _this.element.find('.slot-controls').stop().slideFadeToggle(300);
      });
      
      this.element.find('.add-slot-right').on('click', function() {
        $.viewer.workspace.splitRight(_this.parent);
      });

      this.element.find('.add-slot-left').on('click', function() {
        $.viewer.workspace.splitLeft(_this.parent);
      });

      this.element.find('.add-slot-below').on('click', function() {
        $.viewer.workspace.splitDown(_this.parent);
      });

      this.element.find('.add-slot-above').on('click', function() {
        $.viewer.workspace.splitUp(_this.parent);
      });
      
      this.element.find('.annowin_create_anno').click(function(event) {
        event.stopPropagation();
        event.preventDefault();
        var editor = new $.AnnotationEditor({
          parent: _this.editorRow,
          canvasWindow: _this.canvasWindow,
          mode: 'create',
          endpoint: _this.endpoint
        });
        editor.show();
      });
      
      this.element.find('.annowin_remove_slot').click(function(event) {
        event.stopPropagation();
        event.preventDefault();
        var slot = _this.parent;
        var workspace = slot.parent;
        workspace.removeNode(slot);
      });
      
      // When a new layer is selected
      this.layerSelect.change(function(event) {
        console.log('AnnotationWindow layer selected: ' + _this.layerSelect.val());
        _this.currentLayerID = _this.layerSelect.val();
        _this.updateList(_this.currentLayerID);
      });
      
      jQuery.subscribe('endpointAnnoListLoaded', function(event, windowID) {
        _this.reload();
      });
      
      jQuery.subscribe('annotation_focused.' + this.canvasWindow.id, function(event, annotation) {
        console.log('Annotation window received annotation_focused event');
        if (annotation.on['@type'] == 'oa:Annotation') {
          var targetID = annotation.on.full;
          _this.highlightTargetedAnnotation(targetID);
        }
      });
    },
    
    // template should be based on workspace type
    template: Handlebars.compile([
      '<div class="window annowin">',
      '  <div class="annowin_header">',
      '    <a href="javascript:;" class="mirador-btn mirador-icon-window-menu annowin_window_menu" title="{{t "changeLayout"}}"><i class="fa fa-table fa-lg fa-fw"></i>',
      '      <ul class="dropdown slot-controls">',
      '        <li class="add-slot-right"><i class="fa fa-caret-square-o-right fa-lg fa-fw"></i> {{t "addSlotRight"}}</li>',
      '        <li class="add-slot-left"><i class="fa fa-caret-square-o-left fa-lg fa-fw"></i> {{t "addSlotLeft"}}</li>',
      '        <li class="add-slot-above"><i class="fa fa-caret-square-o-up fa-lg fa-fw"></i> {{t "addSlotAbove"}}</li>',
      '        <li class="add-slot-below"><i class="fa fa-caret-square-o-down fa-lg fa-fw"></i> {{t "addSlotBelow"}}</li>',
      '      </ul>',
      '    </a>',
      '    <span class="title"></span>',
      '    <a class="annowin_remove_slot"><i class="fa fa-times fa-lg fa-fw"></i></a>',
      '  </div>',
      '  <div class="annowin_layer_row">', 
      '    Layer: <select class="annowin_select_layer"></select>',
      '    <a class="annowin_create_anno"><i class="fa fa-edit fa-lg fa-fw"></i></a>',
      '  </div>',
      '  <div class="annowin_creator"></div>',
      '  <div class="annowin_list">',
      '  </div>',
      '</div>'
    ].join('')),
    
    annotationTemplate: Handlebars.compile([
      '<div class="annowin_anno">',
      '  <div class="normal_view">',
      '    <div class="to_right">',
      '      <a class="annowin_edit"><i class="fa fa-edit"></i></a>',
      '      <a class="annowin_delete"><i class="fa fa-times"></i></a>',
      '    </div>',
      '    <div class="content">{{{content}}}</div>',
      '  </div>',
      '</div>'
    ].join(''))

  };

})(Mirador);
