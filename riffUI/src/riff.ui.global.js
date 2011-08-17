riff.extend({
	ui : {
		global : {
			resizeWork : false,
			msgStoptime : 2000,
			effObj : {
				border : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-border"});
				},
				bg : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-bg"});
				},
				arrLeft : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-arrL"});
				},
				arrRight : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-arrR"});
				},
			},
			objs : {
				allMasters : [],
				allComps : [],
				fixedComps : [],
				master : null,
				comps : [],
				flow : null,
				refreshComps : [],
			},
			component : {
				className : {
					base : "rf-component",
					header : "rf-component-header",
					list : "rf-component-list",
					item : "rf-component-item",
					tab : "rf-component-tab",
					navigation : "rf-component-navigation",
					softkey : "rf-component-softkey",
					subinfo : "rf-component-subinfo",
					softBackkey : "rf-component-softBackkey",
					softBackkeyEle : "rf-component-softBackkey-ele",
					container : "rf-component-container",
					modal : "rf-component-modal",
					button : "rf-component-button",
					textBox : "rf-component-textBox",
					dim : "rf-component-dim",
					btn : "rf-component-btn",
					ordering : "rf-component-ordering",
					orderingList : "rf-component-ordering-list",
					orderingUp : "rf-component-orderingUp",
					orderingDown : "rf-component-orderingDown",
					checkbox : "rf-component-checkbox",
					checklist : "rf-component-checklist",
					selectAll : "rf-component-selectAll",
					radio : "rf-component-radio",
					radioList : "rf-component-radioList",
					idlePrev : "rf-component-idlePrev",
					idleNext : "rf-component-idleNext",
					idleList : "rf-component-idleList",
					idleIndicator : "rf-component-idleIndicator",
				},
			},
			master : {
				className : {
					base : "rf-master",
					basicFull : "rf-master-basicFull",
					basicIdle : "rf-master-basicIdle"					
				},
			},
			exceptionFlag : null,
		}
	}
});
