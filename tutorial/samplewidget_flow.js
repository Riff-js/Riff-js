$.load(function(){
//////            Flow              //////////////////////////////////////////////////////////

flowIdle3 = new riff.flow({
	desc : "Idle Normal",
	master : idleMaster,
	comps : [idleLogo,idleRefresh,idleMore,idleNews],
	sFn : function(){

	},
	eFn : function(){
		if(riff.widget.global.ajaxUI.busyStart){
			riff.widget.global.ajaxUI.busyStart();
		};
		flowIdle3Function( idleNews );
	}
});

flowInit = new riff.flow({
	desc : "initialize",
	master : null,
	comps : [],
	eFn : function(){
		initNews();
		flowIdle3.run("success");
	}
});

/* flowFullNews Setting Start */


flowFullNews = new riff.flow({
	desc : "News Flow",
	comps : [header, naviMenu, scene, newsList, newsInfo, newsSoftkey],
	master : fullMaster,
	sFn : function(){
		if(riff.widget.global.ajaxUI.busyStart){
			riff.widget.global.ajaxUI.busyStart();
		};
		header.selectContent("sample");
		flowFullNewsFunction();
	}, 
	eFn : function() {
	}
});

flowFullSetting = new riff.flow({
	desc : "Setting Level 1",
	comps : [header, scene, settingList, settingSoftkey],
	master : fullMaster,
	sFn : function(){
		header.selectContent("setting");
	},
	eFn : function() {
	}
});

flowFullRefresh = new riff.flow({
	desc : "Setting Level 2 AutoRefresh",
	comps : [header, scene, refreshList, settingSoftkey2 ],
	master : fullMaster,
	sFn : function(){
		header.selectContent("autoRefresh");
		flowFullRefreshStartFunction();
	},
	eFn : function(){
		flowFullRefreshEndFunction()
	}
});

flowFullScroll = new riff.flow({
	desc : "Setting Level 2 AutoScroll",
	comps : [header, scene, scrollList, settingSoftkey2 ],
	master : fullMaster,
	sFn : function(){
		header.selectContent("autoScroll");
		flowFullScrollStartFunction();
	},
	eFn : function(){
		flowFullScrollEndFunction()
	}
});


flowInit.run();

});