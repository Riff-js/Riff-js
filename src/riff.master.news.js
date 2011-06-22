riff.extend({
	master : {
		news: function(_userSet){
			this.cId = "#" + _userSet.cId;
			this.type = _userSet.type;
			this.fixed = _userSet.fixed || null;
			this.scene = _userSet.scene || null;
			this.className = riff.widget.global.master.className[this.type];
						
			this.resize = (this.type != "full") ? function(){} : function(){
				var tMaster = riff.selector(this.cId)[0], tH = parseInt(riff.manipulation.css(this.cId, "height"));				
				var tHeaderH = (this.fixed.header) ? parseInt(riff.manipulation.css(this.fixed.header.cId, "height")) : 0;
				var tMenuH = (this.fixed.menu) ? parseInt(riff.manipulation.css(this.fixed.menu.cId, "height")) : 0;
				var tSoftkeyH = (this.fixed.softkey) ? parseInt(riff.manipulation.css(this.fixed.softkey.cId, "height")) : 0;
				var tDatareceivetimeH = (this.fixed.datareceivetime) ? parseInt(riff.manipulation.css(this.fixed.datareceivetime.cId, "height")) : 0;
				
				//Scene Height
				tH -= tHeaderH + tMenuH + tSoftkeyH + tDatareceivetimeH;
				riff.selector(this.scene.cId)[0].style["height"] = tH + "px";
				
				tMaster = tHeaderH = tMenuH = tSoftkeyH = tDatareceivetimeH = tH = null;
			};
			
			this.pushMasterFixed = function(_obj){
				if(_obj){
					if (riff.util.isArray(_obj)) {
						var tObjIds = new Array();
						for (var i=0, iLen = riff.widget.global.objs.fixed.length;i<iLen;i++)
							tObjIds.push(riff.widget.global.objs.fixed[i].cId);
							
						for(var i=0,iLen = _obj.length; i<iLen;i++){
							if(tObjIds.indexOf(_obj[i].cId) == -1){
								riff.widget.global.objs.fixed.push(_obj[i]);
							}
						}
						tObjIds = null;
					} else {
						var tExist = false;
						for(var i=0,iLen = riff.widget.global.objs.fixed.length;i<iLen;i++){
							if(riff.widget.global.objs.fixed[i].cId == _obj.cId){
								tExist = true;
								break;
							}
						}
						if(!tExist) riff.widget.global.objs.fixed.push(_obj);
					}
				} else {
					var tFnPush = function(_el, _idx, _arr){
						var tExist = false;
						for(var i=0,iLen = riff.widget.global.objs.fixed.length; i<iLen;i++){
							if(riff.widget.global.objs.fixed[i].cId == _el.cId){
								tExist = true;
								break;
							}
						}
						if(!tExist) riff.widget.global.objs.fixed.push(_obj);
					}
					
					this.fixed.forEach(tFnPush);
					
					tFnPush = null;
				}
			},
			
			this.popMasterFixed = function(_obj,_type){
				var tArr = new Array();
				
				if(_obj){
					if(riff.util.isArray(_obj)){
						var tObjIds = new Array();
						for (var i=0, iLen = _obj.length;i<iLen;i++)
							tObjIds.push(_obj[i].cId);
						
						for(var i=0,iLen = riff.widget.global.objs.fixed.length;i<iLen;i++){
							if(tObjIds.indexOf(riff.widget.global.objs.fixed[i].cId) == -1) tArr.push(riff.widget.global.objs.fixed[i]);
						}
						tObjIds = null;
					} else {
						for(var i=0,iLen = riff.widget.global.objs.fixed.length;i<iLen;i++){
							if(riff.widget.global.objs.fixed[i].cId != _obj.cId){
								tArr.push(riff.widget.global.objs.fixed[i]);
							}
						}
					}
				} else {
					var tObjIds = new Array();
					for (var i=0, iLen = this.fixed.length;i<iLen;i++)
						tObjIds.push(this.fixed[i].cId);
						
					for(var i=0,iLen = riff.widget.global.objs.fixed.length;i<iLen;i++){
						if(tObjIds.indexOf(riff.widget.global.objs.fixed[i].cId) == -1) tArr.push(riff.widget.global.objs.fixed[i]);
					}
					tObjIds = null;
				}
				
				riff.widget.global.objs.fixed = tArr;
				tArr = null;
			},
			
			this.visible = function(_obj){
				if (_obj){
					//n fixed, scene's visible
					//n registi riff.global.display.[fixed||scene]
					if(_obj.type == "scene"){
						riff.widget.global.objs.scene = _obj;
					} else {
						this.pushMasterFixed(_obj);
					}
				} else {
					//n master's visible
					//n regist riff.widget.global.display.master
					riff.widget.global.objs.master = this;
					for(var i=0,iLen=riff.widget.global.objs.allMaster.length;i<iLen;i++){
						if(riff.widget.global.objs.allMaster[i].cId != this.cId)
							riff.widget.global.objs.allMaster[i].invisible();
					}
					if(this.fixed){
						for(var i=0,iLen = this.fixed.length;i<iLen;i++){
							if(!this.fixed[i].visibility || this.fixed[i].visibility == "visible")
								this.pushMasterFixed(this.fixed[i]);
						}
					}
					if(this.scene){
						riff.widget.global.objs.scene = this.scene;
					} else {
						riff.widget.global.objs.scene = null;
					}
					
				}
				
				riff.manipulation.css((_obj ? _obj.cId : this.cId), "display", "block");
				this.resize();
			};
			
			this.invisible = function(_obj){
				if(_obj){
					if(_obj.type != "scene"){
						this.popMasterFixed(_obj);
					}
				} else {
					if(this.fixed){
						for(var i=0,iLen=this.fixed.length;i<iLen;i++){
							this.popMasterFixed(this.fixed[i]);
						}
					}
				}
				riff.manipulation.css((_obj ? _obj.cId : this.cId), "display", "none");
				this.resize();
			};
			
			this.classInit = function(){
				riff.manipulation.addClass(this.cId, this.className);
			};
			
			this.init = function(_this){
				_this.classInit.call(_this);
				_this.resize();
				
				//regist riff.widget.global.allElm.master
				riff.widget.global.objs.allMaster.push(_this);
			}(this);
			
		}
	}
});

riff.extend({
	master : {
		news : {
			components: function(_userSet){
				this.cId = "#" + _userSet.cId;
				this.position = _userSet.position;
				this.visibility = _userSet.visibility || riff.widget.global.master.visibility;
				this.type = _userSet.type;				
				this.className = riff.widget.global.master.className[this.type];
				this.comp = _userSet.comp;
				this.classInit = function(){
					riff.manipulation.addClass(this.cId, this.className);
				};
				this.init = function(_this){
					if(_this.comp){
						for(var i=0;i<_this.comp.length;i++){
							_this.comp[i].scene = _this;
						}
					}
					if(_this.type ){
						_this.classInit.call(_this);
						if(_this.type == "scene"){
							riff.widget.global.master.sceneId = _this.cId;
							riff.widget.global.objs.allScene.push(_this);
						} else {
							riff.widget.global.objs.allFixed.push(_this);
						}
					}
					
					if (_this.visibility == "hidden") 
						riff.manipulation.css(_this.cId, "display", "none");
				}(this);
			}
		}
	}
});