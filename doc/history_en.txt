================================================================
Widgetpack 
Copyright 2011, Licensed under the MIT license.
http://innovator.samsungmobile.com/
================================================================

v0.2.2

Requires Riff Version:

	v0.2.2


Included plugin files:

	riff.widget.js
	riff.widget.master.news.js
	riff.component.flow.js
	riff.component.list.js
	riff.component.menu.js

Updated List : new feature, bug fix.

	- Widget global(riff.widget.js) :
		- change variable type : effect.border, effect.bg
		- add new variables : theme, master
	- New feature : Master (riff.widget.master.news.js)
		- add constructor
			- riff.widget.master.news
			- riff.widget.master.news.components
	- Flow(riff.component.flow.js)
		- change variable and function names
			- show() -> visible()
			- hide() -> invisible()
			- componentInit() -> compInit()
			- componentEachFn() -> compFn()
	- List(riff.component.list.js)
		- add variable : bodyId
		- add functions : createItem(), deleteItem()
	- Menu(riff.component.menu.js)
		- add constructor
			- riff.component.menu

----------------------------------------------------------------

v0.2.1


Requires Riff Version:
	
	0.2.1


Included plugin files:

	riff.widget.js

Updated List:

	- Flow(riff.component.flow.js)
		- change variable names : effect(effectObj), effectFlag(effect), markupFlag(markup).
		- Add function: riff.flow.hide().
		- riff.flow.componentInit()
			- Remove the class-appointed function( addClass ).
			- Not execution when there is no makeMarkup() in the component.
	- List(riff.component.list.js)
		- Change variables' name : effect(effectObj), effectFlag(effect), markupFlag(markup)
		- riff.component.list.init() : add the class-appoint-function.
		- fix and improvement the "effect" related code.

----------------------------------------------------------------

v0.2.0


Requires Riff Version:
	
	0.2.0


Included plugin files:

	riff.component.flow.js
	riff.component.list.js (dummy)
	riff.component.tab.js (dummy)


Updated List:

	- Flow
	- Component Structure

----------------------------------------------------------------