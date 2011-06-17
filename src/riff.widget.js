
riff.extend({
	widget : {
		global : {
			effect : {
				border : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-border"});
				},
				bg : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-bg"});
				},
			},
			componentSync : false,
			flowType : "row",
			theme : {
				dir : "http://dev.h9works.com/riff/newriff_mirror/branches/plugin_themeBasic",
				name : "src"
			},
			comps : [],
			displayComps : [],
		},
		master : {
			className : {
				full : "rf-master-full",
				idle : "rf-master-idle",
				header : "rf-master-header",
				scene : "rf-master-scene",
				datareceivetime : "rf-master-datareceivetime",
				softkey : "rf-master-softkey"
			},
			visibility : "visible"
		}
	}
});


//Theme
if (riff.widget && riff.widget.global && riff.widget.global.theme && riff.widget.global.theme.name) {

	(function() { 
		function loadTheme( ) {
			return riff.widget.global.theme.dir + "/" + riff.widget.global.theme.name + "/";
		};
		
		var head = document.getElementsByTagName("head")[0];
		var tScriptJs = document.createElement("script");
		tScriptJs.type = "javascript";
		tScriptJs.src = loadTheme() + "ui.js";
		head.insertBefore(tScriptJs);
		
		var tLinkCss = document.createElement("link");
		tLinkCss.rel = "stylesheet";
		tLinkCss.type = "text/css"
		tLinkCss.href = loadTheme() + "ui.css";
		head.insertBefore(tLinkCss);
	})();
}

