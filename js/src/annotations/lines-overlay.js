// Overlay for drawing connection informations.

(function($) {

  var LinesOverlay = function() {
    this.init();
  };
    
  LinesOverlay.prototype = {
    
    init: function() {
      this.canvas = jQuery('<canvas id="lines_overlay"/>');
      jQuery('body').append(this.canvas);
      this.ctx = this.canvas[0].getContext('2d');
      
      this.dragging = false;
      
      this.resize();
      this.bindEvents();
    },
    
    isActive: function() {
      return this.dragging;
    },
    
    startLine: function(x, y) {
      this.dragging = true;
      this.startX = x;
      this.startY = y;
      console.log('x: ' + x + ', y: ' + y);
    },
    
    endLine: function() {
      this.dragging = false;
      this.clearCanvas();
    },
    
    resize: function() {
      this.ctx.canvas.width = window.innerWidth;
      this.ctx.canvas.height = window.innerHeight;
    },
    
    drawLine: function(x0, y0, x1, y1) {
      console.log('drawLine (' + x0 + ',' + y0 + ') -> (' + x1 + ',' + y1 + ')');
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = '#e07000';
      ctx.lineWidth = 2;
      ctx.closePath();
      ctx.stroke();
    },
    
    clearCanvas: function() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    },
    
    bindEvents: function() {
      var _this = this;
      jQuery('body').mousemove(function(event) {
        //console.log('canvas mouse move ' + event.pageX + ', ' + event.pageY);
        //console.log('drag: ' + _this.dragging);
        if (_this.dragging) {
          console.log('DRAG');
          _this.clearCanvas();
          _this.drawLine(_this.startX, _this.startY, event.pageX, event.pageY);
        }
      });
      jQuery('body').click(function(event) {
        _this.endLine();
      });
      jQuery.subscribe('resizeMirador', function(event) {
        _this.resize();
      });
    }
  };
  
  var _instance = null;
  
  $.getLinesOverlay = function() {
    if (! _instance) {
      _instance = new LinesOverlay();
    }
    return _instance;
  };

})(Mirador);
