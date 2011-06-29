riff.component.idleIndicator = function(_userSet){
	this.className = riff.widget.global.component.className.idleIndicator
	this.disableObj = _userSet.disableObj
	this.stopObj = _userSet.stopObj	
	this.nextFlow = _userSet.nextFlow;
	riff.component.call(this,_userSet);
	
};

riff.component.idleIndicator.prototype = new riff.component();

riff.component.idleIndicator.prototype.run = function(_s,_flow){
	tThis = this;
	function tFn(_msg){
		if (tThis.disableObj){
		for (_k in tThis.disableObj){
			if(tThis.disableObj[_k].disable){
					
					tThis.disableObj[_k].disable();
					
				} else {
					tThis.disableObj[_k].invisible();
				}
		}
		};
		if (tThis.stopObj){
			for (_k in tThis.stopObj){
				tThis.stopObj[_k].stop();
			}
		};
		tThis.content = _msg;
		tThis.clearBody();
		tThis.createContent(tThis.content);		
		
		setTimeout(function(){
			tThis.run("nodata")			
		},1000)
	};
	function tFn2(_msg){		
		if (tThis.disableObj){
			for (_k in tThis.disableObj){				
				if(tThis.disableObj[_k].disable){
					
					tThis.disableObj[_k].disable();
					
				} else {
					tThis.disableObj[_k].invisible();
				}
			}
		};
		if (tThis.stopObj){
			for (_k in tThis.stopObj){
				tThis.stopObj[_k].stop();
			}
		};
		tThis.content = _msg;
		tThis.clearBody();
		tThis.createContent(tThis.content);
		riff.event.tap(tThis.cId,function(){			
			_flow.run();
		})
	};
	
	function tFn3(_msg,_opt){
		
		if (tThis.disableObj){
			for (_k in tThis.disableObj){
				if(_opt == "disable") {
					if(tThis.disableObj[_k].disable){
						
						tThis.disableObj[_k].disable();
						
					} else {
						tThis.disableObj[_k].invisible();
					}
				}
				if(_opt == "enable") {
					if(tThis.disableObj[_k].enable){ 
						tThis.disableObj[_k].enable();
					}else{
						tThis.disableObj[_k].visible();
					}
				}
				
			}
		};
		if (tThis.stopObj){
			for (_k in tThis.stopObj){
				tThis.stopObj[_k].stop();
			}
		};
		tThis.content = _msg;
		tThis.clearBody();
		tThis.createContent(tThis.content);
	}
	
	
	if(_s == "failed"){
		tFn(riff.widget.global.component.failed)
	};
	if(_s == "network"){
		tFn(riff.widget.global.component.unavailable)
	};	
	if(_s == "nodata"){
		tFn3(riff.widget.global.component.blankMsg,"enable")		
	};
	if(_s == "loading"){
		tFn3("<img src='../../plugin_themeBasic/src/img/ynews_wqvga_idle_loading.gif' /> "+riff.widget.global.component.loadingStr,"disable")
		riff.manipulation.addClass(this.bodyId,"rf-status-idleLoading")
	};
	if(_s == "noSelectCategory"){
		tFn2(riff.widget.global.component.noDefaultCategory);
		riff.manipulation.addClass(this.bodyId,"rf-status-2line")
	};
	
	if(_s == "notRegion"){		
		tFn2(riff.widget.global.component.notRegion);
		riff.manipulation.addClass(this.bodyId,"rf-status-3line")
	};
	
	this.visible();

}

riff.component.idleIndicator.prototype.invisible = function(){
		riff.util.pop(riff.widget.global.objs.comps,this)
		riff.manipulation.removeClass(this.cId,"rf-status-visible")		
		riff.manipulation.removeClass(this.cId,"rf-status-act")		
	}

riff.component.idleIndicator.prototype.visible = function(){
		riff.widget.global.objs.comps.push(this);
		riff.manipulation.addClass(this.cId,"rf-status-visible");
		riff.manipulation.addClass(this.cId,"rf-status-act");
}
