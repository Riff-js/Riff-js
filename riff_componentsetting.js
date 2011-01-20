//h ComponentSetting.js 에서는, 주로 DOM Element의 className 값을 보고 그에 맞는 markUp 을 재구성해 준다.

riff(function () {

// Widget Basic Default Setting
//h 사용자가 setTitle component를 사용하지 않았다면, setTitle 을 추가해 준다.( = setTitle Component 는 환경설정 기능을 위해 필요한 component ) 
( riff('body').find('.setTitle').size() == 0 && riff('body').append('<div class="setTitle"></div>') );
//h 사용자가 feedReceiveTime component를 사용하지 않았다면, feedReceiveTime 을 추가해 준다.( = feedReceiveTime Component 는 RSS Feed를 사용할 때, 데이터 수신 시각을 표시하기 위한 component ) 
( riff('body').find('.feedReceiveTime').size() == 0 && riff('body').append('<div class="feedReceiveTime"></div>') );

//h popup등이 화면에 표시될 때, 배경을 막아 다른 곳을 클릭하지 못하게 하기 위한 DIV 추가.
riff('body').append('<div class="blackBlank"></div>'); // Black Blank Element
riff('body').append('<div class="whiteBlank"></div>'); // Black Blank Element

//h widget 실행할 때 보이는 IDLE 화면과, 전체화면을 구분해 주기 위한 markUp 추가.
riff('body').contents().not( riff("#idle").dom() )
			.wrapAll('<div class="widgetWrap"></div>'); // Widget Wrapping
//h Scene을 적용하는 전체 화면에 scene을 한 번 감싸서, 화면 크기 등을 정해준다.
riff('body').find('.scene').wrapAll('<div class="scenes"></div>');

//h Busy Indicator 를 넣어주고, 설정한다.
// Busy Indicator Default Setting
riff('.blackBlank')
.before('<div class="popup" id="busyIndicator"><div class="busyIndicator type1"></div><div class="busyIndicatorTxt">Loading, Please wait...</div></div>')
.before('<div class="popup" id="alert"></div>');

//h navigator.userAgent : 실행되는 브라우저 이름 가져오는 기능.
var agent = navigator.userAgent;
if( agent.indexOf("SHW-M110S") != -1)			// widget mode ?
	riff("title").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1; target-densitydpi=device-dpi"/>');
else if( riff.isWidget() && !riff.isEmulator() )// PC mode ?
	riff("title").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1; target-densitydpi=120"/>');
else 											// SDK mode ?
	riff("title").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1"/>');

//h softkey의 형태/ 기능등을 정의
riff.option( {
	"softkeySetListData" : {
		"OK" : function() {
			var sceneInfo = riffGlobal.sceneStack.pop();
				riffGlobal.sceneStack.push(sceneInfo);

			riff.back();
			riff(sceneInfo[0]).find(".setList").okFunc();
		}
	},
	"softkeySetListFunc" : function() {
		var sceneInfo = riffGlobal.sceneStack.pop(),
			selectData = riffGlobal.setListSelectData,
			setList = riff(sceneInfo[0]).find(".setList"),
			setListDataSet = setList.buffer("ComponentSettingListComponentDataSet");
		riffGlobal.sceneStack.push(sceneInfo);

		for( var k in setListDataSet )
			setList.subSceneSelect(setListDataSet[k].key, "off");
		
		for( var k in selectData )
			setList.subSceneSelect(selectData[k], "on");

		riff.back();
	},
	"eventType" : (riff.isWidget()) ? "touch" : "mouse",
	"softkeyFunc" : function () { riff.back(); },
	"softkeyType" : "type1",
	"softkeyData" : {}
});

//h scene, title, setTitle, list, setList, tab, popup Component 에 대한 markUp 재조정
riff('.scene').makeStructs();
riff('.title').makeStructs();
riff('.setTitle').makeStructs();
riff('.list').makeStructs();
riff('.setList').makeStructs();
riff(".tab").makeStructs();
riff(".popup").makeStructs();

//h 위젯 종료 키
if( riff.isWidget() && !riff.isEmulator() )
{
	widget.addEventListener("widgetendkey",
	function()	{
		riff.move("#idle");
	}, false);
}


//h AutoRefresh 가 설정되어 있다면, autoRefresh 를 보여주자.
if ( riffGlobal.rssAutoRefreshTime > 0 )
{
	riff('.tab').autoRefresh( riffGlobal.rssAutoRefreshTime );
	riff('.list').autoRefresh( riffGlobal.rssAutoRefreshTime );
};

//h idle 화면을 기본으로 보여주자.
riff.move("#idle");

}); //End Load
