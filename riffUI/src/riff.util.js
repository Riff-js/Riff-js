
riff.extend({
	util : {
		xmlToContent : function( _XML, _contentsObj, _opt ){
			
			var tXML = riff.ajax.xmlSelector(_XML, "item");
			var tTitle = riff.ajax.textArray(tXML, "title");
			var tPubDate = riff.ajax.textArray(tXML, "pubDate");
			var tLink = riff.ajax.textArray(tXML, "link");
			var tText = riff.ajax.textArray(tXML, "description");
			
			//var tImg = riff.ajax.textArray( tXML, "content" );
			_contentsObj.content = [];
			var tLen = tTitle.length;
			var tImgSrc, tDoc, tTextOnly, tNode;
			
			tNode = document.createElement( "div");
			
			for (var i = 0; i < tLen; i++) {
				
				tImgSrc = riff.traversal.find([tXML[i]], "content");
				
				if (tImgSrc&& tImgSrc.length > 0) 
					tImgSrc = tImgSrc[0].getAttribute("url");
				else 
					tImgSrc = null;
				
				tNode.innerHTML = tText[i];
				tTextOnly = riff.manipulation.text( [ tNode ] );
				_contentsObj.content.push({
					tit: tTitle[i],
					img: tImgSrc,
					text: tTextOnly,
					link: tLink[i],
					updated: tPubDate[i]
					//credit: tPubDate[i]
				});
			};
			tNode = tXML = tTitle = tPubDate = tLink = tText = tImgSrc;
		},
		objToArr : function(_obj){
			var rArr = [], tVal;
			for(var _k in _obj){
				if(_obj.hasOwnProperty(_k)){
					tVal = _obj[_k];
					if(tVal && typeof tVal == "object"){
						rArr[rArr.length] = _k + " : {" + arguments.callee(tVal).join(", ") + "}";
					} else {
						if(typeof tVal == "string"){
							rArr[rArr.length] = [ _k + ": \"" + tVal.toString() + "\""];
						} else {
							rArr[rArr.length] = [ _k + ": " + tVal.toString()];
						}
					}
				}
			}
			return rArr;
		},
		objToStr : function(_obj){
			return "{" + riff.util.objToArr(_obj).join(", ") + "}"; 
		},
		setAutoRefresh : function( _id, _time ){
			function tAutoRefresh(){
				var tComp = riff.ui.global.objs.refreshComps;
				for (var i = 0, iLen = tComp.length; i < iLen; i++) {
					if (riff.manipulation.hasClass(tComp[i].cId, "rf-status-visible") == true) {
						riff.ui.global.objs.flow.run("auto refresh");
						break;
					}
				}
			};
			
			if(!_time){
				riff.util.timer(_id);
			} else {
				_time = Number(_time) * 1000 * 60;
				riff.util.timer(tAutoRefresh, _time, _id);
			}
		},
		setAutoScroll : function( _id, _time, _on ){
			function tAutoScroll(){
				riff.event.trigger(".rf-component-idleNext","tap");
			};
			
			riff.util.timer(_id);
			
			if(_on){
				
				riff.util.timer(tAutoScroll, (_time || 3) * 1000, _id);
			}
		}
	},
	data : {
		//n storage base localStorage(PC)
		//n @_key { String } ex : "AUTOREFRESH"
		//n @_type { String } Default : ":" ex : "|" 
		//n @_value { Object } ex : { value : 0, text : "None" }
		storageObj : function(_key, _type, _value){
			if(!_key){
				return null;
			}
			if(!_type){
				_type = ":";
			}
			if(!_value){
				var t = riff.data.storage(_key);
				return t.split(_type);
			} else {
				if(typeof _value == "object"){
					var tArr = new Array();
					tArr[0] = _value.value;
					tArr[1] = _value.text;
					riff.data.storage(_key, _tArr.join(_type));
				} else {
					riff.data.storage(_key, _value);
				}
			}
		},
		//n storage base localStorage(PC)
		//n @_key { String } ex : "AUTOREFRESH"
		//n @_type { String } Default : ":" ex : "|" 
		//n @_value { Object } ex : { value : 0, text : "None" }
		setStorage : function(_key, _value){
			if(!_key && !_value){
				return null;
			}
			riff.data.storage(_key, riff.util.objToStr(_value));
		},
		getStorage : function(_key, _value){
			if(!_key){
				return null;
			}
			var t = riff.data.storage(_key);
			if(!t){
				return null;
			}
			
			var tData = eval("(" + t + ")");
			if(!_value){
				return tData;
			} else {
				return tData[_value];
			}
		}
	}
});





