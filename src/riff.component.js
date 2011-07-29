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
		//this.eventInit();
		
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


