//Component property 
riff.component = function(_userSet ){
	if (arguments.length > 0 ){	
		this.cId = "#" + _userSet.cId;						
		(_userSet.bodyId == undefined) ? this.bodyId = this.cId : this.bodyId = "#" + _userSet.bodyId;
		this.refresh = _userSet.refresh;			
		this.sFn = _userSet.sFn; 	
		this.eFn = _userSet.eFn;	
		this.multiContent = _userSet.multiContent;
		this.selectContentKey = _userSet.selectContentKey;
		this.content = (_userSet.content)? _userSet.content : [];
		this.createSet = _userSet.createSet;
		this.addObj = _userSet.addObj
		this.parent = _userSet.parent;
		this.children = [];
		this.event = _userSet.event;
		this.fixed = _userSet.fixed;
		this.addClassName = _userSet.addClassName;
		this.customClassName = _userSet.customClassName;
		this.alwaysRun = _userSet.alwaysRun || false;
		this.type = _userSet.type;
		this.failedFnFlag = _userSet.failedFnFlag;
		this.cData = _userSet.cData;
		this.scrollInit = _userSet.scrollInit || true;
		this.init.apply( this, arguments );
	}
};

//Component method
riff.component.prototype = {
	create : function(_content){
		var tCon = (_content)? _content : this.content;		
		var tSet = this.createSet || null;
		var tConType = typeof tCon;
		if (tSet){
			var tEleClassName = riff.widget.global.component.className.item
			if (tSet.addClassName) var tEleClassName = riff.widget.global.component.className.item + " "+ tSet.addClassName;
			if (tSet.customClassName) var tEleClassName = tSet.customClassName;
			var tType = tSet.type || "node", tClear = tSet.clear || "body", tTag = tSet.tag || "li";
		} else {
			var tEleClassName = riff.widget.global.component.className.item
			var tType = "node", tClear = "body", tTag = "li";
		}
		
		//Clear th component content;
		if(tClear == "body") {
			this.clearBody();
		} else if( tClear == "all"){
			this.clear();
		}
		//Create element by string type
		if(tConType == "string"){
			this.createStr(tCon,tType);	
		//Create element by array type
		} else if (tConType == "object"){
			this.createRepeat(tType,tClear,tTag,tEleClassName,tCon,tSet);
		}
		//Event Binding (run)
		
	},
	createStr : function(tCon,tType){
		if(tType == "node"){
			var tText = riff.manipulation.createText(tCon);
			riff.manipulation.appendNode(this.bodyId, tText);
		} else {
			riff.manipulation.appendStr(this.bodyId, tCon);
		}
	},
	createRepeat : function(tType,tClear,tTag,tEleClassName,tCon,tSet){
		function tCreate(_obj,_className){
			var tEle = riff.manipulation.createElem("div",{"class":_className});
			if (tType == "node"){
				var tText = riff.manipulation.createText(_obj);										
				riff.manipulation.appendNode([tEle],tText);
			}
			if (tType == "str") riff.manipulation.appendStr([tEle],_obj);
			riff.manipulation.appendNode([tlistItem],tEle);
		};
		for(_j in tCon){
			var tItem = tCon[_j];
			if(tItem.id){
				var tAttr = { "class": tEleClassName,"id": tItem.id}
			} else {
				var tAttr = { "class": tEleClassName }
			}
			
			var tlistItem = riff.manipulation.createElem(tTag,tAttr);
			for(_k in tItem){
				if(_k != "id" && _k != "className" && _k != "event" && _k != "select" && _k != "value"){
					tCreate(tItem[_k],"rf-component-item-"+_k)
					riff.manipulation.appendNode(this.bodyId,tlistItem);
				}
			}
		}
	},
	clearBody : function(_s){
		riff.manipulation.remove( riff.traversal.contents( riff.selector(this.bodyId)),"clear" );
	},		
	clear : function(_s){
		var tCid = riff.traversal.contents( riff.selector(this.cId));
		var tEle = riff.traversal.filtering(tCid,this.bodyId,"not");
		riff.manipulation.remove(tEle ,"clear" );
		riff.manipulation.remove( riff.traversal.contents( riff.selector(this.bodyId)),"clear" );
	},
	item : function(_s){
		if (typeof _s == "number") { 
			return [riff.traversal.children(this.bodyId)[_s]];
		} else if (typeof _s == "string"){
			return riff.selector(this.bodyId+" "+_s);
		} else {
			
			return riff.traversal.children(this.bodyId)
		} 
	},	
	classInit : function(){
		//Component Identity Classname
		riff.manipulation.addClass(this.cId, riff.widget.global.component.className.base);
		
		//Custom Classname, Original Classname
		var tClass = (this.customClassName) ? this.customClassName : this.className
		riff.manipulation.addClass(this.cId, tClass);
		riff.manipulation.addClass(this.bodyId, tClass+"-body");
		//Add ClassName
		if(this.addClassName) riff.manipulation.addClass(this.cId, this.addClassName);	
		
	},		
	eventInit : function(){
		for ( _k in this.content){
			if(this.item()[_k] != undefined){
				
				if(this.content[_k].event){
					riff.event.tap([this.item()[_k]],this.content[_k].event)
				}			
				
			}
		}
		
		
	},
	visible : function()
	{	
		riff.widget.global.objs.comps.push(this);
		riff.manipulation.addClass(this.cId,"rf-status-visible");

	},	
	invisible : function()
	{	
		riff.util.pop(riff.widget.global.objs.comps,this)
		riff.manipulation.removeClass(this.cId,"rf-status-visible")		
	},
	scrollInitFn : function(){
		var tDom = riff.selector(this.cId);
		if( tDom && tDom[0].scrollTop ) tDom[0].scrollTop = 0;
		tDom = null;
	},
	run_dev: function(_arg){		
		if (this.sFn) this.sFn.call(this,arguments);
		if (this.addObj) this.addObj.call(this,arguments);
		if (this.themeFn) this.themeFn.call(this,arguments);
		if (this.event) this.event.call(this,arguments);
		if( riff.global.language.currentLanguage && riff.global.language.translateTable["en"] ) {
			riff.language.translateAllComponent( this );
		}
	},
	run : function(_arg){		
		if (this.scrollInit == true) this.scrollInitFn(); 
		if (this.sFn) this.sFn.call(this,arguments);
		if (this.compsSFn) this.compsSFn.call(this,arguments);
		if (this.create) this.create.call(this);
		if (this.compsAddObj) this.compsAddObj.call(this,arguments);
		if (this.addObj) this.addObj.call(this,arguments);
		if (this.compsEFn) this.compsSFn.call(this,arguments);
		if (this.themeFn) this.themeFn.call(this,arguments);
		if (this.eventInit) this.eventInit.call(this,arguments);
		if (this.eFn) this.eFn.call(this,arguments);
		if( riff.global.language.currentLanguage && riff.global.language.translateTable["en"] ) {
			riff.language.translateAllComponent( this );
		}
	},
	start : function(_arg){
		this.run.apply(this,arguments)
		this.visible();
	},
	stop : function(_arg){
		if (this.stopFn) this.stopFn.apply(this,arguments);
		this.invisible();
	},
	selectContent : function(_s){
		this.content = this.multiContent[_s];
		this.selectContentKey = _s;
	},
	init : function()
	{
		if(this.refresh) riff.widget.global.objs.refreshComps.push(this);
		if(this.initFirst) this.initFirst();
		this.classInit();
		riff.widget.global.objs.allComps.push( this );		
		riff.data.buffer( this.cId, "data", this );
		// Fixed Component?
		if (this.fixed == true){ 
			riff.widget.global.objs.fixedComps.push(this);
			riff.manipulation.addClass(this.cId,"rf-status-fixed");
		}
	},
};



riff.component.list = function(_userSet){
	this.className = riff.widget.global.component.className.list
	riff.component.call(this,_userSet);
};

riff.component.list.prototype = new riff.component();

riff.component.list.prototype.createRepeat = function(tType,tClear,tTag,tEleClassName,tCon,tSet){
	function tCreate(_obj,_className){
		var tEle = riff.manipulation.createElem("div",{"class":_className});
		if (tType == "node"){
			var tText = riff.manipulation.createText(_obj);										
			riff.manipulation.appendNode([tEle],tText);
		}
		if (tType == "str") riff.manipulation.appendStr([tEle],_obj);
		riff.manipulation.appendNode([tlistItem],tEle);
	};
	for(_j in tCon){
		var tItem = tCon[_j];
		var tAttr = { "class": tEleClassName }
		var tlistItem = riff.manipulation.createElem(tTag,tAttr);
		for(_k in tItem){
			if(_k == "tit"){
				//tCreate(_obj.tit,"rf-component-item-tit")
				//appendStr : for entity code 
				var tEle = riff.manipulation.createElem("div",{"class":"rf-component-item-tit"});
				riff.manipulation.appendStr([tEle],tItem.tit);
				riff.manipulation.appendNode([tlistItem],tEle);
			} else 
			if(_k == "img"){
				var tImgEle = riff.manipulation.createElem("div",{"class":"rf-component-item-img"});							
				if(tItem.img){
				if (tType == "node"){
					var tImg = riff.manipulation.createElem("img",{"src":tItem.img});
					riff.manipulation.appendNode([tImgEle],tImg);
				}
				if (tType == "str") riff.manipulation.appendStr([tImgEle],tItem.img);
				riff.manipulation.appendNode([tlistItem],tImgEle);
				}
			} else
			if(_k == "text"){
				tCreate(tItem.text,"rf-component-item-text")		
			} else
			if(_k == "updated"){
				tCreate(riff.widget.currentTimeParsing(tItem.updated),"rf-component-item-itemInfo")
			} else
			if(_k == "credit"){
				tCreate(tItem.credit,"rf-component-item-itemInfo")
			} else 
			if(_k == "link"){
				if(tItem[_k]){
					riff.data.buffer([tlistItem], "link", tItem[_k]);
					riff.event.tap([tlistItem], function(){
						riff.widget.openURL(riff.data.buffer([this], "link"));
					});
				}
			}
		}
		riff.manipulation.appendNode(this.bodyId,tlistItem);

					
	};
	tCreate = tlistItem = tTitEle = tTag = tTit = tEle = tTextEle = tText = tImgEle = tImg = tAttr = null;
};



riff.component.list.prototype.callOrdering = function(){
	this.tempContent = new riff.util.cloneObject(this.content);
	
	riff.manipulation.addClass(this.item(),riff.widget.global.component.className.orderingList);
	//Create the DOM Element.
	var tObj = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.ordering});	
	var tObjUp = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.orderingUp});
	var tObjDown = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.orderingDown});
	riff.manipulation.appendNode([tObj],tObjUp);
	riff.manipulation.appendNode([tObj],tObjDown);
	riff.manipulation.appendNode(this.item(),tObj);
	tObj = null;
	
	//Added property
	this.orderingUp = this.cId+" ."+riff.widget.global.component.className.orderingUp;
	
	//Added property
	this.orderingDown = this.cId+" ."+riff.widget.global.component.className.orderingDown;
	
	//Added property
	this.ordering = this.cId+" ."+riff.widget.global.component.className.ordering;
	
	
	//Event Binding
	//this = li
	//_obj = this.content			
	function orderingEvent(){		
		var tItem = this;
		var tBody = riff.selector(tComp.bodyId)[0];
		var tContent = tComp.tempContent;
		var tLength = tComp.content.length;
		var tOrderUp = riff.traversal.find([tItem]," ."+riff.widget.global.component.className.orderingUp);
		var tOrderDown = riff.traversal.find([tItem]," ."+riff.widget.global.component.className.orderingDown);
						
		riff.event.tap(tOrderUp, function(){			
			//riff.manipulation.addClass([tItem],"rf-status-focus")
			var tIdx = riff.traversal.index([tItem]);			
			var tPrevIdx = riff.traversal.index([tItem.previousSibling]);			
			if (tPrevIdx != 0) {
				tBody.insertBefore(tItem,tItem.previousSibling);
			}			
			var tv = tContent[tIdx - 1];
			tContent[tIdx - 1] = tContent[tIdx];
			tContent[tIdx] = tv;
		});
		
		riff.event.touchStart(tOrderUp, function(){
			//riff.manipulation.addClass([tItem],"rf-status-focus");			
			riff.manipulation.addClass([this],"rf-status-focus");
		});		
		
		riff.event.touchEnd(tOrderUp, function(){
			//riff.manipulation.removeClass([tItem],"rf-status-focus");
			riff.manipulation.removeClass([this],"rf-status-focus");			
		});
		
		riff.event.tap(tOrderDown, function(){
			var tIdx = riff.traversal.index([tItem]);
			if (tItem.nextSibling != null) {
				tBody.insertBefore(tItem,tItem.nextSibling.nextSibling);
			};
			if(tIdx < (tLength-1)){
				var tv = tContent[tIdx + 1];
				tContent[tIdx + 1] = tContent[tIdx];
				tContent[tIdx] = tv;
				
			}
		});		
		riff.event.touchStart(tOrderDown, function(){
			//riff.manipulation.addClass([tItem],"rf-status-focus");
			var tIdx = riff.traversal.index([tItem]);
			var tItemLength = riff.selector(tComp.bodyId+" li").length
			//Don't added focus class to Last Items
			if (tIdx != tItemLength-1) riff.manipulation.addClass([this],"rf-status-focus");
						
		});		
		riff.event.touchEnd(tOrderDown, function(){
			//riff.manipulation.removeClass([tItem],"rf-status-focus");
			riff.manipulation.removeClass([this],"rf-status-focus");			
		})		
	};	
	
	//Event
	var tComp = this;
	var tItems2 = this.item();
	var tFirstItem = tItems2.shift();
	
	riff.manipulation.each(tItems2, function(){			
		orderingEvent.call(this, tComp)
	})
	
	if(tItems2.length){
		//Dim the first item
		var tFirstDownEle = riff.traversal.find([tFirstItem],"."+riff.widget.global.component.className.orderingDown);
		var tFirstUpEle = riff.traversal.find([tFirstItem],"."+riff.widget.global.component.className.orderingUp);
		riff.manipulation.addClass(tFirstDownEle,"rf-status-dim");
		riff.manipulation.addClass(tFirstUpEle,"rf-status-dim");
	}
	
	
}




riff.component.list.prototype.callCheckbox = function(){
	
	//this.tempContent = null;
	this.tempContent = new riff.util.cloneObject(this.content);
	var tComp = this;
	//Create the checkbox
	var tEle = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.checkbox});	
	riff.manipulation.appendNode(this.item(),tEle);
	if(this.item().length > 0)riff.manipulation.addClass(this.item(),riff.widget.global.component.className.checklist);
	
	this.checkbox = this.cId+" ."+riff.widget.global.component.className.checkbox;
	this.checklistItem = this.cId+" ."+riff.widget.global.component.className.checklist;
	for (_k in this.tempContent){		
		if(this.tempContent[_k].checked == true){
			riff.manipulation.addClass(riff.traversal.find([this.item()[_k]]," ."+riff.widget.global.component.className.checkbox),"rf-status-on")	
		}
	}
	
	
	riff.event.tap(this.item(),function(){		
		var tIdx = riff.traversal.index([this]);
		if(tComp.selectAllFlag == true) var tIdx = riff.traversal.index([this])-1;		
				
		if(tComp.tempContent[tIdx]){
			if(tComp.tempContent[tIdx].checked){
				tComp.tempContent[tIdx].checked = false;
				riff.manipulation.removeClass(riff.traversal.find([this],"."+riff.widget.global.component.className.checkbox),"rf-status-on");						
			} else {
				tComp.tempContent[tIdx].checked = true;			
				riff.manipulation.addClass(riff.traversal.find([this],"."+riff.widget.global.component.className.checkbox),"rf-status-on");
				
			}
		}
		
		if(tComp.selectAllFlag == true) tComp.selectAllCheck();
	})
	
}

riff.component.list.prototype.callSelectAll = function(){	
	this.tempContent = null;
	this.tempContent = new riff.util.cloneObject(this.content);
	var tComp = this;
	//Create the checkbox
	var tEle = riff.manipulation.createElem("li",{"class":riff.widget.global.component.className.selectAll});
	var tTxtEle = riff.manipulation.createElem("div",{"class":"rf-component-item-text"});
	var tTxt = riff.manipulation.createText(riff.widget.global.component.selectAllStr);

	riff.manipulation.appendNode([tTxtEle],tTxt);
	riff.manipulation.appendNode([tEle],tTxtEle)	
	
	var tEle2 = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.checkbox});	
	riff.manipulation.appendNode([tEle],tEle2);		
	riff.manipulation.prependNode(this.bodyId,tEle);

	
	riff.event.tap( this.bodyId+" ."+riff.widget.global.component.className.selectAll,function(){
		tComp.selectAll();
	})			
	this.selectAllFlag = true;
	this.selectAllCheck();
}

riff.component.list.prototype.selectAll = function(){		
	if(this.allChecked){
		this.allChecked = false;
		for(var _k in this.tempContent){
			this.tempContent[_k].checked = false;
		}
		riff.manipulation.removeClass(this.checkbox,"rf-status-on");
		
	} else {
		this.allChecked = true;
		for(var _k in this.tempContent){
			this.tempContent[_k].checked = true;
		}
		riff.manipulation.addClass(this.checkbox,"rf-status-on");
	}
}


riff.component.list.prototype.selectAllCheck = function(){
	var tCnt = 0,
		tLen = 0;//this.tempContent.length;
	
	for(var _k in this.tempContent){
		if(this.tempContent[_k].checked) tCnt++;
		tLen++;
	}
	
	if(tCnt == tLen){
		this.allChecked = true;
		riff.manipulation.addClass(riff.traversal.find(this.bodyId," ."+riff.widget.global.component.className.selectAll+" ."+riff.widget.global.component.className.checkbox),"rf-status-on");
	} else {
		this.allChecked = false;
		riff.manipulation.removeClass(riff.traversal.find(this.bodyId," ."+riff.widget.global.component.className.selectAll+" ."+riff.widget.global.component.className.checkbox),"rf-status-on");
	}
	
	tCnt = null;
	tLen = null;
	
};

riff.component.list.prototype.getValueArr = function(){
	var rArr = new Array();
	for( i in this.content){
		if(this.content[i].checked) rArr.push(this.content[i].value);
	}
	return rArr;
};

riff.component.list.prototype.getValueObj = function(){
	var rObj = {};
	for ( _k in this.content){		
		if(this.content[_k].checked){
			rObj[_k] = true;
		} else {
			rObj[_k] = false;;
		}
	};
	return rObj;
};

riff.component.list.prototype.getValue = function(){
	var rObj = {};
	for(var _k in this.content){
		if(this.content[_k].checked){
			rObj.text = this.content[_k].text;
			rObj.value = this.content[_k].value;
		}
	}
	return rObj;
};

riff.component.list.prototype.valueDone = function(){
	this.content = new riff.util.cloneObject(this.tempContent);
};

riff.component.list.prototype.callRadio = function(){	
	this.tempContent = new riff.util.cloneObject(this.content);
	var tComp = this;	
	var tEle = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.radio});	
	riff.manipulation.appendNode(this.item(),tEle);
	riff.manipulation.addClass(this.item(),riff.widget.global.component.className.radioList);
	
	this.radio = this.cId+" ."+riff.widget.global.component.className.radio;
	this.radioListItem = this.cId+" ."+riff.widget.global.component.className.radioList;
	
	for (_k in this.tempContent){
		if(this.tempContent[_k].checked == true){			
			if(this.item().length > 0) riff.manipulation.addClass(riff.traversal.find([this.item()[_k]]," ."+riff.widget.global.component.className.radio),"rf-status-on")	
		}
	}
	
	riff.event.tap(this.item(),function(){
		var tIdx = riff.traversal.index([this]);
		var tRadio = riff.traversal.find(tComp.bodyId, tComp.radio);
			
		for (_k in tComp.tempContent){
			tComp.tempContent[_k].checked = false;
		}		
		riff.manipulation.removeClass(riff.traversal.find(tComp.bodyId,"."+riff.widget.global.component.className.radio),"rf-status-on");			
		tComp.tempContent[tIdx].checked = true;
		riff.manipulation.addClass(riff.traversal.find([this],"."+riff.widget.global.component.className.radio),"rf-status-on");		
	})
};


riff.component.list.prototype.callIdleList = function(){
	if(riff.selector(this.cId+" li").length > 0) riff.manipulation.addClass([riff.selector(this.cId+" li")[0]],"rf-status-visible")
	
	var tComp = this;	
	var tP = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.idlePrev});
	var tN = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.idleNext});
	riff.manipulation.appendNode(riff.selector(this.cId),tP);
	riff.manipulation.appendNode(riff.selector(this.cId),tN);
	
	riff.event.tap(this.cId+" ."+riff.widget.global.component.className.idlePrev,function(){
		riff.manipulation.each(tComp.item(".rf-status-visible"),function(){
			if (this.previousSibling != null){
				riff.manipulation.addClass([this.previousSibling],"rf-status-visible")
				riff.manipulation.removeClass([this],"rf-status-visible")
			} else {			 
				riff.manipulation.addClass([tComp.item()[tComp.item().length-1]],"rf-status-visible")
				riff.manipulation.removeClass([this],"rf-status-visible")
			}
		})
	})
	
	riff.event.tap(this.cId+" ."+riff.widget.global.component.className.idleNext,function(){
		riff.manipulation.each(tComp.item(".rf-status-visible"),function(){
			if (this.nextSibling != null){
				riff.manipulation.addClass([this.nextSibling],"rf-status-visible")
				riff.manipulation.removeClass([this],"rf-status-visible")
			}else {			 
				riff.manipulation.addClass([tComp.item()[0]],"rf-status-visible")
				riff.manipulation.removeClass([this],"rf-status-visible")
			}
		})
	})
};

riff.component.list.prototype.callStyle = function(_s){
	if(_s == "setting") {
		riff.manipulation.addClass(this.bodyId,"rf-style-list-setting");
		var tEle = riff.manipulation.createElem("div",{"class":"rf-style-arrObj"});
		//Not applied to checklist,radiolist
		riff.manipulation.appendNode( this.bodyId+" li",tEle);
		
	}	
	if(_s == "failed") {
		riff.manipulation.removeClass(this.bodyId+" li","rf-component-oneItem");
		riff.manipulation.addClass(this.bodyId+" li","rf-component-oneItem");
	}
};

riff.component.list.prototype.failedFn = function(){
	if(this.failedFnFlag == true){				
		this.content = [{text : "No data to display"}]
		this.run();
		this.callStyle("failed");
	}
}




riff.component.menu = function(_userSet){	
	this.type = _userSet.type;
	if ( _userSet.type == "tab"){
		this.className = riff.widget.global.component.className.tab;
	} else if( _userSet.type == "navigation" ){
		this.className = riff.widget.global.component.className.navigation;
	};		
	riff.component.call(this,_userSet);
}

riff.component.menu.prototype = new riff.component();

riff.component.menu.prototype.createItem = function(_obj,_type){	
	if (!_type) _type = "node";		
	
	var tTag = "li";	
	var tAttr = { "class":"rf-component-item" };	
	var tlistItem = riff.manipulation.createElem(tTag,tAttr);
	
	if (typeof _obj == "string"){
		riff.manipulation.appendStr([tlistItem],_obj);
	} else if (typeof _obj == "object"){
		//Title
		
		function tCreate(_obj,_className){
			var tEle = riff.manipulation.createElem("div",{"class":_className});							
			
			if (_type == "node"){
				var tText = riff.manipulation.createText(_obj);										
				riff.manipulation.appendNode([tEle],tText);
			}
			if (_type == "str") riff.manipulation.appendStr([tEle],_obj);
			
			riff.manipulation.appendNode([tlistItem],tEle);
		};
		if(_obj.tit){
			tCreate(_obj.tit,"rf-component-item-tit")
		};
		//Text
		if(_obj.text){
			tCreate(_obj.text,"rf-component-item-text")		
		};
		//Image
		if(_obj.img){
			var tImgEle = riff.manipulation.createElem("div",{"class":"rf-component-item-img"});							
			if (_type == "node"){
				var tImg = riff.manipulation.createElem("img",{"src":_obj.img});
				riff.manipulation.appendNode([tImgEle],tImg);
			}
			if (_type == "str") riff.manipulation.appendStr([tImgEle],_obj.img);
			riff.manipulation.appendNode([tlistItem],tImgEle);
		}	
	}
	riff.manipulation.appendNode(this.bodyId,tlistItem);
	tCreate = tlistItem = tTitEle = tTag = tTit = tEle = tTextEle = tText = tImgEle = tImg = tAttr = null;	
	
};



riff.component.menu.prototype.getValue = function(){
	rArr = [];
	var tIdx = 0;
	for(var _k in this.content){
		if(this.content[_k].select){
			rArr.push(this.content[_k].value);
			rArr.push(tIdx);
		}
		tIdx++;
	}
	return rArr;	
}

riff.component.menu.prototype.callController = function(){
	
	if(this.item().length > 1){
		var tArrL = riff.widget.global.effObj.arrLeft();
		var tArrR = riff.widget.global.effObj.arrRight();
		riff.manipulation.appendNode(this.cId,tArrL);
		riff.manipulation.appendNode(this.cId,tArrR);
		this.arrL = riff.selector(this.cId+" div.rf-effect-arrL");
		this.arrR = riff.selector(this.cId+" div.rf-effect-arrR");	
	}
	
	var tCidx = this.getValue()[1];	
	
	if(this.item().length !=0) riff.manipulation.addClass([this.item()[tCidx]],"rf-status-visible");
	var tComp = this;
	function tEvFn(_s){
		var tCurrent = riff.selector(tComp.bodyId+" li.rf-status-visible");		
		var tIdx = riff.traversal.index(tCurrent);
		var tPrev = tIdx-1; 
		var tNext = tIdx+1;
		var tLast = tComp.item().length-1;
		
		if(_s =="prev"){		
			if(tIdx == 0){
				tComp.menuGo(tLast);	
			} else {
				tComp.menuGo(tPrev);
			}
		}
		if(_s =="next"){		
			if(tIdx == tLast){
				tComp.menuGo(0);	
			} else {
				tComp.menuGo(tNext);
			}
		}
	}
	if(this.arrL){
		riff.event.tap(this.arrL,function(){
			tEvFn("prev")		
		})	
	}
	if(this.arrR){
		riff.event.tap(this.arrR,function(){
			tEvFn("next")
		})
	}
}

riff.component.menu.prototype.menuGo = function(_idx){
	
	//Li show		
	riff.manipulation.removeClass(this.item(),"rf-status-visible");
	riff.manipulation.addClass([this.item()[_idx]],"rf-status-visible");
	//Event
	
	for(_k in this.content){
		this.content[_k].select = false;
	}
	this.content[_idx].select = true;
	riff.widget.global.objs.flow.run();
	//riff.event.trigger([this.item()[_idx]],"tap")
}

riff.component.menu.prototype.failedFn = function(){
	if(this.failedFnFlag == true){		
		this.clear();
	}
}



riff.component.header = function(_userSet){
	this.className = riff.widget.global.component.className.header;		
	riff.component.call(this,_userSet);			
};

riff.component.header.prototype = new riff.component();

//Sofykey 
riff.component.softkey = function(_userSet){
	this.className = riff.widget.global.component.className.softkey;
	this.backkey = _userSet.backkey || "visible";
	riff.component.call(this,_userSet);
};

riff.component.softkey.prototype = new riff.component();

riff.component.softkey.prototype.createBackkey = function(){
	//Create the DOM Element.
	var tlistItem = riff.manipulation.createElem("li",{"class":riff.widget.global.component.className.softBackkey});
	var tBack = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.softBackkeyEle});
	riff.manipulation.appendNode([tlistItem],tBack);
	riff.manipulation.appendNode(this.bodyId,tlistItem);
	tlistItem = null;
	
	//Added property
	this.backKey = this.cId+" ."+riff.widget.global.component.className.softBackkey;
	
	//Event Binding
	riff.event.tap(this.backKey, function(){
		riff.widget.global.objs.flow.back.run("back");	
	})	
};


//n Argument
//n number = index
//n string = Select query
//n objet = DOM Element array

riff.component.softkey.prototype.disableEnable = function(_item,_s){
	var tItems = riff.selector(this.bodyId+" ."+riff.widget.global.component.className.item);
	
	if(typeof _item == "number" ){
		var tEle = [tItems[_item]];	
	}
	if(typeof _item == "string" ){
		var tEle = riff.selector(this.bodyId+" "+_item);
	}
	if(typeof _item == "object" ){
		var tEle = _item;
	}

	if(_s == "disable"){
		riff.manipulation.addClass(tEle,"rf-status-dim");
		riff.event.enableDisable(tEle,"tap","disable");
	}
	if(_s == "enable"){
		riff.manipulation.removeClass(tEle,"rf-status-dim");
		riff.event.enableDisable(tEle,"tap","enable");
	}
}

riff.component.softkey.prototype.disable = function(_item){
	this.disableEnable(_item,"disable")
}

riff.component.softkey.prototype.enable = function(_item){
	this.disableEnable(_item,"enable")
}

riff.component.softkey.prototype.compsAddObj = function(){
	if (this.backkey == "visible"){
		this.createBackkey();
	}
}
riff.component.softkey.prototype.failedFn = function(){
	if (this.failedFnFlag == true){
		this.disable(riff.traversal.filtering(this.item(),".rf-component-softBackkey","not"))
	}
}

riff.component.container = function(_userSet){
	this.className = riff.widget.global.component.className.container;	
	riff.component.call(this,_userSet);			

};

riff.component.container.prototype = new riff.component();
riff.component.modal = function(_userSet){
	this.className = riff.widget.global.component.className.modal	
	riff.component.call(this,_userSet);			
	this.okFn = _userSet.okFn
	this.cancelFn = _userSet.cancelFn
};

riff.component.modal.prototype = new riff.component();

riff.component.modal.prototype.visible = function(){
	if(riff.widget.global.objs.master) riff.widget.global.objs.master.dimVisible();	
	riff.widget.global.objs.comps.push(this);
	riff.manipulation.addClass(this.cId,"rf-status-visible");
	riff.manipulation.addClass(this.cId,"rf-status-act");
	if(this.children[0]){
		riff.manipulation.addClass(this.children[0].cId,"rf-status-visible");
		riff.manipulation.addClass(this.children[0].cId,"rf-status-act");
	}
};

riff.component.modal.prototype.invisible = function(){
	riff.util.pop(riff.widget.global.objs.comps,this)
	
	riff.manipulation.removeClass(this.cId,"rf-status-visible")
	
	
	riff.manipulation.removeClass(this.cId,"rf-status-act");
	
	if(this.children[0]){		
		riff.manipulation.removeClass(this.children[0].cId,"rf-status-visible");
		riff.manipulation.removeClass(this.children[0].cId,"rf-status-act");
	}
	if(riff.widget.global.objs.master) riff.widget.global.objs.master.dimInvisible();
};



riff.component.btn = function(_userSet){
	this.className = riff.widget.global.component.className.btn;
	riff.component.call(this,_userSet);
	this.parent = _userSet.parent;
};

riff.component.btn.prototype = new riff.component();

riff.component.btn.prototype.initFirst = function(){
	if(this.parent){
	 this.parent.children.push(this);
	// riff.manipulation.addClass(this.cId,"rf-status-act");
	}
		
	
};

riff.component.btn.prototype.disable = function(){
	riff.manipulation.addClass(this.cId,"rf-status-dim");	
 	riff.event.enableDisable(this.cId,"tap","disable");
};

riff.component.btn.prototype.enable = function(){
	riff.manipulation.removeClass(this.cId,"rf-status-dim");
	riff.event.enableDisable(this.cId,"tap","enable");
};


riff.component.btn.prototype.compsSFn = function(){
	riff.manipulation.removeClass(this.cId,"rf-status-focus");
}

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
		tFn(riff.widget.global.component.failed)
	};
	if(_s == "network"){
		tFn(riff.widget.global.component.unavailable)
	};	
	if(_s == "nodata"){
		tFn3(riff.widget.global.component.blankMsg,"enable")		
	};
	if(_s == "loading"){
		tFn3("<img src='./theme/img/ynews_wqvga_idle_loading.gif' />"+riff.widget.global.component.loadingStr,"disable")
		riff.manipulation.removeClass(this.bodyId,"rf-status-2line")
		riff.manipulation.removeClass(this.bodyId,"rf-status-3line")
		riff.manipulation.addClass(this.bodyId,"rf-status-idleLoading")
	};
	if(_s == "noSelectCategory"){
		tFn2(riff.widget.global.component.noDefaultCategory);
		riff.manipulation.removeClass(this.bodyId,"rf-status-3line")
		riff.manipulation.addClass(this.bodyId,"rf-status-2line")
	};
	
	if(_s == "notRegion"){		
		tFn2(riff.widget.global.component.notRegion);
		riff.manipulation.removeClass(this.bodyId,"rf-status-2line")
		riff.manipulation.addClass(this.bodyId,"rf-status-3line")
	};
	
	this.visible();
		if( riff.global.language.currentLanguage && riff.global.language.translateTable["en"] ) {
			riff.language.translateAllComponent( this );
		}
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

riff.component.idleIndicator.prototype.stopFn = function(_s,_flow){

						
}


riff.component.subinfo = function(_userSet){
	this.className = riff.widget.global.component.className.subinfo;		
	riff.component.call(this,_userSet);
	this.prefix = _userSet.prefix;
};

riff.component.subinfo.prototype = new riff.component();


riff.component.subinfo.prototype.createStr = function(tCon,tType){
	//var tContent = riff.widget.convertDate();
	if(this.prefix){
		var tPreEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-prefix" });
		var tPre = riff.manipulation.appendStr([tPreEl],this.prefix);
		riff.manipulation.appendNode(this.bodyId,tPreEl);
	}
	var tConEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-con" });
	if(tType == "node"){
		var tConText = riff.manipulation.createText(tCon);
		riff.manipulation.appendNode([tConEl],tConText);
	} else {
		riff.manipulation.appendStr([tConEl], tCon);
	}
	riff.manipulation.appendNode(this.bodyId,tConEl);
};


	
riff.component.subinfo.prototype.createContent = function(){

	var tContent = riff.widget.convertDate();
	if(this.prefix){
		var tPreEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-prefix" });
		var tPre = riff.manipulation.appendStr([tPreEl],this.prefix);
		riff.manipulation.appendNode(this.bodyId,tPreEl);
	}
	
	var tConEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-con" });
	var tCon = riff.manipulation.createText(tContent);
	riff.manipulation.appendNode([tConEl],tCon);
	
	riff.manipulation.appendNode(this.bodyId,tConEl);
}



riff.component.subinfo.prototype.failedFn = function(){
	if(this.failedFnFlag == true){
		this.clear();
	}
}

riff.flow = function( _userSet ){
	this.name = _userSet.name;
	this.desc = _userSet.desc;
	this.sFn = _userSet.sFn;
	this.eFn = _userSet.eFn;
	this.master = _userSet.master;
	this.comps = _userSet.comps;
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
		this.comps.forEach( function(_el){ if(_el.alwaysRun == true) _el.run() } )		
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




riff.extend({
	master : function(_userSet){
		if (arguments.length > 0 ){
			this.cId = "#" + _userSet.cId;
			this.scene = _userSet.scene;
			this.init.call( this, _userSet );
			this.sFn = _userSet.sFn;
			this.w = _userSet.w;
			this.h = _userSet.h;
			this.dim = this.cId+" ."+riff.widget.global.component.className.dim;
		}
	}
});

riff.master.prototype = {
	classInit : function(){		
		riff.manipulation.addClass(this.cId, riff.widget.global.master.className.base);
		riff.manipulation.addClass(this.cId, this.className);
	},
	createDim : function(){		
		var tDim = riff.manipulation.createElem("div",{"class":riff.widget.global.component.className.dim});
		riff.manipulation.appendNode(this.cId,tDim);		
	},		
	dimVisible : function(){
		
		riff.manipulation.css(this.dim,"display","block")
	},
	dimInvisible : function(){
		riff.manipulation.css(this.dim,"display","none")
	},
	init : function()
	{		
		this.createDim();
		this.classInit();
		riff.widget.global.objs.allMasters.push(this);
		riff.data.buffer( this.cId, "data", this );
	},
	visible : function(){
		riff.manipulation.addClass(this.cId, "rf-status-visible");
	},	
	invisible : function(){
		riff.manipulation.removeClass(this.cId, "rf-status-visible");
	},
	invisibleOther : function(){
		riff.manipulation.removeClass(riff.traversal.filtering(".rf-master",".rf-status-act","not"),"rf-status-visible");
	},
	readjust : function(){
		var tFh = 0;
		function tFn(_el){
			tFh += parseInt(riff.manipulation.css([_el],"height"));
		}
		riff.selector(".rf-status-act.rf-status-fixed").forEach(tFn)
		var tMh = riff.widget.global.marginH;
		var tAh = this.h;
		var tSh = tAh - tFh - tMh;
		riff.manipulation.css(this.scene.cId,"height",tSh+"px");
		
		tFh = tAh = tSh = null;
	},
	run : function(){
		//Window Resize
		riff.widget.resize(this.w,this.h);
		
		//Push the global array		
		riff.widget.global.objs.master = this;		
		
		//Invisible
		this.invisibleOther();		
		//Start function
		if(this.sFn) this.sFn();
		
		//Visible
		this.visible()
	}
};
riff.master.basicFull = function(_userSet){
	this.className = riff.widget.global.master.className.basicFull;
	riff.master.call(this,_userSet);
	this.type = "full";
};	

riff.master.basicFull.prototype = new riff.master();



riff.master.basicIdle = function(_userSet){
	this.className = riff.widget.global.master.className.basicIdle;
	riff.master.call(this,_userSet);
	this.type = "idle";	
}	

riff.master.basicIdle.prototype = new riff.master();

