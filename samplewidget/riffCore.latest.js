// Include riffjs files in <head> tag.
var dir = "../riffCore/src/"
var files = [
	"riff.js",
	"riff.data.js",
	"riff.event.js",
	"riff.event.tap.js",
	"riff.event.flick.js",
	"riff.event.dragDrop.js",
	"riff.event.doubleTap.js",
	"riff.event.longTap.js",
	"riff.manipulation.js",
	"riff.traversal.js",
	"riff.string.js",
	"riff.language.js",
	"riff.util.js",
	"riff.ajax.js",
	"riff.widget.extend.js"
]

for ( var i =0; i < files.length ; i++)
{
	document.write("<script type='text/javascript' language='javascript' src='"+dir+files[i]+"'></script>");
}

