riff.flow = function( _data ){
	this.name = _data.name;
	this.type = _data.type || riff.widget.global.flowType;
	this.sFn = _data.sFn;
	this.eFn = _data.eFn;
	this.actComponent = _data.actComponent;
	
	//_obj: a component data
	this.show = function(_obj){
		if(_obj){
			$.manipulation.css(_obj.cId, "display", "block");
		} else {
			var tFnShow = function(_el, _idx, _arr){
				$.manipulation.css(_el.cId, "display","block");
			};
		
			this.actComponent.forEach(tFnShow);
			tFnShow = null;
		}
	};
	
	this.hide = function(_obj, _type){
		var tLen = arguments.length;
		if(tLen == 0){
			this.hideAll(_obj);
		} else if(tLen == 1){
			this.hideSelect(_obj);
		} else if(tLen ==2){
			if(_type == "other" || _type == 1){
				this.hideOther(_obj);
			}
		}
	};
	
	this.hideAll = function(_obj){
		var tFnHideAll = function(_el, _idx, _arr){
			$.manipulation.css(_el.cId, "display","none");
		};
		
		this.actComponent.forEach(tFnHideAll);
		tFnHideAll = null;
	};
	
	this.hideIndex = function(_num){
		if(typeof _num != "undefined" && _num > -1) $.manipulation.css(this.actComponent[_num].cId, "display", "none");
	}
	
	this.hideSelect = function(_obj){
		if($.util.isArray(_obj)){
			var tArrayType = typeof _obj[0],
				tThis = this,
				tFnHideSelect;
			if(tArrayType == "string"){
				tFnHideSelect = function(_el, _idx, _arr){
					if(tThis.inFlow(_el)) $.manipulation.css( _el, "display", "none");
				};
			} else if (tArrayType == "number"){
				tFnHideSelect = function(_el, _idx, _arr){
					tThis.hideIndex(_el);
				};
			} else if(tArrayType == "object"){
				tFnSelect = function(_el, _idx, _arr){
					if(tThis.inFlow(_el)) $.manipulation.css(_el.cId, "display", "none");
				};
			}
			_obj.forEach(tFnHideSelect);
			
			tFnHideSelect = null;
			tThis = null;
		} else {
			var tObjType = typeof _obj;
			
			if(tObjType == "string"){
				if(this.inFlow(_obj)) $.manipulation.css(_obj,"display","none");
			} else if(tObjType == "number"){
				$.manipulation.css(this.actComponent[_obj].cId,"display","none");
			} else {
				if(this.inFlow(_obj)) $.manipulation.css(_obj.cId, "display", "none");
			}
		}
	};
	
	this.hideOther = function(_obj){
		if($.util.isArray(_obj)){
			var tArrayType = typeof _obj[0],
				tFnOther;
			
			if(tArrayType == "string" || tArrayType == "number"){
				tFnOther = function(_el, _idx, _arr){
					if(!(_el.cId in _obj))
						$.manipulation.css(_el.cId, "display", "none");
				};
			} else if(tArrayType == "object"){
				tFnOther = function(_el, _idx, _arr){
					if(_el in _obj)
						$.manipulation.css(_el.cId, "display", "none" );
				};
			}
			
			this.actComponent.forEach(tFnOther);
			
			tFnOther = null;
		} else {
			var tObjType = typeof _obj,
				tFnOther;
			
			if(tObjType == "string"){
				tFnOther = function(_el, _idx, _arr){
					if(_obj != _el.cId)
						$.manipulation.css(_el.cId, "display", "none");
				};
			} else if(tObjType == "number") {
				tFnOther = function(_el, _idx, _arr){
					if(_obj != _idx)
						$.manipulation.css(_el.cId, "display", "none");
				};
			} else if(tObjType == "object") {
				tFnOther = function(_el, _idx, _arr){
					if(obj.cId != _el.cId)
						$.manipulation.css(_el.cId, "display", "none");
				};
			}
			this.actComponent.forEach(tFnOther);
			
			tFnOther = null;
			
		}
	};
	
	//_obj: string, object(Component Object)
	this.inFlow = function(_obj){
		var tObjType = typeof _obj,
			rExist = false;
		if(tObjType == "string"){
			for(var i=0, len = this.actComponent.length;i<len;i++){
				if(this.actComponent[i].cId == _obj){
					rExist = true;
					break;
				}
			}
		} else {
			for(var i=0, len = this.actComponent.length;i<len;i++){
				if(this.actComponent[i].cId == _obj.cId){
					rExist = true;
					break;
				}
			}
		}
		
		return rExist;
	};

	
	this.componentInit = function(_obj){
		if(_obj){
			if(!_obj.markupFlag && _obj.makeMarkup) _obj.makeMarkup();
			if (!_obj.effectFlag && _obj.effect) {
				_obj.effect.call(_obj)
				
				_obj.effectFlag = true;
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
				if(!_el.markupFlag && _el.makeMarkup) _el.makeMarkup();
				
				if (!_el.effectFlag && _el.effect) {
					_el.effect.call(_el);
					
					_el.effectFlag = true;
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
	};
	
	this.componentEachFn = function(_obj){
		if(_obj){
			if (_obj.fn) {
				if (typeof _obj.fn == "function") {
					_obj.fn.call(_obj.fn)
				} else if(riff.util.isArray(_obj.fn)) {
					var tFnEach = function(_el, _idx, _arr){
						_el.call(_el);
					};
					_obj.fn.forEach(tFnEach);
					tFnEach = null;
				}
			}
		} else {
			var tFnEach = function(_el, _idx, _arr){
				if (_el.fn) {
					if (typeof _el.fn == "function") {
						_el.fn.call(_el);
					} else {
						var tFnNotObjArr = function(_chdEl, _chdIdx, _chdArr){
							_chdEl.call(_chdEl);
						};
						_el.fn.forEach(tFnNotObjArr);
						tFnNotObjArr = null;
					}
				}
			};
			
			this.actComponent.forEach(tFnEach);
			tFnEach = null;
		}
	};
	
	this.run = function(_obj){
		var tThis = this;
		
		if(_obj){
			this.componentEachFn(_obj);
			this.componentInit(_obj);
			this.show(_obj);
		} else {
			
			if(this.sFn && typeof this.sFn == "function"){
				this.sFn.call(this);
			}
			
			if(this.type == "row"){
				var tFnRow = function(_el, _idx, _arr){
					tThis.componentEachFn(_el);
					tThis.componentInit(_el);
					tThis.show(_el);
				};
				
				this.actComponent.forEach(tFnRow);
				tFnRow = null;
			} else {
				this.componentEachFn();
				this.componentInit();
				this.show();
			}
			
			if(this.eFn && typeof this.eFn == "function"){
				this.eFn.call(this);
			}			
		}
		tThis = null;
	};
};
