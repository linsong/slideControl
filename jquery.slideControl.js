/*
 * slideControl - jQuery Plugin
 * version: 1.2 October 2012
 * @requires jQuery v1.6 or later
 *
 * Examples at http://nikorablin.com/slideControl
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($){
   $.fn.slideControl = function(options) {
    
    // defaults
    var defaults = {
      speed: 400,
      lowerBound: 1,
      upperBound: 10
    };

    var options = $.extend(defaults, options);
    
    return this.each(function() {
      
      // set vars
      var o = options;
      var controller = false;
      var position = 0;

      //position is width percentage of slideControlFill within slideControlContainer: 0% <= position <= 100%
      var pos2val = function(pos){return (o.upperBound-o.lowerBound)*pos/100.0;}
      //value is the value number in slideControlContainer's input element: lowerBound <= value <= upperBound
      var val2pos = function(val){return val*100.0/(o.upperBound-o.lowerBound);}

      var obj = this;
      $(this).addClass('slideControlInput');
      var parent = $(this).parent();
      var label = $(parent).find('label');
      parent.html("<label>" + $(label).html() + "</label><span class=\"slideControlContainer\"><span class=\"slideControlFill\" style=\"width:" + val2pos($(obj).val()) + "%\"><span class=\"slideControlHandle\"></span></span></span>" + $(obj).wrap("<span></span>").parent().html());
      var container = parent.find('.slideControlContainer');
      var fill = container.find('.slideControlFill');
      var handle = fill.find('.slideControlHandle');
      var input = parent.find('input');
      var handleWidth = $(handle).outerWidth();
      var animate = function(value){$(fill).animate({ width: value + "%"}, o.speed);}
      
      //adds shadow class to handle for IE <9
      if (getInternetExplorerVersion() < 9 && getInternetExplorerVersion() > -1) {
        handle.addClass('ieShadow');
      }
      
      // when user clicks anywhere on the slider
      $(container).click(function(e) {    
        e.preventDefault();
        var containerWidth = $(container).outerWidth()+1;
        var offset = $(container).offset();
        position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
        
        animate(position);
        var val = pos2val(position);
        $(input).val(val);
        $(input).trigger('slide.change', val);
      });
      
      // when user clicks handle
      $(handle).mousedown(function(e) {
        e.preventDefault();
        controller = true;
        var containerWidth = $(container).outerWidth()+1;
        var offset = $(container).offset();
        $(document).mousemove(function(e) {
          e.preventDefault();
          position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
          if (controller) { 
            $(fill).width(position + "%");
            $(input).val(pos2val(position));
          }
        });
        $(document).mouseup(function() {
          e.preventDefault();
          controller = false;
          $(input).trigger('slide.change', $(input).val());
        });
      });
      
      // when user changes value in input
      $(input).change(function() {
        var position= checkBoundaries(val2pos($(this).val()));
        if ($(this).val() > o.upperBound)
          $(input).val(o.upperBound);
        else if ($(this).val() < o.lowerBound)
          $(input).val(o.lowerBound);
        animate(position);
        $(input).trigger('slide.change', $(input).val());
      });
      
    });
    
    // checks if postion is within percentage boundaries
    function checkBoundaries(pos) {
      // pos is a percentage value, should be in [0.0, 100.0]
      if (pos > 100.0)
        return 100.0;
      else if (pos < 0.0)
        return 0.0;
      else
        return pos;
    }
    
    // checks ie version
    function getInternetExplorerVersion(){
       var rv = -1;
       if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
         rv = parseFloat( RegExp.$1 );
       }
       return rv;
    }
    return this;
   }
})(jQuery);
