(function($) {
    $.gridKing = function(element,options){
	
	var gk = this;
	gk.$element = $(element);
	gk.element = element;
	gk.$element.data("gridking", gk);
	
	gk.init = function(){
	    gk.options = $.extend({},$.gridKing.defaultOptions,options);

	    gk.addGKProperties(gk.element);
	    gk.initGUI(gk.element);
	};

	// Add the CSS properties, attributes etc. that Grid-King needs to function
	gk.addGKProperties = function(element){
	    $(element).addClass("gk-grid-container gk-dashed")
		.attr("tabindex", "-1");
	    
	    $(".gk-grid-container [class*=col] , .gk-grid-container .row")
		.attr("data-selectable","1");	    
	};

	// Remove the Grid-King CSS properties, attributes etc.
	gk.removeGKProperties = function(element){
	    $(".gk-grid-container [class*=col] , .gk-grid-container .row")
		.removeAttribute("data-selectable");
	    
	    $(element).removeClass("gk-grid-container gk-dashed")
		.removeAttribute("tabindex");
	};

	// add a button to one of the toolbars
	gk.addToolbarButton = function(toolbar, icon, tooltip, onClick){
	    $('<div class="gk-toolbar-item"></div>')
		.addClass(icon)
		.appendTo($('<div class="gk-toolbar-item-container"></div>')
			  .attr("title",tooltip)
			  .click(onClick)
			  .appendTo(toolbar));
	};
	
	// create the toolbars and other gui elements
	gk.initGUI = function(element){
	    // create toolbars
	    $(element).prepend('<div class="gk-toolbar gk-col-toolbar" style="display:none"></div>')
		.prepend('<div class="gk-toolbar gk-row-toolbar" style="display:none"></div>');
	    
	    // col toolbar buttons
	    gk.addToolbarButton(".gk-col-toolbar", "fa fa-arrows-alt", "Move" ,function(){
		console.log("drag col");
	    });

	    gk.addToolbarButton(".gk-col-toolbar", "fa fa-minus-circle", "Make column narrower", function(){
		console.log("col smaller");	
	    });

	    gk.addToolbarButton(".gk-col-toolbar","fa fa-plus-circle", "Make column wider" ,function(){
		console.log("col bigger");
		gk.increaseColSize($(".gk-selected.gk-selected-col")[0]);
	    });

	    gk.addToolbarButton(".gk-col-toolbar","fa fa-cog", "Options", function(){
		console.log("col options");
	    });

	    gk.addToolbarButton(".gk-col-toolbar","fa fa-trash-alt", "Delete Column", function(){
		console.log("col delete");
	    });

	    gk.addToolbarButton(".gk-col-toolbar","fa fa-plus-square", "Add row", function(){
		console.log("col add row");
	    });

	    // row toolbar buttons
	    gk.addToolbarButton(".gk-row-toolbar","fa fa-arrows-alt", "Move", function(){
		console.log("drag row");
	    });
	    
	    gk.addToolbarButton(".gk-row-toolbar","fa fa-cog", "Options", function(){
		console.log("row options");
	    });
	    
	    gk.addToolbarButton(".gk-row-toolbar","fa fa-trash-alt", "Delete Row", function(){
		console.log("row delete");
	    });

	    gk.addToolbarButton(".gk-row-toolbar","fa fa-plus-square","Add Column" ,function(){
		console.log("row add col");
	    });
	    	    
	    // setup element selection
	    $("[class*=col][data-selectable]").click(function(){
		 gk.deselect();
		 gk.selectElement(this);
	    });

	    // deselect when clicking outside editable area
	    $(".gk-grid-container").focusout(function(event){
		 gk.deselect();
	     });	   
	};
	
	// remove the toolbars and other gui elements
	gk.removeGUI = function(){
	    $(".gk-toolbar").remove();
	};

	gk.selectElement = function(element){
	    $(element).addClass("gk-selected gk-selected-col")
		.parent(".row")
		.addClass("gk-selected-row");
	    gk.attachColToolbar(element);
	    gk.attachRowToolbar($(element).parent());
	};

	gk.deselect = function(element){
	    $(".gk-grid-container div").removeClass("gk-selected gk-selected-row gk-selected-col");
	    $(".gk-col-toolbar").hide();
	    $(".gk-row-toolbar").hide();
	};

	gk.attachColToolbar = function(element){
	    var p = $(element).position();
	    var h = $(".gk-col-toolbar").height();
	    $(".gk-col-toolbar").css("top",p.top-h)
		.css("left",p.left - 1)
		.show();
	};

	gk.attachRowToolbar = function(element){
	    var p = $(element).position();
	    var ew = $(element).outerWidth();
	    var eh = $(element).height();
	    var h = $(".gk-col-toolbar").height();
	    $(".gk-row-toolbar").css("top", p.top + eh + 1)
		.css("left",p.left + (ew - $(".gk-row-toolbar").outerWidth()) - 11)
		.show();
	};

	gk.increaseColSize = function(element){
	    var colClass = gk.findColClass(element);
	    if(colClass != undefined){
		var classParts = colClass.match(/col-?(xs|sm|md|lg|\b)-?(\d+|\b)/);
		var numCols = gk.clamp(parseInt(classParts[2]) + 1,1,12);
		var size = classParts[1] == "" ? "" : classParts[1] + "-";
		// for now, leave bs4 cols with no col number alone.
		if(numCols == NaN || numCols == undefined){
		    // do nothing to this col
		}
		else{
		    var newClass="col-"+size+numCols;
		    console.log("new class: "+newClass);
		}
	    }
	};

	gk.findColClass = function(element){
	    var colClasses = element.className.split(/\s+/)
		.filter(function(v){
		    return v.startsWith("col");
		});
	
	    if(colClasses.length > 0){
		return colClasses[0];
	    }
	};

	gk.clamp = function(val, min, max){
	    return val > max ? max : val < min ? min : val;
	}
	
	// start everything up
	gk.init();
    };
    
    $.gridKing.defaultOptions = {
	debug : 0,
	rowLayouts : [
            [12],
            [6, 6],
            [4, 4, 4],
            [3, 3, 3, 3],
            [2, 2, 2, 2, 2, 2],
            [2, 8, 2],
            [4, 8],
            [8, 4]
        ],
    };
    
    $.fn.gridKing = function(options){
	return this.each(function(){
	    var element = $(this);
            var gridKing = new $.gridKing(this, options);
            element.data('gridking', gridKing);
	    console.log("initializing gridking");
	});

    };

}(jQuery));
