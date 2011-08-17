// Flow //
$.load(function(){

flowInit = new riff.flow({
	desc : "flowInit",
	master : null,
	comps : [],
	eFn : function(){
		languageSet();
		flowIdle.run();
	//	widgetinfo();
	}
})

flowIdle = new riff.flow({
	desc : "flowInit",
	master : idleMaster,
	comps : [idle],
})


flowMain = new riff.flow({
	desc : "main",
	master : fullMaster,
	comps : [header,scene,mainList,mainSoftkey],
	sFn : function(){
	}
})


flowEventList = new riff.flow({
	desc : "Event List",
	master : fullMaster,
	comps : [header,scene,eventList,mainSoftkey],
	sFn : function(){
	}
})


flowTapDetail = new riff.flow({
	desc : "flowDragDropDetail",
	master : fullMaster,
	comps : [header, scene, tapBox, doubleTapBox, longTapBox ,mainSoftkey],
	eFn : function(){
		$e.tap( tapBox.cId, function(){ alertWindow.start("Tap");} );
		$e.doubleTap( doubleTapBox.cId, function(){ alertWindow.start("Double Tap");} );
		$e.longTap( longTapBox.cId, function(){ alertWindow.start("Long Tap");} );
	}
})

flowFlickDetail = new riff.flow({
	desc : "flowFlickDetail",
	master : fullMaster,
	comps : [header,scene, flickBox, mainSoftkey],
	eFn : function(){
		$e.flick( flickBox.cId, function( direction ){ alertWindow.start("Flick "+direction) } );
	}
})

flowDragDropDetail = new riff.flow({
	desc : "flowDragDropDetail",
	master : fullMaster,
	comps : [header,scene, dragBox, dropBox, mainSoftkey],
	sFn : function(){
		console.log("flowDragDropDetail sFn START");
	},
	eFn : function(){
		console.log("flowDragDropDetail eFn START");
		$e.dragDrop( dragBox.cId, dropBox.cId, function( mouseEvent, eventStatus ){ 
			alertWindow.start( "Dran and Drop! Inside:" + eventStatus.dragDropIsInside );
		});
		$m.css( dragBox.cId, "left", "0px" );
		$m.css( dragBox.cId, "top", "100px" );
	}
})

flowAjaxList = new riff.flow({
	desc : "Ajax List",
	master : fullMaster,
	comps : [header,scene,ajaxList,mainSoftkey],
	 
})

flowAjaxNews = new riff.flow({
	desc : "Ajax News Feed List",
	master : fullMaster,
	comps : [header,scene,ajaxNewsList,mainSoftkey],
	sFn : function(){
		riff.ui.global.ajaxUI.busyStart();
	},
	eFn : function(){
		$a.exec( {
			openOption : {
				url : "http://175.125.20.219/xml/xml.php?url=http://news.yahoo.com/rss/" 
			},
			success : {
				fn: function(_readyState, _status, _text, _XML, _args){
					riff.util.xmlToContent( _XML, ajaxNewsList );					
					ajaxNewsList.run();
					riff.ui.global.ajaxUI.busyEnd();
				}
			}
		});
	}
})

flowResolutionList = new riff.flow({
	desc : "Resolution",
	master : fullMaster,
	comps : [header,scene,resolutionList,resolutionSoftkey],
})



flowLanguageList = new riff.flow({
	desc : "Language",
	master : fullMaster,
	comps : [header,scene,languageList,languageSoftkey],
})








flowInit.run();

});



		
		