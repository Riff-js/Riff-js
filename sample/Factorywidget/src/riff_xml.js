//
// RIFFjs TrialVersion 1.0.29 
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

var riffXML = function( _urlStr, _fnSuccess, _theOtherSet )
{

	this.selector = function( _querySelector )
	{
		return riff.xmlSelector( this.xmlLocal, _querySelector );
	};
	
	this.xpathSelector = function( _querySelector )
	{
		return riff.xpath( this.xmlLocal, _querySelector );
	};

	this.xpath = function( _querySelector )
	{
		return riff.xpath( this.xmlLocal, _querySelector );
	};

	this.__setOption = function( target, source )
	{
		target.e = source.e;
		target.a = source.a;
		target.t = source.t;
		target.r = source.r;
		target.timeout = source.timeout;
		target.retry = source.retry;
		target.sendData = source.sendData;
		target.type = source.type;
		target.isAsync = source.isAsync;
		target.contentType = source.contentType;

	};

	this.loadXML = function( _setting )
	{
		var xmlThis = this;
		this.__ajax = new riffAJAX ( _urlStr, function( _xml, _text ) {
			xmlThis.textLocal = _text;
			xmlThis.xmlLocal = _xml;
			_fnSuccess.call( xmlThis, xmlThis, this.xmlLocal, this.textLocal );
		}, _theOtherSet );
	};

	// cunstructor
	{
		this.loadXML( _theOtherSet );
	}
	return true;
}



