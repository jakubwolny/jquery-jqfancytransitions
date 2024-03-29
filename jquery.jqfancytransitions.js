/**
 * jqFancyTransitions - jQuery plugin
 * @version: 1.8 (2010/06/13)
 * @requires jQuery v1.2.2 or later 
 * @author Ivan Lazarevic
 * Examples and documentation at: http://www.workshop.rs/projects/jqfancytransitions
 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
**/

(function($) {
    var opts = {};
    var level = [];
    var img = [];
    var links = [];
    var titles = [];
    var order = [];
    var imgInc = [];
    var inc = [];
    var stripInt = [];
    var imgInt = [];	
	
    $.fn.jqFancyTransitions = $.fn.jqfancytransitions = function(options){
	
        var init = function(el){
            var strip, gap, offset, tstrip;
            
            opts[el.id] = $.extend({}, $.fn.jqFancyTransitions.defaults, options);
            img[el.id] = []; // images array
            links[el.id] = []; // links array
            titles[el.id] = []; // titles array
            order[el.id] = []; // strips order array
            imgInc[el.id] = 0;
            inc[el.id] = 0;

            var params = opts[el.id];

            if(params.effect == 'zipper'){
                params.direction = 'alternate';
                params.position = 'alternate';
            }
            if(params.effect == 'wave'){
                params.direction = 'alternate';
                params.position = params.horizontal ? 'left' : 'top';
            }
            if(params.effect == 'curtain'){
                params.direction = 'alternate';
                params.position = 'curtain';
            }	

            if(params.horizontal){
                strip = parseInt(params.height / params.strips);
                gap = params.height - strip * params.strips; // number of pixels
            }else {
                // width of strips    
                strip = parseInt(params.width / params.strips);
                gap = params.width - strip * params.strips; // number of pixels
            }

            offset = 0;

            // create images and titles arrays
            $.each($('#' + el.id + ' img'), function(i, item){
                img[el.id][i] = $(item).attr('src');
                links[el.id][i] = $(item).next().attr('href');
                titles[el.id][i] = $(item).attr('alt') ? $(item).attr('alt') : '';
                $(item).hide();
            });

            // set panel
            $('#'+el.id).css({
                'background-image':'url(' + img[el.id][0] + ')',
                'width': params.width,
                'height': params.height,
                'position': 'relative',
                'background-position': 'top left'
            });

            // create title bar
            $('#' + el.id).append("<div class='ft-title' id='ft-title-" + el.id + "' style='position: absolute; bottom:0; left: 0; z-index: 1000; color: #fff; background-color: #000; '>"+titles[el.id][0]+"</div>");
            if(titles[el.id][imgInc[el.id]]){
                $('#ft-title-' + el.id).css('opacity', opts[el.id].titleOpacity);
            } else {
                $('#ft-title-' + el.id).css('opacity', 0);
            }                

            if(params.navigation){
                $.navigation(el);
                $('#ft-buttons-'+el.id).children().first().addClass('ft-button-'+el.id+'-active');			
            }

            var odd = 1;
            // creating bars
            // and set their position
            for(var j = 1; j < params.strips + 1; j++){
			
                if(gap > 0){
                    tstrip = strip + 1;
                    gap--;
                } else {
                    tstrip = strip;
                }
			
                if(params.links){
                    $('#' + el.id).append("<a href='"+links[el.id][0]+"' class='ft-"+el.id+"' id='ft-"+el.id+j+"' style='width:"+tstrip+"px; height:"+params.height+"px; float: left; position: absolute;outline:none;'></a>");
                } else {
                    if(params.horizontal){
                        $('#' + el.id).append("<div class='ft-" + el.id + "' id='ft-" + el.id + j + "' style='width:" + params.width + "px; height:" + tstrip + "px; position: absolute;'></div>");   
                    }else{
                        $('#' + el.id).append("<div class='ft-" + el.id + "' id='ft-" + el.id + j + "' style='width:" + tstrip + "px; height:" + params.height + "px; float: left; position: absolute;'></div>");
                    }
                }
							
                // positioning bars
                $("#ft-" + el.id + j).css(params.horizontal ? {
                    'background-position': '0 ' + -offset + 'px',
                    'top' : offset 
                } : {
                    'background-position': -offset + 'px top',
                    'left' : offset 
                });
			
                offset += tstrip;

                if(params.position == 'bottom'){
                    $("#ft-" + el.id + j).css('bottom', 0);
                } else if(params.position == 'right'){
                    $("#ft-" + el.id + j).css('right', 0);
                }
				
                if (j % 2 == 0 && params.position == 'alternate'){
                    $("#ft-" + el.id + j).css('bottom', 0);
                }                    
	
                // bars order
                // fountain
                if(params.direction == 'fountain' || params.direction == 'fountainAlternate'){ 
                    order[el.id][j-1] = parseInt(params.strips/2) - (parseInt(j/2)*odd);
                    order[el.id][params.strips-1] = params.strips; // fix for odd number of bars
                    odd *= -1;
                } else {
                    // linear
                    order[el.id][j - 1] = j;
                }
	
            }

            $('.ft-' + el.id).mouseover(function(){
                opts[el.id].pause = true;
            });
		
            $('.ft-' + el.id).mouseout(function(){
                opts[el.id].pause = false;
            });	
			
            $('#ft-title-' + el.id).mouseover(function(){
                opts[el.id].pause = true;
            });
		
            $('#ft-title-' + el.id).mouseout(function(){
                opts[el.id].pause = false;
            });				
		
            clearInterval(imgInt[el.id]);	
            imgInt[el.id] = setInterval(function() {
                $.transition(el)
            }, params.delay+params.stripDelay*params.strips);

        };

        // transition
        $.transition = function(el,direction){

            if(opts[el.id].pause == true){
                return;
            } 

            stripInt[el.id] = setInterval(function() {
                $.strips(order[el.id][inc[el.id]], el);
            }, opts[el.id].stripDelay);
		
            $('#'+el.id).css({
                'background-image': 'url('+img[el.id][imgInc[el.id]]+')'
            });
		
            if(typeof(direction) == "undefined"){
                imgInc[el.id]++;
            }else {
                if(direction == 'prev'){
                    imgInc[el.id]--;
                } else {
                    imgInc[el.id] = direction;
                }                
            }            

            if  (imgInc[el.id] == img[el.id].length) {
                imgInc[el.id] = 0;
            }
		
            if (imgInc[el.id] == -1){
                imgInc[el.id] = img[el.id].length-1;
            }
		
            if(titles[el.id][imgInc[el.id]]!=''){
                $('#ft-title-'+el.id).animate({
                    opacity: 0
                }, opts[el.id].titleSpeed, function(){
                    $(this).html(titles[el.id][imgInc[el.id]]).animate({
                        opacity: opts[el.id].titleOpacity
                    }, opts[el.id].titleSpeed);
                });
            } else {
                $('#ft-title-'+el.id).animate({
                    opacity: 0
                }, opts[el.id].titleSpeed);
            }
		
            inc[el.id] = 0;
		
            var buttons = $('#ft-buttons-'+el.id).children();
		
            buttons.each(function(index){
                if(index == imgInc[el.id]){
                    $(this).addClass('ft-button-'+el.id+'-active');
                } else{
                    $(this).removeClass('ft-button-'+el.id+'-active');
                }
            });		

            if(opts[el.id].direction == 'random'){
                $.fisherYates (order[el.id]);
            }                
			
            if((opts[el.id].direction == 'right' && order[el.id][0] == 1)
                || (opts[el.id].direction == 'bottom' && order[el.id][0] == 1)
                || opts[el.id].direction == 'alternate'
                || opts[el.id].direction == 'fountainAlternate'){
                order[el.id].reverse();
            }                
        };

        // strips animations
        $.strips = function(itemId, el){
            var current;
            var temp = opts[el.id].strips;
            if (inc[el.id] == temp) {
                clearInterval(stripInt[el.id]);
                return;
            }
            $('.ft-'+el.id).attr('href',links[el.id][imgInc[el.id]]);
            if(opts[el.id].position == 'curtain'){
                if(opts[el.id].horizontal){
                    current = $('#ft-'+el.id+itemId).height();
                    $('#ft-'+el.id+itemId).css({
                        height: 0, 
                        opacity: 0, 
                        'background-image': 'url(' + img[el.id][imgInc[el.id]] + ')'
                    });
                    $('#ft-'+el.id+itemId).animate({
                        height: current, 
                        opacity: 1
                    }, 1000);
                }else {
                    current = $('#ft-'+el.id+itemId).width();
                    $('#ft-'+el.id+itemId).css({
                        width: 0, 
                        opacity: 0, 
                        'background-image': 'url(' + img[el.id][imgInc[el.id]] + ')'
                    });
                    $('#ft-'+el.id+itemId).animate({
                        width: current, 
                        opacity: 1
                    }, 1000);
                }
            } else {
                if(opts[el.id].horizontal){
                    $('#ft-'+el.id+itemId).css({
                        width: 0, 
                        opacity: 0, 
                        'background-image': 'url('+img[el.id][imgInc[el.id]]+')'
                    });
                    $('#ft-'+el.id+itemId).animate({
                        width: opts[el.id].width,
                        opacity: 1
                    }, 1000);
                }else {
                    $('#ft-'+el.id+itemId).css({
                        height: 0, 
                        opacity: 0, 
                        'background-image': 'url('+img[el.id][imgInc[el.id]]+')'
                    });
                    $('#ft-'+el.id+itemId).animate({
                        height: opts[el.id].height, 
                        opacity: 1
                    }, 1000);
                }
            }
		
            inc[el.id]++;
		
        };

        // navigation
        $.navigation = function(el){
            // create prev and next 
            $('#'+el.id).append("<a href='#' id='ft-prev-"+el.id+"' class='ft-prev'>prev</a>");
            $('#'+el.id).append("<a href='#' id='ft-next-"+el.id+"' class='ft-next'>next</a>");
            $('#ft-prev-'+el.id).css({
                'position' 	: 'absolute',
                'top'		: params.height/2 - 15,
                'left'		: 0,
                'z-index' 	: params.zIndex,
                'line-height': '30px',
                'opacity'	: 0.7
            }).click( function(e){
                e.preventDefault();
                $.transition(el,'prev');
                clearInterval(imgInt[el.id]);
                imgInt[el.id] = setInterval(function() {
                    $.transition(el)
                }, params.delay+params.stripDelay*params.strips);		
            });

            $('#ft-next-'+el.id).css({
                'position' 	: 'absolute',
                'top'		: params.height/2 - 15,
                'right'		: 0,
                'z-index' 	: params.zIndex,
                'line-height': '30px',
                'opacity'	: 0.7
            }).click( function(e){
                e.preventDefault();
                $.transition(el);
                clearInterval(imgInt[el.id]);
                imgInt[el.id] = setInterval(function() {
                    $.transition(el)
                }, params.delay + params.stripDelay * params.strips);
            });

            // image buttons
            $("<div id='ft-buttons-"+el.id+"'></div>").insertAfter($('#'+el.id));
            $('#ft-buttons-'+el.id).css({
                'text-align' 	: 'right',
                'padding-top'	: 5,
                'width'			: opts[el.id].width
            });
            for(var k = 1; k < img[el.id].length + 1; k++){
                $('#ft-buttons-'+el.id).append("<a href='#' class='ft-button-"+el.id+"'>"+k+"</a>");
            }
            $('.ft-button-'+el.id).css({
                'padding' 	: 5
            });

            $.each($('.ft-button-'+el.id), function(i,item){
                $(item).click( function(e){
                    e.preventDefault();
                    $.transition(el,i);
                    clearInterval(imgInt[el.id]);
                    imgInt[el.id] = setInterval(function() {
                        $.transition(el)
                    }, params.delay + params.stripDelay * params.strips);				
                })
            });		
        }
	


        // shuffle array function
        $.fisherYates = function(arr) {
            var i = arr.length;
            if (i == 0){
                return false;
            }
            
            while (--i) {
                var j = Math.floor(Math.random() * (i + 1));
                var tempi = arr[i];
                var tempj = arr[j];
                arr[i] = tempj;
                arr[j] = tempi;
            }
        }	
		
        this.each (function(){
            init(this);
        });
    };

    // default values
    $.fn.jqFancyTransitions.defaults = {	
        width: 500, // width of panel
        height: 332, // height of panel
        strips: 10, // number of strips
        delay: 5000, // delay between images in ms
        stripDelay: 50, // delay beetwen strips in ms
        titleOpacity: 0.7, // opacity of title
        titleSpeed: 1000, // speed of title appereance in ms
        position: 'alternate', // top, bottom, left, right, alternate, curtain
        direction: 'fountainAlternate', // left, right, top, bottom, alternate, random, fountain, fountainAlternate
        effect: '', // curtain, zipper, wave
        navigation: false, // prev next and buttons
        links : false, // show images as links 		
        zIndex: 1001,
        horizontal: false
    };
	
})(jQuery);