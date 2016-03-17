// XXX seong

(function($) {
  
  $.AnnotationEditor = function(options) {
    jQuery.extend(this, {
      id: null,
      parent: null,
      mode: null // "create" or "update"
    }, options);

    this.init();
    this.hide();
  };
  
  $.AnnotationEditor.prototype = {
    
    init: function() {
      this.id = this.id || $.genUUID();
      
      this.element = jQuery(this.template({})).attr('id', this.id);
      this.parent.append(this.element);
      
      this.setHeader();
      
      tinymce.init({
        selector: '#' + this.id + ' textarea',
        menubar: false,
        toolbar: 'bold italic | bullist numlist | link | undo redo | removeformat',
        statusbar: false,
        toolbar_items_size: 'small'
      });
    },
    
    setHeader: function() {
      var header = this.element.find('.header');
      if (this.mode === 'create') {
        header.text('Create Annotation');
        header.show();
      } else {
        header.hide();
      }
    },
    
    show: function() {
      this.element.show();
    },
    
    hide: function() {
      this.element.hide();
    },
    
    template: Handlebars.compile([
      '<div>',
      '  <div class="header"></div>',
      '  <textarea></textarea>',
      '</div>'
    ].join(''))
    
  };
  
})(Mirador);