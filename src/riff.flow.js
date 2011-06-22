riff.flow = function( _data ){
	this.name = _data.name;
	this.type = _data.type || riff.widget.global.flowType;
	this.sFn = _data.sFn;
	this.eFn = _data.eFn;
	this.actComponent = _data.actComponent;
};

riff.flow.prototype = {
	pushComps : function(_obj){
		if(_obj){
			if (riff.util.isArray(_obj)) {
				var tObjIds = new Array();
				for (var i=0, iLen = riff.widget.global.objs.comps.length;i<iLen;i++)
					tObjIds.push(riff.widget.global.objs.comps[i].cId);
					
				for(var i=0,iLen = _obj.length; i<iLen;i++){
					if(tObjIds.indexOf(_obj[i].cId) == -1){
						riff.widget.global.objs.comps.push(_obj[i]);
					}
				}
				tObjIds = null;
			} else {
				var tExist = false;
				for(var i=0,iLen = riff.widget.global.objs.comps.length; i<iLen;i++){
					if(riff.widget.global.objs.comps[i].cId == _obj.cId){
						tExist = true;
						break;
					}
				}
				if (!tExist) {
					riff.widget.global.objs.comps.push(_obj);
					if(_obj.scene && (_obj.scene.cId == riff.widget.global.objs.master.scene.cId)){
						riff.widget.global.objs.sceneComps.push(_obj)
					}
				}
			}
		} else {
			
			var tFnPush = function(_el, _idx, _arr){
				var tExist = false;
				for(var i=0,iLen = riff.widget.global.objs.comps.length; i<iLen;i++){
					if(riff.widget.global.objs.comps[i].cId == _el.cId){
						tExist = true;
						break;
					}
				}
				if(!tExist){
					riff.widget.global.objs.comps.push(_el);
					if(_el.scene && (_el.scene.cId == riff.widget.global.objs.master.scene.cId)){
						riff.widget.global.objs.sceneComps.push(_el)
					}
				} 
			}
			this.actComponent.forEach(tFnPush);
			
			tFnPush = null;
		}
	},	
	popComps : function(_obj, _type){
		var tArr = new Array();
		var tArr2 = new Array();
		if(_obj){
			if(_type && _type == "other"){
				if(riff.util.isArray(_obj)){
					var tObjIds = new Array();
					for (var i=0, iLen = _obj.length;i<iLen;i++)
						tObjIds.push(_obj[i].cId);
					
					for(var i=0,iLen = riff.widget.global.objs.comps.length;i<iLen;i++){
						if(tObjIds.indexOf(riff.widget.global.objs.comps[i].cId) != -1) tArr.push(riff.widget.global.objs.comps[i]);
					}
					tObjIds = null;
				} else {
					for(var i=0,iLen = riff.widget.global.objs.comps.length;i<iLen;i++){
						if(riff.widget.global.objs.comps[i].cId == _obj.cId){
							tArr2.push(riff.widget.global.objs.comps[i]);
						}
					}
					for(var i=0,iLen = riff.widget.global.objs.comps.length;i<iLen;i++){
						if(riff.widget.global.objs.comps[i].cId == _obj.cId){
							tArr.push(riff.widget.global.objs.comps[i]);
						}
					}
				}
			} else {
				if(riff.util.isArray(_obj)){
					var tObjIds = new Array();
					for (var i=0, iLen = _obj.length;i<iLen;i++)
						tObjIds.push(_obj[i].cId);
					
					for(var i=0,iLen = riff.widget.global.objs.comps.length;i<iLen;i++){
						if(tObjIds.indexOf(riff.widget.global.objs.comps[i].cId) == -1) tArr.push(riff.widget.global.objs.comps[i]);
					}
					tObjIds = null;
				} else {
					for(var i=0,iLen = riff.widget.global.objs.sceneComps.length;i<iLen;i++){
						if(riff.widget.global.objs.sceneComps[i] != _obj.cId){
							tArr2.push(riff.widget.global.objs.sceneComps[i]);
						}
					}
					
					
					for(var i=0,iLen = riff.widget.global.objs.comps.length;i<iLen;i++){
						if(riff.widget.global.objs.comps[i].cId != _obj.cId){
							tArr.push(riff.widget.global.objs.comps[i]);
						}
					}
				}
			}

		} else {
			var tObjIds = new Array();
			for (var i=0, iLen = this.actComponent.length;i<iLen;i++)
				tObjIds.push(this.actComponent[i].cId);
			
				
			for(var i=0,iLen = riff.widget.global.objs.comps.length;i<iLen;i++){
				if(tObjIds.indexOf(riff.widget.global.objs.comps[i].cId) == -1) tArr.push(riff.widget.global.objs.comps[i]);
			}
			tObjIds = null;
		}
		riff.widget.global.objs.sceneComps = tArr2;
		riff.widget.global.objs.comps = tArr;
		tArr = null;
	},
	//_obj: a component data
	visible : function(_obj){
		if(_obj){
			if (riff.util.isArray(_obj)) {
				for(var i=0, iLen=_obj.length;i<iLen;i++){
					riff.manipulation.css(_obj[i].cId, "display", "block");
				}
			} else {
				riff.manipulation.css(_obj.cId, "display", "block");
			}
		} else {
			var tThis = this;
			var tFnShow = function(_el, _idx, _arr){
				riff.manipulation.css(_el.cId, "display","block");
			};
		
			this.actComponent.forEach(tFnShow);
			tFnShow = null;
			tThis = null;
		}
		this.pushComps(_obj);
	},	
	invisible : function(_obj, _type){
		var tLen = arguments.length;
		if(tLen == 0){
			this.invisibleAll();
		} else if(tLen == 1){
			this.invisibleSelect(_obj);
		} else if(tLen ==2){
			if(_type == "other" || _type == 1){
				this.invisibleOther(_obj);
			}
		}
		this.popComps(_obj, _type);
		
	},	
	invisibleAll : function(){
		var tFnHideAll = function(_el, _idx, _arr){
			riff.manipulation.css(_el.cId, "display","none");
		};
		
		this.actComponent.forEach(tFnHideAll);
		tFnHideAll = null;
	},	
	invisibleSelect : function(_obj){
		if(riff.util.isArray(_obj)){
			var tThis = this,
				tFnHideSelect = function(_el, _idx, _arr){
//					if (tThis.inFlow(_el)) {
//						riff.manipulation.css(_el.cId, "display", "none");
//					}
					riff.manipulation.css(_el.cId, "display", "none");
				};

			_obj.forEach(tFnHideSelect);
			
			tFnHideSelect = null;
			tThis = null;
		} else {
//			if (this.inFlow(_obj)) {
//				riff.manipulation.css(_obj.cId, "display", "none");
//			}
			riff.manipulation.css(_obj.cId, "display", "none");
		}
	},	
	invisibleOther : function(_obj){
		var tFnOther;
		if(riff.util.isArray(_obj)){
			var tIds = new Array();
			for(var i=0,iLen = _obj.length;i<iLen;i++){
				tIds.push(_obj[i].cId);
			}
			
			tFnOther = function(_el, _idx, _arr){
				if(!(_el.cId in tIds))
					riff.manipulation.css(_el.cId, "display", "none" );
			};
			
			this.actComponent.forEach(tFnOther);
			tIds = null;
		} else {
			var tFnOther = function(_el, _idx, _arr){
				if(_obj.cId != _el.cId)
					riff.manipulation.css(_el.cId, "display", "none");
			};
			this.actComponent.forEach(tFnOther);
		}
		tFnOther = null;
	},	
	//_obj: string, object(Component Object)
	inFlow : function(_obj){

		var rExist = false;

		for(var i=0, len = this.actComponent.length;i<len;i++){
			if(this.actComponent[i].cId == _obj.cId){
				rExist = true;
				break;
			}
		}		
		return rExist;
	},	
	compInit : function(_obj){
		if(_obj){
			if (_obj.effect) {
				_obj.effect.call(_obj)
			}
			
			if(_obj.event){
				if(typeof _obj.event == "function"){
					_obj.event.call(_obj);
				} else if(riff.util.isArray(_obj.event)){
					var tFnInit = function(_el, _idx, _arr){
						_el.call(_el);
					};
					
					_obj.event.forEach(tFnInit);
					tFnInit = null;
				}
			}
		} else {
			var tFnInit = function(_el, _idx, _arr){
				if(_el.effect) {
					_el.effect.call(_el);
				}
				if(_el.event){
					if(typeof _el.event == "function"){
						_el.event.call(_el);
					} else if(riff.util.isArray(_el.event)){
						var tFnNotObjEvent = function(_elNotObjEvent, _idxNotObjEvent, _arrNotObjEvent){
							_elNotObjEvent.call(_elNotObjEvent);
						};
						
						_el.event.forEach(tFnNotObjEvent);
						tFnNotObjEvent = null;
					}
				}
			};
			
			this.actComponent.forEach(tFnInit);
			tFnInit = null;
		}
	},	
	compSFn : function(_obj){		
		if(_obj){
			if (_obj.sFn) {
				if (typeof _obj.sFn == "function") {
					_obj.sFn.call(_obj)
				} else if(riff.util.isArray(_obj.sFn)) {
					var tFnEach = function(_el, _idx, _arr){
						_el.call(_el);
					};
					_obj.sFn.forEach(tFnEach);
					tFnEach = null;
				}
			}
		} else {
			var tFnEach = function(_el, _idx, _arr){
				if (_el.sFn) {
					if (typeof _el.sFn == "function") {
						_el.sFn.call(_el);
					} else {
						var tFnNotObjArr = function(_chdEl, _chdIdx, _chdArr){
							_chdEl.call(_chdEl);
						};
						_el.sFn.forEach(tFnNotObjArr);
						tFnNotObjArr = null;
					}
				}
			};
			
			this.actComponent.forEach(tFnEach);
			tFnEach = null;
		}
	},	
	compEFn : function(_obj){
		if(_obj){
			if(_obj.eFn){
				if(typeof _obj.eFn == "function"){
					_obj.eFn.call(_obj);
				} else if(riff.util.isArray(_obj.eFn)){
					var tFnEnd = function(_el, _idx, _arr){
						_el.call(_el);
					};
					_obj.eFn.forEach(tFnEnd);
					tFnEnd = null;
				}
			}
		} else {
			var tFnEnd = function(_el, _idx, _arr){
				if(_el.eFn){
					if(typeof _el.eFn == "function"){
						_el.eFn.call(_el);
					} else {
						var tFnEndArr = function(_chdEl, _chdIdx, _chdArr){
							_chdEl.call(_chdEl);
						};
						_el.eFn.forEach(tFnEndArr);
						tFnEndArr = null;
					}
				}
			};
			
			this.actComponent.forEach(tFnEnd);
			tFnEnd = null;
		}
	},
	run : function(_obj){
		var tThis = this;
		if(_obj){
			this.compSFn(_obj);
			this.compInit(_obj);			
			this.visible(_obj);
		} else {
			var tLen = riff.widget.global.objs.comps.length,
				tComp;
	/*			
			var tFn2 = function(_el){
				var tScene = riff.widget.global.displayMaster.scene.cId	;
				this.invisivble(riff.selector(tScene+" "+_el.cId)
			}
			
			//riff.widget.global.objs.comps.forEach(tFn2)
	*/
	
			
			
			while((tComp = riff.widget.global.objs.sceneComps.pop()) != undefined){
				this.popComps(tComp);
				riff.manipulation.css(tComp.cId, "display", "none");
			}
			
			tLen = null;
			tComp = null;
			
			if(this.sFn && typeof this.sFn == "function"){
				this.sFn.call(this);
			}
			
			if(this.type == "row"){
				var tFnRow = function(_el, _idx, _arr){
					tThis.compSFn(_el);
					tThis.compInit(_el);
					tThis.visible(_el);
				};
				
				this.actComponent.forEach(tFnRow);
				tFnRow = null;
			} else {
				this.compSFn();
				this.compInit();
				this.visible();
			}
			
			if(this.eFn && typeof this.eFn == "function"){
				this.eFn.call(this);
			}			
		}
		tThis = null;
		
		
		
	},	
	stop : function(_obj, _all){
		if(_obj){
			this.compEFn(_obj);
			this.invisible(_obj);
		} else {
			this.compEFn();
			this.invisible();
		}
	}
}
