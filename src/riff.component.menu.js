riff.component.menu = function(_userSet){	
	riff.component.call(this,_userSet);
	this.type = _userSet.type;	
	
	if ( _userSet.type == "tab"){
		this.className = riff.widget.global.component.className.tab;
	} else if( _userSet.type == "navigation" ){
		this.className = riff.widget.global.component.className.navigation;
	};		
	this.init = function(_this){
		_this.classInit.call(_this);
		riff.widget.global.objs.allComps.push(_this);	
	}(this);	
}

riff.component.menu.prototype = new riff.component();