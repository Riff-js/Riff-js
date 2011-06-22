//Component property 
riff.component = function(_userSet){
	if (arguments.length > 0 ){	
		this.cId = "#" + _userSet.cId;						
		(_userSet.bodyId == undefined) ? this.bodyId = this.cId : this.bodyId = "#" + _userSet.bodyId;
		this.effect = _userSet.effect;	
		this.sFn = _userSet.sFn;	
		this.eFn = _userSet.sFn;	
		this.content = _userSet.content;
		this.effect = _userSet.effect;
		this.parent = _userSet.parent;
		this.child = _userSet.child;
		this.event = _userSet.event;	
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
		//Node type				
		if (_type == "node"){	
			var tlistItem = riff.manipulation.createElem(_tag,tAttr);							
			var tListText = riff.manipulation.createText(_s);										
			riff.manipulation.appendNode([tlistItem],tListText);
			riff.manipulation.appendNode(this.bodyId,tlistItem);					
		} else if (_type == "str"){		
		//String Type			
			var tlistItem = riff.manipulation.createElem(_tag,tAttr);			
			riff.manipulation.appendStr([tlistItem], _s);
			riff.manipulation.appendNode(this.bodyId,tlistItem);
		}								 		 		
		
		tAttr = null;
	},
	createContent : function(){
		riff.manipulation.appendStr(this.bodyId, this.content);		
	},	
	clearBody : function(){
		riff.manipulation.remove( riff.traversal.children( riff.selector(this.bodyId)) );		
	},		
	item : function(_s){
		if (typeof _s == "number") { 
			return [riff.traversal.children(this.bodyId)[_s]];
		} else if (typeof _s == "string"){
			return riff.selector(this.bodyId+" #"+_s);
		} else {
			return riff.traversal.children(this.bodyId)
		} 
	},	
	
	classInit : function(){
		riff.manipulation.addClass(this.cId, riff.widget.global.component.className.base);
		riff.manipulation.addClass(this.cId, this.className);
	},		
	eventInit : function(){
		for ( _k in this.content){			
			riff.event.tap([this.item()[_k]],this.content[_k].event)			
		}
	},
};


;