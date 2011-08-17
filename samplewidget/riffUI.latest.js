// Include riffjs files in <head> tag.
var dir = "../riffUI/src/";
var files = [
	"riff.widget.js",	
	"riff.ui.global.js",
	"riff.component.js",
	"riff.component.list.js",
	"riff.component.menu.js",
	"riff.component.header.js",
	"riff.component.softkey.js",
	"riff.component.container.js",
	"riff.component.modal.js",
	"riff.component.btn.js",
	"riff.component.idle.js",
	"riff.component.subinfo.js",
	"riff.flow.js",
	"riff.master.js",
	"riff.master.basics.js",
	"riff.util.js"
];

//theme
//document.write("<script type='text/javascript' language='javascript' src='../riffUI/src/riff.widget.js'></script>");
document.write("<script type='text/javascript' language='javascript' src='theme/basic/global.js'></script>");
document.write("<link rel='stylesheet' type='text/css' href='theme/basic/ui.css'>");

for ( var i =0; i < files.length ; i++)
{
	document.write("<script type='text/javascript' language='javascript' src='"+dir+files[i]+"'></script>");
}

document.write("<script type='text/javascript' language='javascript' src='theme/basic/ui.js'></script>");

