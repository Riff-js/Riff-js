//riff.widget.master.newsMaster = function(_userSet){
//
//	this.cId = "#"+_userSet.cId;
//	this.className = "rf-master";
//	
//	this.fixed = { 
//		cId : _userSet.fixedAreaCid,
//		cId : _userSet.fixedAreaCid,
//		cId : _userSet.fixedAreaCid,
//		className : "rf-master-fixed"		
//	};
//	
//	
//	this.scene = { 
//		cId : "#"+_userSet.sceneCid,
//		className : "rf-master-scene"	
//	};
//	
//	
//	this.classInit = function(){
//	
//	};
//	
//	this.init = function(_this){
//		_this.classInit();
//	}(this);
//	
//	
//	
//	
//};

riff.widget.master.news = function(_userSet){
	this.cId = "#" + _userSet.cId;
	this.type = _userSet.type;
	this.fixed = _userSet.fixed;
	this.scene = _userSet.scene || null;
		
	this.resize = (this.type != "full") ? function(){} : function(){
		var tMaster = riff.selector(this.cId)[0], 
		tH = parseInt(riff.manipulation.css(this.cId,"height"));		
		
		var tHeaderH = (this.fixed.header) ? parseInt(riff.manipulation.css(this.fixed.header.cId,"height")) : 0;	
		var tMenuH = (this.fixed.menu) ? parseInt(riff.manipulation.css(this.fixed.menu.cId,"height")) : 0;
		var tSoftkeyH = (this.fixed.softkey) ? parseInt(riff.manipulation.css(this.fixed.softkey.cId,"height")) : 0;
		var tDatareceivetimeH = (this.fixed.datareceivetime) ? parseInt(riff.manipulation.css(this.fixed.datareceivetime.cId,"height")) : 0;
		
		//Scene Height
		tH -= tHeaderH+tMenuH+tSoftkeyH+tDatareceivetimeH;		
		riff.selector(this.scene.cId)[0].style["height"] = tH + "px";
		
		tMaster = tHeaderH = tMenuH = tSoftkeyH = tDatareceivetimeH = tH = null;
	};
	
	this.visible = function(_obj){
		riff.manipulation.css((_obj ? _obj.cId : this.cId), "display", "block"); 
		this.resize();
	};
	
	this.invisible = function(_obj){
		riff.manipulation.css((_obj ? _obj.cId : this.cId), "display", "none");
		this.resize();
	};
	
	this.classInit = function(){
		riff.manipulation.addClass(this.cId, (this.type == "full") ? riff.widget.master.className.full : riff.widget.master.className.idle);
	};
	
	this.init = function(_this){
		_this.classInit.call(_this);

		/* remove sub fixed area classInit
		if(_this.fixed){
			var tFn = function(_el, _idx, _arr){
				_el.classInit();
			}
			_this.fixed.forEach(tFn);
			tFn = null;
		}
		*/
		_this.resize();
		
	}(this);
};

riff.widget.master.news.components = function(_userSet){
	this.cId = "#" + _userSet.cId;
	this.position = _userSet.position;
	this.visibility = _userSet.visibility || riff.widget.master.visibility;
	this.type = _userSet.type;
	this.className = "";
	
	if(this.type == "header") this.className = riff.widget.master.className.header;
	else if(this.type == "scene") this.className = riff.widget.master.className.scene;
	else if(this.type == "datareceivetime") this.className = riff.widget.master.className.datareceivetime;
	else if(this.type == "softkey") this.className = riff.widget.master.className.softkey;
	else if(this.type == "menu") this.className = riff.widget.master.className.menu;
	
	
	this.classInit = function(_this){
		riff.manipulation.addClass(_this.cId, _this.className);
		if(_this.visibility == "hidden") riff.manipulation.css(_this.cId, "display", "none");
	}(this);	
};

