riff.flow = function( _userSet ){
	this.name = _userSet.name;
	this.desc = _userSet.desc;
	this.sFn = _userSet.sFn;
	this.eFn = _userSet.eFn;
	this.master = _userSet.master;
	this.comps = _userSet.comps;
	this.back = _userSet.back;
};

riff.flow.prototype = {	
	masterRun : function(){
		this.master.run();
	},	
	compInvisible : function(){
		_this = this; //_this = Flow Object
		var tFn = function(_el){
			_el.invisible(_this);	
		}
		riff.data.buffer(riff.traversal.filtering(".rf-component",".rf-status-act","not"),"data").forEach(tFn);
		tFn = null;
	},
	compRun : function(){
		this.comps.forEach( function(_el){ _el.run() } )
	},	
	compVisible : function(){
		_this = this; //_this = Flow Object
		var tFn = function(_el){
			if(_el.visible) _el.visible(_this);	
		}
		riff.data.buffer(".rf-status-act","data").forEach(tFn);
		tFn = null;
	},
	addStatusClass : function(){
		//Master
		if(this.master) riff.manipulation.addClass(this.master.cId,"rf-status-act");
		
		//Component
		var tFn = function(_el){
			riff.manipulation.addClass(_el.cId,"rf-status-act");	
		};
		
		this.comps.forEach(tFn);
		tFn = null;
	},	
	removeStatusClass : function(){
		riff.manipulation.removeClass(".rf-status-act","rf-status-act")
	},	
	//_s : string for back stack. 
	run : function(_s){
		
		//Create back
		//h 현재페이지에서 Run되거나 back으로 돌아온 경우 backstack 에 기록하지 않는다.
		if(riff.widget.global.objs.flow != this && !_s){
			this.back = riff.widget.global.objs.flow;
		}			
		
		
		
		//Push the global array 
		riff.widget.global.objs.flow = this;
					
		
		//Add status classes to DOM element.			
		this.addStatusClass();
		
		//Run Master
		if(this.master) this.masterRun();
		
		
		//Execute the start fn.
		if(this.sFn && typeof this.sFn == "function"){
			this.sFn.call(this);
		};			
		
		
		//Invisible 
		this.compInvisible();			
		
		//Run Component
		this.compRun();
		
		//Visible 
		this.compVisible();						
		
		//Execute the end fn.
		if(this.eFn && typeof this.eFn == "function"){
			this.eFn.call(this);
		};					
		
		//Remove status classes to DOM element. 
		this.removeStatusClass();
				
		
	}
	
		
}



