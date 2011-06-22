riff.component.list.radiolist = function(_userSet){
	riff.component.call(this, _userSet);
	this.className = "rf-component-list-radio rf-component";
	this.name = _userSet.name || "";

	this.addRadioName = function(){
		var tThis = this,
			tElm = riff.manipulation.createElem("ul"),
			tAll = riff.manipulation.createElem("li",{"class":"rf-component-radio-name"}),
			tText = riff.manipulation.createText(this.name);
		
		riff.manipulation.appendNode([tAll],tText);
		riff.manipulation.appendNode([tElm],tAll);
		riff.manipulation.prependNode(this.cId,tElm);

		tElm = null;
		tAll = null;
		tText = null;
	};
	
	this.select = function(_idx){
		var tCnt  = 0,
			tLen = this.content.length,
			tBox = riff.traversal.find(this.bodyId, ".radio-box");

		for(var i=0;i<tLen;i++){
			if(i == _idx){
				this.content[i].selected = true;
				riff.manipulation.addClass([tBox[i]],"radio-on");
			} else {
				this.content[i].selected = false;
				riff.manipulation.removeClass([tBox[i]],"radio-on");
			}
		}
		
		tCnt = null;
		tLen = null;
		tBox = null;
	};
	
	this.getSelectValue = function(){
		var rVal = null;
		for(var i=0,iLen = this.content.length;i<iLen;i++){
			if(this.content[i].selected){
				rVal = this.content[i].value
			}
		}
		return rVal;
	};
	
	this.init = function(_this){
		if (_this.name != "") {
			_this.addRadioName.call(_this);
		}
		_this.classInit.call(_this);
		riff.widget.global.objs.allComps.push(_this);
	}(this);
};

riff.component.list.radiolist.prototype = new riff.component();
riff.component.list.radiolist.prototype.createItem = function(_s,_type){	
	if (!_type) _type = "node";
	
	//Node type				
	if (_type == "node"){	
		var tListItem = riff.manipulation.createElem("li",{"class":"rf-component-radio-item"});
		var tListText = riff.manipulation.createText(_s);
		var tChkBox = riff.manipulation.createElem("div",{"class":"radio-box"});
		riff.manipulation.appendNode([tListItem],tChkBox);
		riff.manipulation.appendNode([tListItem],tListText);
		riff.manipulation.appendNode(this.bodyId,tListItem);
		
		tListItem = null;
		tListText = null;
		tChkBox = null;
		
	} else if (_type == "str"){		
	//String Type			
		riff.manipulation.appendStr(this.bodyId, "<li class='rf-component-chekc-item'><div class='radio-box'></div>"+_s+"</li>");
	}				
};
