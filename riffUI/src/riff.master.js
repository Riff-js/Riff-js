riff.extend({
	master : function(_userSet){
		if (arguments.length > 0 ){
			this.cId = "#" + _userSet.cId;
			this.scene = _userSet.scene;
			this.init.call( this, _userSet );
			this.sFn = _userSet.sFn;
			this.w = _userSet.w;
			this.h = _userSet.h;
			this.dim = this.cId+" ."+riff.ui.global.component.className.dim;
		}
	}
});

riff.master.prototype = {
	classInit : function(){		
		riff.manipulation.addClass(this.cId, riff.ui.global.master.className.base);
		riff.manipulation.addClass(this.cId, this.className);
	},
	createDim : function(){		
		var tDim = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.dim});
		riff.manipulation.appendNode(this.cId,tDim);		
	},		
	dimVisible : function(){
		
		riff.manipulation.css(this.dim,"display","block")
	},
	dimInvisible : function(){
		riff.manipulation.css(this.dim,"display","none")
	},
	init : function()
	{		
		this.createDim();
		this.classInit();
		riff.ui.global.objs.allMasters.push(this);
		riff.data.buffer( this.cId, "data", this );
	},
	visible : function(){
		riff.manipulation.addClass(this.cId, "rf-status-visible");
	},	
	invisible : function(){
		riff.manipulation.removeClass(this.cId, "rf-status-visible");
	},
	invisibleOther : function(){
		riff.manipulation.removeClass(riff.traversal.filtering(".rf-master",".rf-status-act","not"),"rf-status-visible");
	},
	readjust : function(){
		var tFh = 0;
		function tFn(_el){
			tFh += parseInt(riff.manipulation.css([_el],"height"));
		}
		riff.selector(".rf-status-act.rf-status-fixed").forEach(tFn)

		var tH = riff.ui.global.fullH;
		var tMh = riff.ui.global.marginH;

		var tAh = this.h;
		var tSh = tAh - tFh - tMh;	
			
		riff.manipulation.css(this.scene.cId,"height",tSh+"px");
		riff.manipulation.css(this.cId,"height",tH-tMh+"px");
		//riff.manipulation.css(this.cId,"padding-top",tMh+"px");
		
		tFh = tAh = tSh = null;
	},
	run : function(){
		//Window Resize
		riff.widget.resize(this.w,this.h,riff.ui.global.resizeWork);
		
		//Push the global array		
		riff.ui.global.objs.master = this;		
		
		//Invisible
		this.invisibleOther();		
		//Start function
		if(this.sFn) this.sFn();
		
		//Visible
		this.visible()
	}
};