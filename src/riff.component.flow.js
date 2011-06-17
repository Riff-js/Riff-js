riff.flow = function( _data ){
	this.name = _data.name;
	this.type = _data.type || riff.widget.global.flowType;
	this.sFn = _data.sFn;
	this.eFn = _data.eFn;
	this.actComponent = _data.actComponent;
	
	//_obj: a component data
	this.visible = function(_obj){
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
	
	this.invisible = function(_obj, _type){
		var tLen = arguments.length;
		if(tLen == 0){
			this.invisibleAll(_obj);
		} else if(tLen == 1){
			this.invisibleSelect(_obj);
		} else if(tLen ==2){
			if(_type == "other" || _type == 1){
				this.invisibleOther(_obj);
			}
		}
	};
	
	this.invisibleAll = function(_obj){
		var tFnHideAll = function(_el, _idx, _arr){
			$.manipulation.css(_el.cId, "display","none");
		};
		
		this.actComponent.forEach(tFnHideAll);
		tFnHideAll = null;
	};
	
	this.invisibleIndex = function(_num){
		if(typeof _num != "undefined" && _num > -1) $.manipulation.css(this.actComponent[_num].cId, "display", "none");
	}
	
	this.invisibleSelect = function(_obj){
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
					tThis.invisibleIndex(_el);
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
	
	this.invisibleOther = function(_obj){
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

	
	this.compInit = function(_obj){
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
	
	this.compFn = function(_obj){
		if(_obj){
			if (_obj.fn) {
				if (typeof _obj.fn == "function") {
					_obj.fn.call(_obj)
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
			this.compFn(_obj);
			this.compInit(_obj);
			this.visible(_obj);
		} else {
			
			if(this.sFn && typeof this.sFn == "function"){
				this.sFn.call(this);
			}
			
			if(this.type == "row"){
				var tFnRow = function(_el, _idx, _arr){
					tThis.compFn(_el);
					tThis.compInit(_el);
					tThis.visible(_el);
				};
				
				this.actComponent.forEach(tFnRow);
				tFnRow = null;
			} else {
				this.compFn();
				this.compInit();
				this.visible();
			}
			
			if(this.eFn && typeof this.eFn == "function"){
				this.eFn.call(this);
			}			
		}
		tThis = null;
	};
};
