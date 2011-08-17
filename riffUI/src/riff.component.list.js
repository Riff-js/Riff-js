riff.component.list = function(_userSet){
	this.className = riff.ui.global.component.className.list
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
	
	riff.manipulation.addClass(this.item(),riff.ui.global.component.className.orderingList);
	//Create the DOM Element.
	var tObj = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.ordering});	
	var tObjUp = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.orderingUp});
	var tObjDown = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.orderingDown});
	riff.manipulation.appendNode([tObj],tObjUp);
	riff.manipulation.appendNode([tObj],tObjDown);
	riff.manipulation.appendNode(this.item(),tObj);
	tObj = null;
	
	//Added property
	this.orderingUp = this.cId+" ."+riff.ui.global.component.className.orderingUp;
	
	//Added property
	this.orderingDown = this.cId+" ."+riff.ui.global.component.className.orderingDown;
	
	//Added property
	this.ordering = this.cId+" ."+riff.ui.global.component.className.ordering;
	
	
	//Event Binding
	//this = li
	//_obj = this.content			
	function orderingEvent(){		
		var tItem = this;
		var tBody = riff.selector(tComp.bodyId)[0];
		var tContent = tComp.tempContent;
		var tLength = tComp.content.length;
		var tOrderUp = riff.traversal.find([tItem]," ."+riff.ui.global.component.className.orderingUp);
		var tOrderDown = riff.traversal.find([tItem]," ."+riff.ui.global.component.className.orderingDown);
						
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
		var tFirstDownEle = riff.traversal.find([tFirstItem],"."+riff.ui.global.component.className.orderingDown);
		var tFirstUpEle = riff.traversal.find([tFirstItem],"."+riff.ui.global.component.className.orderingUp);
		riff.manipulation.addClass(tFirstDownEle,"rf-status-dim");
		riff.manipulation.addClass(tFirstUpEle,"rf-status-dim");
	}
	
	
}




riff.component.list.prototype.callCheckbox = function(){
	
	//this.tempContent = null;
	this.tempContent = new riff.util.cloneObject(this.content);
	var tComp = this;
	//Create the checkbox
	var tEle = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.checkbox});	
	riff.manipulation.appendNode(this.item(),tEle);
	if(this.item().length > 0)riff.manipulation.addClass(this.item(),riff.ui.global.component.className.checklist);
	
	this.checkbox = this.cId+" ."+riff.ui.global.component.className.checkbox;
	this.checklistItem = this.cId+" ."+riff.ui.global.component.className.checklist;
	for (_k in this.tempContent){		
		if(this.tempContent[_k].checked == true){
			riff.manipulation.addClass(riff.traversal.find([this.item()[_k]]," ."+riff.ui.global.component.className.checkbox),"rf-status-on")	
		}
	}
	
	
	riff.event.tap(this.item(),function(){		
		var tIdx = riff.traversal.index([this]);
		if(tComp.selectAllFlag == true) var tIdx = riff.traversal.index([this])-1;		
				
		if(tComp.tempContent[tIdx]){
			if(tComp.tempContent[tIdx].checked){
				tComp.tempContent[tIdx].checked = false;
				riff.manipulation.removeClass(riff.traversal.find([this],"."+riff.ui.global.component.className.checkbox),"rf-status-on");						
			} else {
				tComp.tempContent[tIdx].checked = true;			
				riff.manipulation.addClass(riff.traversal.find([this],"."+riff.ui.global.component.className.checkbox),"rf-status-on");
				
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
	var tEle = riff.manipulation.createElem("li",{"class":riff.ui.global.component.className.selectAll});
	var tTxtEle = riff.manipulation.createElem("div",{"class":"rf-component-item-text"});
	var tTxt = riff.manipulation.createText(riff.ui.global.component.selectAllStr);
	riff.manipulation.appendNode([tTxtEle],tTxt);
	riff.manipulation.appendNode([tEle],tTxtEle)	
	
	var tEle2 = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.checkbox});	
	riff.manipulation.appendNode([tEle],tEle2);		
	riff.manipulation.prependNode(this.bodyId,tEle);

	
	riff.event.tap( this.bodyId+" ."+riff.ui.global.component.className.selectAll,function(){
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
		riff.manipulation.addClass(riff.traversal.find(this.bodyId," ."+riff.ui.global.component.className.selectAll+" ."+riff.ui.global.component.className.checkbox),"rf-status-on");
	} else {
		this.allChecked = false;
		riff.manipulation.removeClass(riff.traversal.find(this.bodyId," ."+riff.ui.global.component.className.selectAll+" ."+riff.ui.global.component.className.checkbox),"rf-status-on");
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
	var tEle = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.radio});	
	riff.manipulation.appendNode(this.item(),tEle);
	riff.manipulation.addClass(this.item(),riff.ui.global.component.className.radioList);
	
	this.radio = this.cId+" ."+riff.ui.global.component.className.radio;
	this.radioListItem = this.cId+" ."+riff.ui.global.component.className.radioList;
	
	for (_k in this.tempContent){
		if(this.tempContent[_k].checked == true){			
			if(this.item().length > 0) riff.manipulation.addClass(riff.traversal.find([this.item()[_k]]," ."+riff.ui.global.component.className.radio),"rf-status-on")	
		}
	}
	
	riff.event.tap(this.item(),function(){
		var tIdx = riff.traversal.index([this]);
		var tRadio = riff.traversal.find(tComp.bodyId, tComp.radio);
			
		for (_k in tComp.tempContent){
			tComp.tempContent[_k].checked = false;
		}		
		riff.manipulation.removeClass(riff.traversal.find(tComp.bodyId,"."+riff.ui.global.component.className.radio),"rf-status-on");			
		tComp.tempContent[tIdx].checked = true;
		riff.manipulation.addClass(riff.traversal.find([this],"."+riff.ui.global.component.className.radio),"rf-status-on");		
	})
};


riff.component.list.prototype.callIdleList = function(){
	//riff.manipulation.addClass(this.cId,riff.ui.global.component.className.idleList)
	if(riff.selector(this.cId+" li").length > 0) riff.manipulation.addClass([riff.selector(this.cId+" li")[0]],"rf-status-visible")
	
	var tComp = this;	
	var tP = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.idlePrev});
	var tN = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.idleNext});
	riff.manipulation.appendNode(riff.selector(this.cId),tP);
	riff.manipulation.appendNode(riff.selector(this.cId),tN);
	
	riff.event.tap(this.cId+" ."+riff.ui.global.component.className.idlePrev,function(){
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
	
	riff.event.tap(this.cId+" ."+riff.ui.global.component.className.idleNext,function(){
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
		
		//riff.manipulation.addClass([this.item()[this.item().length-1]],"rf-style-list-lastchild");
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



