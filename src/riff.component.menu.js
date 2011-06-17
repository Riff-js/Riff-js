riff.component.menu = function(_userSet){	
	this.cId = "#" + _userSet.cId;
	this.bodyId = "#" + _userSet.bodyId;
	this.effect = _userSet.effect;
	this.fn = _userSet.fn;	
	this.event = _userSet.event;
	this.type = _userSet.type;	
	
	if ( _userSet.type == "tab"){
		this.className = "rf-component-tab";
	} else if( _userSet.type == "navigation" ){
		this.className = "rf-component-navigation";
	};

	this.createItem = function(_s,_type){	
		if (!_type) _type = "node";		
		//Node type				
		if (_type == "node"){	
			var tItem = riff.manipulation.createElem("li",{"class":"rf-component-menu-item"});							
			var tText = riff.manipulation.createText(_s);										
			riff.manipulation.appendNode([tItem],tText);
			riff.manipulation.appendNode(this.bodyId,tItem);					
		} else if (_type == "str"){		
		//String Type			
			riff.manipulation.appendStr(this.bodyId, "<li class='rf-component-menu-item'>"+_s+"</li>")			
		}								 		 		
	}	;

		
	this.classInit = function(){
		$.manipulation.addClass(this.cId, this.className);
	};
		
	this.item = _userSet.item;		
	
	this.init = function(_this){
		_this.classInit.call(_this);	
	}(this);
	
}