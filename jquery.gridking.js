(function($) {
    $.fn.gridKing = function(elem,options){
	var gk = this;
	gk.$elem = $(elem);
	gk.elem = elem;

	gk.init = function(){
	    gk.options = $.extend({},$.gridKing.defaultOptions,options);	    
	};
	
        return this.each( function() {
            $(this).text("Hello, World!");
        });
    };

}(jQuery));
