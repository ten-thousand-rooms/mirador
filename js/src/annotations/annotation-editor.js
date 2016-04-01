// XXX seong

(function($) {
  
  $.AnnotationEditor = function(options) {
    jQuery.extend(this, {
      id: null,
      parent: null,
      canvasWindow: null, // reference window that contains the canvas
      mode: null, // "create" or "update"
      endpoint: null,
      annotation: null,
      closedCallback: null
    }, options);

    this.init();
    this.hide();
  };
  
  $.AnnotationEditor.prototype = {
    
    init: function() {
      this.id = this.id || $.genUUID();
      
      this.element = jQuery(this.template({})).attr('id', this.id)
        .appendTo(this.parent);
      var header = this.element.find('.header');
      var title = header.find('.title');
      this.linkToTarget = header.find('.anno_target_icon');
      this.textArea = this.element.find('textarea');
    
      if (this.mode === 'create') {
        title.text('Create Annotation');
        this.layerSelectContainer = this.element.find('.layer_select');
        this.layerSelect = new $.LayerSelect({
          parent: this.layerSelectContainer,
          endpoint: this.endpoint
        });
      } else { // update
        this.linkToTarget.hide();
        title.text('');
        this.textArea.val(this.annotation.resource[0].chars);
        this.element.find('.layer_select').css('left', -1000);
      }

      this.textAreaID = '#' + this.id + ' textarea';
      
      tinymce.init({
        selector: this.textAreaID,
        menubar: false,
        toolbar: 'bold italic | bullist numlist | link | undo redo | removeformat',
        statusbar: false,
        toolbar_items_size: 'small'
      });
      
      this.targetAnnotation = null;
      
      this.bindEvents();
    },
    
    show: function() {
      this.element.show();
    },
    
    hide: function() {
      this.element.hide();
    },
    
    destroy: function() {
      this.element.remove();
    },
    
    save: function() {
      var content = tinymce.activeEditor.getContent();

      if (this.mode == 'create') {
        var layerID = this.layerSelect.val();
        var annotation = this.createAnnotation(this.targetAnnotation, layerID, content);
        jQuery.publish('annotationCreated.' + this.canvasWindow.id, [annotation, null, layerID]);
      } else {
        this.annotation.resource[0].chars = content;
        jQuery.publish('annotationUpdated.' + this.canvasWindow.id, [this.annotation]);
      }
    },
    
    validate: function () {
      console.log('AnnotationEditor#validate target anno: ');
      console.dir(this.targetAnnotation);

      var msg = '';
      if (this.mode === 'create') {
        if (!this.targetAnnotation) {
          msg += 'Target annotation is missing.\n';
        }
      }
      if (this.mode === 'create' && !this.layerSelect.val()) {
        msg += 'Layer is not selected.\n';
      }
      if (tinymce.activeEditor.getContent().trim() === '') {
        msg += 'Please enter content.\n';
      }
      if (msg === '') {
        return true;
      } else {
        alert(msg);
        return false;
      }
    },
    
    createAnnotation: function (targetAnnotation, layerID, content) {
      var annotation = {
        '@context': 'http://iiif.io/api/presentation/2/context.json',
        '@type': 'oa:Annotation',
        motivation: ['oa:commenting'],
        resource: [{ 
          '@type': 'dctypes:Text',
          format: 'text/html',
          chars: content
        }],
        on: {
          '@type': 'oa:Annotation',
          full: targetAnnotation['@id']
        }
      };
      console.log('AnnotationEditor#createAnnotation anno: ' + JSON.stringify(annotation, null, 2));
      console.log('AnnotationEditor#createAnnotation layer: ' + layerID);
      return annotation;
    },
    
    bindEvents: function() {
      var _this = this;
      
      this.linkToTarget.click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        $.getLinesOverlay().startLine(event.pageX, event.pageY);
      });
      
      this.element.find('.save').click(function() {
        if (_this.validate()) {
          _this.save();
          _this.destroy();
        }
      });
      
      this.element.find('.cancel').click(function() {
        _this.destroy();
        if (typeof _this.closedCallback === 'function') {
          _this.closedCallback();
        }
      });
      
      jQuery.subscribe('target_annotation_selected', function(event, annotation) {
        _this.targetAnnotation = annotation;
        _this.linkToTarget
          .attr('title', annotation['@id'] + ': ' + annotation.resource[0].chars);
        _this.linkToTarget.removeClass('anno_on_canvas')
          .addClass('anno_on_anno');
      });
    },
    
    template: Handlebars.compile([
      '<div class="annotation_editor">',
      '  <div class="header">',
      '    <span class="anno_target_icon"><i class="fa fa-link"></i></span>',
      '    <span class="title"></span>',
      '  </div>',
      '  <textarea></textarea>',
      '  <div class="bottom_row">',
      '    <span class="layer_select"></span>',
      '    <div class="to_right">',
      '      <button class="save">Save</button>',
      '      <button class="cancel">Cancel</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(''))
    
  };
  
})(Mirador);