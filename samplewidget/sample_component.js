$.load(function(){

/////////////            Component              ///////////////////

scene = new riff.component.container({		
	cId : "scene",
	addClassName :"rf-custom-scene",
	createSet : {
		clear : "none"
	},
	alwaysRun : true,
});

header = new riff.component.container({		
	cId : "header",
	addClassName : "rf-factory-header",
	bodyId : "header-body",
	fixed : true,
	alwaysRun : true,
	content : "Riff Sample Widget",
	createSet : {
		type : "str"
	},
});

idle = new riff.component.container({
	cId : "idleC",
	addClassName : "rf-component-idlec",
	content : "Tap to fullmode",
	alwaysRun : true,
	eFn : function(){
		$e.tap(this.cId,function(){
			flowMain.run();		
		})
	}
	
});

mainSoftkey = new riff.component.softkey({		
	cId : "mainSoftkey",		
	bodyId : "mainSoftkey-body",				
	fixed : true,		
	alwaysRun : true,
	content : "",
});

resolutionSoftkey = new riff.component.softkey({		
	cId : "resolutionSoftkey",		
	bodyId : "resolutionSoftkey-body",				
	fixed : true,		
	alwaysRun : true,
	content : [
		{
			id : "resolutionSoftkey-done",
			str : "Done",
			event : function(){
				resolutionSetting();
			}
		}
	]
});

languageSoftkey = new riff.component.softkey({		
	cId : "languageSoftkey",		
	bodyId : "languageSoftkey-body",				
	fixed : true,		
	alwaysRun : true,
	content : [
		{
			id : "languageSoftkey-done",
			str : "Done",
			event : function(){
				var tLang = languageList.getValue();
				riff.global.language.currentLanguage = tLang.value;
				riff.ui.global.objs.flow.back.run("back");
			}
		}
	]
});

mainList = new riff.component.list({		
	cId : "mainList",		
	bodyId : "mainList-body",				
	alwaysRun : true,
	content : [
		/*{
			tit : "Component",
			text : "Riff's Components.",
			event : function(){
				
			}
		},*/
		{
			tit : "Event",
			text : "Touch Events",
			event : function(){
				flowEventList.run();
			}
		},
		{
			tit : "Ajax",
			text : "Ajax Processing Module",
			event : function(){
				flowAjaxList.run();
			}
		},
		{
			tit : "Device Variation",
			text : "Support various resolutions",
			event : function(){
				flowResolutionList.run();
			}
		},
		{
			tit : "Multi Language",
			text : "Easy translation",
			event : function(){
				flowLanguageList.run();
			}
		}
		
	],
	addObj : function(){
		this.callStyle("setting");
	},
	
});

info = new riff.component.container({
	cId : "info",
	bodyId : "info-body",
	addClassName : "rf-info",
	alwaysRun : true,
	content: "Info",
	createSet : {
		type : "str",
	},
	sFn : function(){
		widgetinfo();
	}	
});

tapBox = new riff.component.container({
	cId : "tapBox",
	addClassName : "tapBoxClass"
})

doubleTapBox = new riff.component.container({
	cId : "doubleTapBox",
	addClassName : "tapBoxClass",
})

longTapBox = new riff.component.container({
	cId : "longTapBox",
	addClassName : "tapBoxClass",
})

flickBox = new riff.component.container({
	cId : "flickBox",
	addClassName : "flickBoxClass",
})

dragBox = new riff.component.container({
	cId : "dragBox",
	addClassName : "dragBoxClass",
})

dropBox = new riff.component.container({
	cId : "dropBox",
	addClassName : "dropBoxClass",
})


eventList = new riff.component.list({		
	cId : "eventList",		
	bodyId : "eventList-body",				
	alwaysRun : true,
	content : [
		{
			tit : "Tap",
			event : function(){
				flowTapDetail.run();
			}
		},
		{
			tit : "Flick",
			event : function(){
				flowFlickDetail.run();
			}
		},
		{
			tit : "Drag n Drop",
			event : function(){
				flowDragDropDetail.run();
			}
		},
	]
});

ajaxList = new riff.component.list({		
	cId : "ajaxList",		
	bodyId : "ajaxList-body",				
	alwaysRun : true,
	content : [
		{
			tit : "News RSS Feed",
			text : "Public RSS feed of Yahoo! News",
			event : function(){
				flowAjaxNews.run();		
			}
		},
	],
	addObj : function(){
		this.callStyle("setting");
	}
});

ajaxNewsList = new riff.component.list({		
	cId : "ajaxNewsList",		
	bodyId : "ajaxNewsList-body",				
	alwaysRun : true,
	content : null,
}); 

resolutionList = new riff.component.list({		
	cId : "resolutionList",		
	bodyId : "resolutionList-body",				
	alwaysRun : true,
	content : [
		{
			text : "WVGA",
			value : "wvga",
			checked : true
		},
		{
			text : "WQVGA",
			value : "wqvga"
		},
		{
			text : "HVGA",
			value : "hvga"
		},
	],
	addObj : function(){
		this.callRadio();
	}
});

languageList = new riff.component.list({		
	cId : "multilanguageList",		
	bodyId : "multilanguageList-body",				
	alwaysRun : true,
	content : [
		{
			text : "English",
			value : "en",
			checked : true
		},
		{
			text : "Korean",
			value : "ko"
		},
		{
			text : "French",
			value : "fr"
		},
	],
	addObj : function(){
		this.callRadio();
	},
});

alertWindow = new riff.component.modal({		
	cId : "alert",
	bodyId : "alert-body",
	sFn : function(_arg){
		var tArg = _arg;
		this.content = _arg[0];
		this.okFn = _arg[1];

		this.children.forEach(function(_el){ _el.start()});
	},
	stopFn : function(_arg){			
		this.children.forEach(function(_el){_el.stop()});
		if(this.okFn) this.okFn();
	},
	addClassName : "rf-custom-alert",
});	

popupOk = new riff.component.btn({		
	cId : "biOk",
	content : "OK",		
	parent : alertWindow,
	alwaysRun : true,	
	eFn : function(_arg){
		tParent = this.parent;
		riff.event.tap(this.cId,function(){
			tParent.stop();
		})
	},		
	addClassName : "rf-custom-okBtn",
});


busyindicator = new riff.component.modal({		
	cId : "busyindicator",
	bodyId : "busyindicator-body",
	content : "<img src='"+riff.ui.global.theme.imgSrc+"popup_loading.gif'>Loading...",
	createSet : {
		type : "str"
	},
	sFn : function(){
		this.children.forEach(function(_el){_el.start()});
	},
	addClassName : "rf-custom-busyindicator",
});

popupCancel = new riff.component.btn({		
	cId : "biCancel",
	content : "Cancel",		
	parent : busyindicator,
	alwaysRun : true,	
	eFn : function(){
		riff.event.tap(this.cId,function(){
			riff.ajax.abortAllAjax();
		})
	},
	addClassName : "rf-custom-cancelBtn",
});



});