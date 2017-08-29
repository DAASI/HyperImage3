/*
	Copyright 2015 Renee Carmichael, Leuphana Universität Lüneburg. All rights reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/


/* shows title translation */
$(document).ready(function() {
	$(".language-title").click(function () {
		if ($('.PROJECT_TITLE_DEFAULT').is(":visible")) { 
			$('.PROJECT_TITLE_DEFAULT').css({display:'none'});
			$('.PROJECT_TITLE_TRANSLATE').css({display:'block'}); 
		} else {
			$('.PROJECT_TITLE_DEFAULT').css({display:'block'});
			$('.PROJECT_TITLE_TRANSLATE').css({display:'none'}); 
		}
					
	});
});	

$(window).load(function() {
	if ($('.title-2').text() == $('.title-default').text()) {
		$('.title').css({display:'block'});
		$('.title-2').css({display:'none'});
	} else if ($('.title-2').text() !== $('.title-default').text()) {
		$('.title').css({display:'none'});
		$('.title-2').css({display:'block'});
	}
});
				
		
/* shows and hides menu and overlay */		
$( document ).ready(function() {
	$(".menu-icon").click(function () {
		if ($('#CANVAS_MENU').is(":hidden")) {
			$('#canvasWrapper').addClass('overlay');
			$('#canvasWrapper').css({position:'fixed'});
			$('#infotext').addClass('overlay');
			$('#loadingIndicator').css({display:'none'});
			$('#sidebar').css({position:'fixed'});
			$('#canvas').addClass('overlay');
		} else {
			$('#canvasWrapper').removeClass('overlay');
			$('#canvasWrapper').css({position:'inherit'});
			$('#infotext').removeClass('overlay');
			$('#canvas').removeClass('overlay');
			$('#sidebar').css({position:'inherit'});
		}
			$("#CANVAS_MENU").slideToggle("slow");
	});
});


/* Hides #CANVAS_MENU when a menu item is clicked */			
$( document ).ready(function() {
	$("#CANVAS_MENU").click(function () {
		$('#canvasWrapper').removeClass('overlay');
		$('#canvasWrapper').css({position:'inherit'});
		$('#infotext').removeClass('overlay');
		$('#canvas').removeClass('overlay');
		$('#sidebar').css({position:'inherit'});
		$('#CANVAS_MENU').slideToggle("slow");
	});
});


/* on mobile/tablet shows and hides sidebar on click */			
$(document).ready(function() {
	$(".sidebar-display").click(function () {
		if (screen.width <= 1024) {
			if ($('#sidebar').is(":hidden")) {
				$('#tabs').css({display:'block'});
				$('#sidebar').css({width:'330px'});
				$('.mobile-sidebar-icon').css({display:'none'});
				$('.mobile-sidebar-back').css({display:'block'});
			} else {
				$('#tabs').css({display:'none'});
				$('.mobile-sidebar-icon').css({display:'block'});
				$('.mobile-sidebar-back').css({display:'none'});	
			}
			$("#sidebar").toggle();
		}
	});
});

/* function so url does not change */
function urlFunction (){
	window.location.protocol;
}
		
/* makes sure things load properly on popstate */
$(window).on('popstate', function() {
	$('.mobile-sidebar-icon').css({display:'inherit'});	
	showTab(reader.prefs['TABS_STANDARD']);
	$('.zoom-in').removeClass('non');
	if (screen.width <= 1024) {			
		loadHiResIfNeeded();
		findHigherRes();
	}
});
	
/* for mobile/tablet allows lita menu items to function on tap */	
$(window).load(function() {
	$('.MENU_SWITCH_ON').off("vclick");
	$('.MENU_SWITCH_ON').on("vclick", function(e) {
		e.preventDefault();
		displayLightTable();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
	});
});
		
$(window).load(function() {
	$('.MENU_VIEW_TO_LITA').off("vclick");
	$('.MENU_VIEW_TO_LITA').one("vclick", function(e) {
		addViewToLightTable();
	});
});
		
$( document ).ready(function() {
	$('.MENULITA_SWITCH_OFF').off("vclick");
	$(".MENULITA_SWITCH_OFF").on("vclick", function(e) {
		e.preventDefault();
		returnFromLightTable();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		$('#canvasWrapper').css({position:'absolute'});
		$('.mobile-sidebar-icon').css({display:'inherit'});
	});
});
$(window).load(function() {
	$('.MENULITA_NAME').off("vclick");
	$(".MENULITA_NAME").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		nameTable();
	});
});
		
$(window).load(function() {
	$('.MENULITA_ADD_ANNOTATION').off("vclick");
	$(".MENULITA_ADD_ANNOTATION").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		addAnnotation();
	});
});
		
$(window).load(function() {
	$('.MENULITA_REMOVE_ANNOTATION').off("vclick");
	$(".MENULITA_REMOVE_ANNOTATION").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		removeAnnotation();
	});
});
		
$(window).load(function() {
	$('.MENULITA_SAVE').off("vclick");
	$(".MENULITA_SAVE").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		saveLocalTable();
	});
});
		
$(window).load(function() {
	$('.MENULITA_INSERT_LINK').off("vclick");
	$(".MENULITA_INSERT_LINK").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		insertAnnotationLink();
	});
});
		
$(window).load(function() {
	$('.MENULITA_XML_CLIPBOARD').off("vclick");
	$(".MENULITA_XML_CLIPBOARD").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		showTableXML();
	});
});
		
$(window).load(function() {
	$('.MENULITA_NEW_LITA').off("vclick");
	$(".MENULITA_NEW_LITA").on("vclick", function( e) {
		e.preventDefault();
		$("#CANVAS_MENU").hide();
		$('#canvas').removeClass('overlay');
		$('#canvasWrapper').removeClass('overlay');
		newLocalTable();
		displayLightTable();
	});
});

$(document).ready(function() {
	$('.context-close').off("vclick");
	$(".context-close").on("vclick", function( e) {
		$("#layer-context").hide();
	    $('.tooltip').hide();
	    $('[id$=_group]').css('fill-opacity', 0.0);
	    $('[id$=_group]').css('stroke-width', 0);
	    $('.off').fadeOut(1000);
	});
});

function hookAndShowDateSlider (divName, selectorType) {
	// this basically means that there exists atleast 1 object having a date
	if (reader.timeslider.startDate && reader.timeslider.endDate) {
        // means only one object or the objects have the same date
		if (reader.timeslider.startDate.isSame(reader.timeslider.endDate)) {
            reader.timeslider.defaultLowerBound = new Date(reader.timeslider.startDate.get("year"), 0, 1);
            reader.timeslider.defaultUpperBound = new Date(reader.timeslider.endDate.get("year"), 11, 31);
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            reader.timeslider.obj = $("#dateSlider").dateRangeSlider(
                {
                	
                	arrows:false,
                    wheelMode: "zoom",
                    bounds:{
                        min: reader.timeslider.defaultLowerBound,
                        max: reader.timeslider.defaultUpperBound
                    },
                    scales: [{
                        first: function(value){ return value; },
                        end: function(value) {return value; },
                        next: function(value){
                            var next = new Date(value);
                            return new Date(next.setMonth(value.getMonth() + 1));
                        },
                        label: function(value){
                            return months[value.getMonth()];
                        },
                        format: function(tickContainer, tickStart, tickEnd){
                            tickContainer.addClass("myCustomClass");
                        }
                    }]
                }
            );
		} else if (reader.timeslider.endDate.diff(reader.timeslider.startDate, "years") <= 1) {
            reader.timeslider.defaultLowerBound = new Date(reader.timeslider.startDate.get("year"), 0, 1);
            reader.timeslider.defaultUpperBound = new Date(reader.timeslider.endDate.get("year"), 11, 31);
            reader.timeslider.obj = $("#dateSlider").dateRangeSlider(
				{
					
					arrows:false,
                    wheelMode: "zoom",
					bounds:{
                        min: reader.timeslider.defaultLowerBound,
                        max: reader.timeslider.defaultUpperBound
					},
					scales: [{
						first: function(value){ return value; },
						end: function(value) {return value; },
						next: function(value){
							var next = new Date(value);
							return new Date(next.setMonth(value.getMonth() + 1));
						},
						label: function(value){
							return months[value.getMonth()];
						},
						format: function(tickContainer, tickStart, tickEnd){
							tickContainer.addClass("myCustomClass");
						}
					}]
				}
			);
		} else {
            reader.timeslider.defaultLowerBound = new Date(reader.timeslider.startDate.get("year"), 0, 1);
            var interval = Math.floor((reader.timeslider.endDate.get("year") - reader.timeslider.startDate.get("year"))/7);
            var exceedingYears = (reader.timeslider.endDate.get("year") - reader.timeslider.startDate.get("year"))%7;
			reader.timeslider.defaultUpperBound = new Date(reader.timeslider.endDate.get("year") + exceedingYears, 11, 31);
            reader.timeslider.obj = $("#dateSlider").dateRangeSlider(
				{
                    arrows:false,
                    wheelMode: "zoom",
					bounds:{
						min: reader.timeslider.defaultLowerBound,
						max: reader.timeslider.defaultUpperBound
					},
					scales: [{
						first: function(value){ return value; },
						end: function(value) {return value; },
						next: function(value){
							var interval = Math.floor((reader.timeslider.endDate.get("year") - reader.timeslider.startDate.get("year"))/7);
							var next = new Date(value);
							return new Date(next.setFullYear(value.getFullYear() + interval));
						},
						label: function(value){
							return value.getFullYear();
						},
						format: function(tickContainer, tickStart, tickEnd){
							tickContainer.addClass("myCustomClass");
						}
					}]
				}
			);
		}

        reader.timeslider.obj.on("valuesChanged", function(e, data){
            var selectorQuery = "#" +divName + " > " + selectorType;
            var attributeQuery = "^data-timeslider";

            $(selectorQuery).each(function() {
                var selector = this;
                $.each(this.attributes,function(i,a){
                    if (a.name.match(attributeQuery)) {
                        var filterTime = moment(a.value, reader.timeslider.timeFormat);
                        if (filterTime.isValid()) {
                            var timeFrom = moment(data.values.min.getTime(), "x");
                            var timeTo = moment(data.values.max.getTime(), "x");

                            if (filterTime.isBefore(timeFrom) || filterTime.isAfter(timeTo)) {
                                $(selector).fadeTo(500, 0.5);
                            } else {
                                $(selector).fadeTo(500, 1);
                            }
                        } else {
                        	// we only want to fade objects or light table frames (frameType null means its a light table)
                            var frameType = selector.firstElementChild.getAttribute("href");
                        	if ((frameType && frameType.startsWith("#O")) || !frameType) {
                                $(selector).fadeTo(500, 0.2);
							}
						}
                    }
                })
            });
        });

		// setting default opacity of objects and light tables
        var selectorQuery = "#" +divName + " > " + selectorType;
        var attributeQuery = "^data-timeslider";

        $(selectorQuery).each(function() {
            var selector = this;
            $.each(this.attributes,function(i,a){
                if (a.name.match(attributeQuery)) {
                    var filterTime = moment(a.value, reader.timeslider.timeFormat);
                    if (filterTime.isValid()) {
						var timeFrom = moment(reader.timeslider.defaultLowerBound);
						var timeTo = moment(reader.timeslider.defaultUpperBound);

                        if (filterTime.isBefore(timeFrom) || filterTime.isAfter(timeTo)) {
                            $(selector).fadeTo(500, 0.5);
                        } else {
                            $(selector).fadeTo(500, 1);
                        }
                    } else {
                        // we only want to fade objects or light table frames (frameType null means its a light table)
                        var frameType = selector.firstElementChild.getAttribute("href");
                        if ((frameType && frameType.startsWith("#O")) || !frameType) {
                            $(selector).fadeTo(500, 0.2);
                        }
                    }
                }
            })
        });

        reader.timeslider.obj.dateRangeSlider("values", reader.timeslider.defaultLowerBound, reader.timeslider.defaultUpperBound);
	}
}

function destroyAndHideTimeSlider () {
	if (reader.timeslider.obj) {
        reader.timeslider.obj.dateRangeSlider("destroy");
        reader.timeslider.obj = null;
	}

    reader.timeslider.startDate = null;
    reader.timeslider.endDate = null;
    reader.timeslider.defaultLowerBound = null;
    reader.timeslider.defaultUpperBound = null;
}