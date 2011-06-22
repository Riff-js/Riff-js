riff.component.list.checklist = function(_userSet){
	riff.component.call(this, _userSet);
	this.className = "rf-component-list-check rf-component";
	this.all = _userSet.all || false;
	this.allFlag = false;

	this.addSelectAll = function(){
		var tThis = this,
			tElm = riff.manipulation.createElem("ul",{"class":"rf-component-check-select","id": this.allId}),
			tAll = riff.manipulation.createElem("li",{"class":"rf-component-check-item"}),
			tChkbox = riff.manipulation.createElem("div",{"class":"check-box"}),
			tText = riff.manipulation.createText(this.allText);
		
		riff.manipulation.appendNode([tAll],tChkbox);
		riff.manipulation.appendNode([tAll],tText);
		riff.manipulation.appendNode([tElm],tAll);
		riff.manipulation.prependNode(this.cId,tElm);
	
	
		var tId = "#" + tThis.allId;
		riff.event.tap(riff.traversal.find(tId, "li"),function(){
			tThis.selectAll();
		});		
		//tThis = null;
		tElm = null;
		tAll = null;
		tChkbox = null;
		tText = null;
	};
	
	this.selectAll = function(){
		if(this.allFlag){
			this.allFlag = false;
			for(var i=0,iLen = this.content.length;i<iLen;i++){
				this.content[i].checked = false;
			}
			riff.manipulation.removeClass(riff.traversal.find("#" + this.allId, ".check-box"),"check-on");
			riff.manipulation.removeClass(riff.traversal.find(this.bodyId, ".check-box"),"check-on");
			
		} else {
			this.allFlag = true;
			for(var i=0,iLen = this.content.length;i<iLen;i++){
				this.content[i].checked = true;
			}
			
			riff.manipulation.addClass(riff.traversal.find("#" + this.allId, ".check-box"),"check-on");
			riff.manipulation.addClass(riff.traversal.find(this.bodyId, ".check-box"),"check-on");
		}
	};
	
	this.selectAllCheck = function(){
		if(this.all){
			var tCnt  = 0,
				tLen = this.content.length;
			
			for(var i=0;i<tLen;i++){
				if(this.content[i].checked) tCnt++;
			}
			if(tCnt == tLen){
				this.allFlag = true;
				riff.manipulation.toggleClass(riff.traversal.find("#" + this.allId, ".check-box"),"check-on");
			} else {
				this.allFlag = false;
				riff.manipulation.removeClass(riff.traversal.find("#" + this.allId, ".check-box"),"check-on");
			}
			
			tCnt = null;
			tLen = null;
		}
	};
	
	this.getCheckValue = function(){
		var rArr = new Array();
		for(var i=0,iLen = this.content.length;i<iLen;i++){
			if(this.content[i].checked) rArr.push(this.content[i].value);
		}
		return rArr;
	};
	this.init = function(_this){
		if (_this.all) {
			_this.allText = _userSet.allText || "select all";
			_this.allId = _this.bodyId.replace(/\#/,"") + "-select-all"; 

			_this.addSelectAll.call(_this);
		}
		_this.classInit.call(_this);
		riff.widget.global.objs.allComps.push(_this);
	}(this);
};

riff.component.list.checklist.prototype = new riff.component();
riff.component.list.checklist.prototype.createItem = function(_s,_type){	
	if (!_type) _type = "node";
	
	//Node type				
	if (_type == "node"){	
		var tListItem = riff.manipulation.createElem("li",{"class":"rf-component-check-item"});
		var tListText = riff.manipulation.createText(_s);
		var tChkBox = riff.manipulation.createElem("div",{"class":"check-box"});
		riff.manipulation.appendNode([tListItem],tChkBox);
		riff.manipulation.appendNode([tListItem],tListText);
		riff.manipulation.appendNode(this.bodyId,tListItem);
		
		tListItem = null;
		tListText = null;
		tChkBox = null;
		
	} else if (_type == "str"){		
	//String Type			
		riff.manipulation.appendStr(this.bodyId, "<li class='rf-component-chekc-item'><div class='check-box'></div>"+_s+"</li>");
	}				
};
