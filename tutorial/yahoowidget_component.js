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
	addClassName : riff.widget.global.component.className.header,
	bodyId : "header-body",
	alwaysRun: true,
	fixed : true,
	multiContent : { 
		yahoo : "<img src='./theme/img/headerlogo.png'>",
		setting : "Settings",
		autoRefresh : "Auto refresh",
		autoScroll : "Auto Scroll"
	},
	createSet : {
		type : "str"
	},
	eFn : function(){
		if(this.selectContentKey == "yahoo"){
			riff.event.enableDisable(this.bodyId,"tap","enable");
			riff.event.tap(this.bodyId, function(){
				riff.widget.openURL( riff.widget.global.yahoo.globalUrl );
			});
			
		} else {
			riff.event.enableDisable(this.bodyId,"tap","disable");
		}
	}
});

busyindicator = new riff.component.modal({		
	cId : "busyindicator",
	bodyId : "busyindicator-body",
	content : "<img src='./theme/img/wqvga_popup_loading.gif'>Loading...",
	createSet : {
		type : "str"
	},
	sFn : function(){
		this.children.forEach(function(_el){_el.start()});
	},
	addClassName : "rf-custom-busyindicator",
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

popupCancel = new riff.component.btn({		
	cId : "biCancel",
	content : "Cancel",		
	parent : busyindicator,
	alwaysRun : true,	
	eFn : function(){
		riff.event.tap(this.cId,function(){	
			riff.ajax.abortAllAjax()
		})
	},
	addClassName : "rf-custom-cancelBtn",
});

	
///////////////////////// idle /////////////////////////
//Idle
idleLogo = new riff.component.container({		
	cId : "idleLogo",
	content : "Yahoo News!",
	fixed : true,
	alwaysRun : true,
	addClassName : "rf-custom-idleLogo",
});

idleRefresh = new riff.component.btn({		
	cId : "idleRefresh",
	content : "Refresh",
	alwaysRun : true,
	eFn: function(){
		riff.event.tap(this.cId,function(){
			riff.widget.global.objs.flow.run();
		})
	},
	customClassName : "rf-custom-idleRefresh"
});

idleMore = new riff.component.btn({		
	cId : "idleMore",
	content : "More",
	alwaysRun : true,
	eFn: function(){
		riff.event.tap(this.cId,function(){
			flowFullNews.run();
		})
	},
	customClassName : "rf-custom-idleMore"
});
	
idleSubinfo = new riff.component.subinfo({		
	cId : "idleSubinfo",
	content : riff.widget.convertDate(),
	alwaysRun : true,
	sFn : function(){
		this.content = riff.widget.convertDate();
	},
	addClassName : "rf-custom-idleSubinfo",
});

idleNews = new riff.component.list({		
	cId : "idleNews",
	content : null,
	bodyId : "idleNews-body",
	createSet : {
		clear : "all"
	},
	refresh : true,
	sFn : function(_arg){
		//this.create();
		initAutoScroll(true);
		if(riff.widget.global.ajaxUI.busyEnd){
			riff.widget.global.ajaxUI.busyEnd();
		};
		
	},
	addObj : function(_arg){
		this.callIdleList();
	},
	eFn : function(){
		if(riff.widget.global.yahoo.globalUrl != ""){
			riff.event.tap(idleLogo.cId, function(){
				riff.widget.openURL( riff.widget.global.yahoo.globalUrl );
			});			
		}
	},
	customClassName : "rf-component-idleList",
});


idleIndicator = new riff.component.idleIndicator({		
	cId : "idleIndicator",
	bodyId : "idleIndicator-body",
	content : null,
	createSet : {
		type : "str",
	},
	disableObj : [idleRefresh,idleMore,idleNews],
	stopObj : [idleSubinfo]
});

naviMenu = new riff.component.menu({
	cId : "navi-menu",
	bodyId : "navi-menu-body",
	failedFnFlag : true,
	fixed : true,
	content : [
		{ 
		  text : "World",
		  value : "world",
		  select: true
		},
		{ 
		  text : "Sports",
		  value : "sports",
		  select: false
		},
		{ 
		  text : "Health",
		  value : "health",
		  select: false
		},
		{ 
		  text : "Science",
		  value : "science",
		  select: false
		},
	],
	type : "navigation",
	createSet : {
		clear : "all",
	},
	addObj : function(_arg){
		this.callController();
	},
})

newsList = new riff.component.list({
	cId : "news-list",
	bodyId : "news-list-body",
	failedFnFlag : true,
	refresh : true,
	sFn : function(_arg){
		riff.widget.global.ajaxUI.busyEnd();
	}
});

newsInfo = new riff.component.subinfo({
	cId : "news-info",
	bodyId : "news-info-body",
	content: riff.widget.convertDate(),
	failedFnFlag : true,
	fixed : true,
	prefix : "Updated",
	alwaysRun : true,
	sFn : function(){
		this.content = riff.widget.convertDate();
	}
	
})

newsSoftkey = new riff.component.softkey({
	cId : "news-softkey",
	bodyId : "news-softkey-body",
	fixed : true,
	alwaysRun : true,
	content : [
		{
			id : "news-softkey-refresh",
			text : "Refresh",
			event : function(){
				riff.widget.global.objs.flow.run("referesh");
			}
		},
		{
			id : "news-softkey-setting",
			text : "Settings",
			event : function(){
				flowFullSetting.run();
			}
		}
	],
});

settingList = new riff.component.list({
	cId : "setting-list",
	bodyId : "setting-list-body",
	alwaysRun : true,
	content : [
			{
				tit : "Auto Scroll",
				event : function(){
					flowFullScroll.run();
				}
			},
			{
				tit : "Auto Refresh",
				event : function(){
					flowFullRefresh.run();
				}
			},
			{
				tit : "Version",
				text : "0.01"
			}
	],
	sFn : function(_arg){
		setSettingListContentText(this);
		if(_arg[0] == "ajaxSuccess"){
			if(riff.widget.global.ajaxUI.busyEnd){
				riff.widget.global.ajaxUI.busyEnd();
			};
		}
		
	},
	addObj : function(){
		this.callStyle("setting");
	}
	
});

settingSoftkey = new riff.component.softkey({
	cId : "setting-softkey",
	bodyId : "setting-softkey-body",
	fixed : true,
	alwaysRun : true,
	content : [],

})

settingSoftkey2 = new riff.component.softkey({
	cId : "setting-softkey2",
	bodyId : "setting-softkey2-body",
	fixed : true,
	failedFnFlag : true, 
	alwaysRun : true,
	content : [
		{
			id : "setting-softkey2-done",
			str : "Done",
			
		}
	]
});

/* flowFullRefresh setting start */
refreshList = new riff.component.list({
	cId : "refresh-list",
	bodyId : "refresh-list-body",
	alwaysRun : true,
	content : [
		{
			text : "None",
			value : 0,
			checked : true
		},
		{
			text : "Every 5 minutes",
			value : 5,
			checked : false
		},
		{
			text : "Every 10 minutes",
			value : 10,
			checked : false
		},
		{
			text : "Every 15 minutes",
			value : 15,
			checked : false
		}
	],
	addObj : function(){
		this.callRadio();
	}
});


scrollList = new riff.component.list({
	cId : "scroll-list",
	bodyId : "scroll-list-body",
	alwaysRun : true,
	content : [
		{
			text : "On",
			value : true,
			checked : true
		},
		{
			text : "Off",
			value : false,
			checked : false
		}
	],
	addObj : function(){
		this.callRadio();
	}
});
});
