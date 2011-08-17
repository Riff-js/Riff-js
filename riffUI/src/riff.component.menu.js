riff.component.menu = function(_userSet){	
	this.type = _userSet.type;
	if ( _userSet.type == "tab"){
		this.className = riff.ui.global.component.className.tab;
	} else if( _userSet.type == "navigation" ){
		this.className = riff.ui.global.component.className.navigation;
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
		var tArrL = riff.ui.global.effObj.arrLeft();
		var tArrR = riff.ui.global.effObj.arrRight();
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
	riff.ui.global.objs.flow.run();
}

riff.component.menu.prototype.failedFn = function(){
	if(this.failedFnFlag == true){		
		this.clear();
	}
}


