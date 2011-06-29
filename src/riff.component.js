//Component property 
riff.component = function(_userSet ){
	if (arguments.length > 0 ){	
		this.cId = "#" + _userSet.cId;						
		(_userSet.bodyId == undefined) ? this.bodyId = this.cId : this.bodyId = "#" + _userSet.bodyId;
		this.refresh = _userSet.refresh;			
		this.sFn = _userSet.sFn; 	
		this.eFn = _userSet.eFn;	
		this.content = _userSet.content;
		this.addObj = _userSet.addObj
		this.parent = _userSet.parent;
		this.children = [];
		this.event = _userSet.event;
		this.fixed = _userSet.fixed;
		this.addClassName = _userSet.addClassName;
		this.customClassName = _userSet.customClassName;
		this.init.apply( this, arguments );
		this.type = _userSet.type;
		this.failedFnFlag = _userSet.failedFnFlag;
//		this.initFirst = _userSet.initFirst;
	}
};

//Component method
riff.component.prototype = {
	createItem : function(_s,_type,_id,_tag){	
		if (!_type) _type = "node";		
		if (!_tag) _tag = "li";		
		if (_id){ 
			var tAttr = {
				"class":"rf-component-item",
				"id":_id }
		} else {
			var tAttr = { "class":"rf-component-item" }
		};			
		var tlistItem = riff.manipulation.createElem(_tag,tAttr);
		
		if (_type == "node"){
			var tTextEle = riff.manipulation.createElem("div",{"class":"rf-component-item-text"});
			var tText = riff.manipulation.createText(_s);										
			riff.manipulation.appendNode([tTextEle],tText);
			riff.manipulation.appendNode([tlistItem],tTextEle);
		};		
		if (_type == "str") riff.manipulation.appendStr([tlistItem],_s);
		
		riff.manipulation.appendNode(this.bodyId,tlistItem);
		
		tAttr = tText = tTextEle = tlistItem = null;
	},
	createContent : function(){
		riff.manipulation.appendStr(this.bodyId, this.content);		
	},	
	clearBody : function(_s){
		if(_s) {
			//Clear the All contents of component; 
			var tCid = riff.traversal.contents( riff.selector(this.cId));
			var tEle = riff.traversal.filtering(tCid,this.bodyId,"not");
			riff.manipulation.remove(tEle ,"clear" );
			riff.manipulation.remove( riff.traversal.contents( riff.selector(this.bodyId)),"clear" );
		} else {
			riff.manipulation.remove( riff.traversal.contents( riff.selector(this.bodyId)),"clear" );
		}		
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
				riff.event.tap([this.item()[_k]],this.content[_k].event)
			}			
		}
	},
	//_obj = Flow object
	visible : function()
	{	

		riff.widget.global.objs.comps.push(this);
		riff.manipulation.addClass(this.cId,"rf-status-visible");

	},
	
	//_obj = Flow object
	invisible : function()
	{	
		riff.util.pop(riff.widget.global.objs.comps,this)
		riff.manipulation.removeClass(this.cId,"rf-status-visible")		
	},
	run : function(_arg){		
		if (this.sFn) this.sFn.call(this,arguments);
		if (this.addObj) this.addObj.call(this,arguments);
		if (this.themeFn) this.themeFn.call(this,arguments);
		if (this.event) this.event.call(this,arguments);
	},
	start : function(_arg){
		this.run.apply(this,arguments)
		this.visible();
	},
	stop : function(_arg){
		if (this.eFn) this.eFn.apply(this,arguments);
		this.invisible();
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


