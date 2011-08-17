riff.component.idleIndicator = function(_userSet){
	this.className = riff.ui.global.component.className.idleIndicator
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
		tThis.content = _msg;
		tThis.create();		
		
		setTimeout(function(){
			tThis.run("nodata")			
		},3000)
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
		tThis.content = _msg;
		tThis.create();
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
			
			for (_k in tThis.stopObj){
				
				if(tThis.stopObj[_k].stop){ 
				tThis.stopObj[_k].stop();
			}
				
			}
			
		};
		
		tThis.content = _msg;
		tThis.create();
	}
	
	
	if(_s == "failed"){
		tFn(riff.ui.global.component.failed)
	};
	if(_s == "network"){
		tFn(riff.ui.global.component.unavailable)
	};	
	if(_s == "nodata"){
		tFn3(riff.ui.global.component.blankMsg,"enable")		
	};
	if(_s == "loading"){
		tFn3("<span class='rf-component-idleBusy-img'>"+riff.ui.global.component.loadingStr+"</span>","disable")
		riff.manipulation.removeClass(this.bodyId,"rf-status-2line")
		riff.manipulation.removeClass(this.bodyId,"rf-status-3line")
		riff.manipulation.addClass(this.bodyId,"rf-status-idleLoading")
	};
	if(_s == "noSelectCategory"){
		tFn2(riff.ui.global.component.noDefaultCategory);
		riff.manipulation.removeClass(this.bodyId,"rf-status-3line")
		riff.manipulation.addClass(this.bodyId,"rf-status-2line")
	};
	
	if(_s == "notRegion"){		
		tFn2(riff.ui.global.component.notRegion);
		riff.manipulation.removeClass(this.bodyId,"rf-status-2line")
		riff.manipulation.addClass(this.bodyId,"rf-status-3line")
	};
	
	this.visible();
		if( riff.global.language.currentLanguage && riff.global.language.translateTable["en"] ) {
			riff.language.translateAllComponent( this );
		}
}

riff.component.idleIndicator.prototype.invisible = function(){
		riff.util.pop(riff.ui.global.objs.comps,this)
		riff.manipulation.removeClass(this.cId,"rf-status-visible")		
		riff.manipulation.removeClass(this.cId,"rf-status-act")					
	}
	

riff.component.idleIndicator.prototype.visible = function(){
		riff.ui.global.objs.comps.push(this);
		riff.manipulation.addClass(this.cId,"rf-status-visible");
		riff.manipulation.addClass(this.cId,"rf-status-act");
}

riff.component.idleIndicator.prototype.stopFn = function(_s,_flow){

						
}

