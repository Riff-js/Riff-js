riff.component.list = function(_userSet){
	this.className = "rf-component-list rf-component";
	this.cId = "#" + _userSet.cId;
	this.bodyId = "#" + _userSet.bodyId;	
	this.effect = _userSet.effect;	
	this.fn = _userSet.fn;
	
	this.event = _userSet.event;	
	
	this.createItem = function(_s,_type){	
		if (!_type) _type = "node";		
		//Node type				
		if (_type == "node"){	
			var tlistItem = riff.manipulation.createElem("li",{"class":"rf-component-list-item"});							
			var tListText = riff.manipulation.createText(_s);										
			riff.manipulation.appendNode([tlistItem],tListText);
			riff.manipulation.appendNode(this.bodyId,tlistItem);					
		} else if (_type == "str"){		
		//String Type			
			riff.manipulation.appendStr(this.bodyId, "<li class='rf-component-list-item'>"+_s+"</li>")			
		}								 		 		
	}	;
	
	this.deleteItem = function(_num){
		if(typeof(_num) == "number"){					
			riff.manipulation.remove( [riff.traversal.find(this.bodyId,"li")[_num]] )
		} else if ( _num == "undefined"){			
			riff.manipulation.remove( riff.traversal.find(this.bodyId,"li") );
		}
	};
	
	this.classInit = function(){
		$.manipulation.addClass(this.cId, this.className);
	};
	
	this.item = _userSet.item;
	
	this.init = function(_this){
		_this.classInit.call(_this);		
		//arr: Component object on a widget
		riff.widget.global.comps.push(_this);			
	}(this);
	
	
};