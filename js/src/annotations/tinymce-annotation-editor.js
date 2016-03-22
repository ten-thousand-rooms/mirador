(function($){

  $.TinyMCEAnnotationBodyEditor = function(options) {

    jQuery.extend(this, {
      annotation: null,
      windowId: null
    }, options);

    this.init();
  };

  $.TinyMCEAnnotationBodyEditor.prototype = {
    init: function() {
      var _this = this;
      var annoText = "",
        tags = [];

      if (!jQuery.isEmptyObject(_this.annotation)) {
        if (jQuery.isArray(_this.annotation.resource)) {
          jQuery.each(_this.annotation.resource, function(index, value) {
            if (value['@type'] === "oa:Tag") {
              tags.push(value.chars);
            } else {
              annoText = value.chars;
            }
          });
        } else {
          annoText = _this.annotation.resource.chars;
        }
      }
      
      // XXX seong
      var layerSelectContainer = null;
      if ($.viewer) { // if viewer has been created
        layerSelectContainer = this.createLayerSelect();
      }

      this.editorMarkup = this.editorTemplate({
        content: annoText,
        tags : tags.join(" "),
        windowId : _this.windowId,
        layerSelect: layerSelectContainer ? layerSelectContainer.html() : '' // XXX seong
      });
    },

    show: function(selector) {
      this.editorContainer = jQuery(selector)
        .prepend(this.editorMarkup);
      tinymce.init({
        selector: selector + ' textarea',
        plugins: "image link media",
        menubar: false,
        statusbar: false,
        toolbar_items_size: 'small',
        toolbar: "bold italic | bullist numlist | link image media | removeformat",
        setup: function(editor) {
          editor.on('init', function(args) {
            tinymce.execCommand('mceFocus', false, args.target.id);
          });
        }
      });
    },

    isDirty: function() {
      return tinymce.activeEditor.isDirty();
    },

    createAnnotation: function() {
      var tagText = this.editorContainer.find('.tags-editor').val(),
        resourceText = tinymce.activeEditor.getContent(),
        tags = [];
      tagText = $.trimString(tagText);
      if (tagText) {
        tags = tagText.split(/\s+/);
      }

      var motivation = [],
        resource = [],
        on;

      if (tags && tags.length > 0) {
        motivation.push("oa:tagging");
        jQuery.each(tags, function(index, value) {
          resource.push({
            "@type": "oa:Tag",
            "chars": value
          });
        });
      }
      motivation.push("oa:commenting");
      resource.push({
        "@type": "dctypes:Text",
        "format": "text/html",
        "chars": resourceText
      });
    
      // XXX seong
      var _this = this;
      function getLayer() {
        var selectElem = _this.editorContainer.find('.layer_select');
        return selectElem.val();
      }
      var layer = getLayer(); // XXX seong
      
      return {
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@type": "oa:Annotation",
        "motivation": motivation,
        "resource": resource,
        "layer": layer // XXX seong
      };
    },

    updateAnnotation: function(oaAnno) {
      var tagText = this.editorContainer.find('.tags-editor').val(),
        resourceText = tinymce.activeEditor.getContent(),
        tags = [];
      tagText = $.trimString(tagText);
      if (tagText) {
        tags = tagText.split(/\s+/);
      }

      var motivation = [],
        resource = [];

      //remove all tag-related content in annotation
      oaAnno.motivation = jQuery.grep(oaAnno.motivation, function(value) {
        return value !== "oa:tagging";
      });
      oaAnno.resource = jQuery.grep(oaAnno.resource, function(value) {
        return value["@type"] !== "oa:Tag";
      });
      //re-add tagging if we have them
      if (tags.length > 0) {
        oaAnno.motivation.push("oa:tagging");
        jQuery.each(tags, function(index, value) {
          oaAnno.resource.push({
            "@type": "oa:Tag",
            "chars": value
          });
        });
      }
      jQuery.each(oaAnno.resource, function(index, value) {
        if (value["@type"] === "dctypes:Text") {
          value.chars = resourceText;
        }
      });
    },
    
    // XXX seong
    createLayerSelect: function () {
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
      return selectContainer;
    },

    editorTemplate: Handlebars.compile([
      '{{{layerSelect}}}', // XXX seong
      '<textarea class="text-editor" placeholder="{{t "comments"}}…">{{#if content}}{{content}}{{/if}}</textarea>',
      '<input id="tags-editor-{{windowId}}" class="tags-editor" placeholder="{{t "addTagsHere"}}…" {{#if tags}}value="{{tags}}"{{/if}}>'
    ].join(''))
  };
}(Mirador));
