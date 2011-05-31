riff.extend(
{
	data : {
		getBufferID : function ( _className )
		{
			var tClassName = _className.split( " " ),
				tPrefixIdx;
			for( var k in tClassName )
			{
				tPrefixIdx = tClassName[k].indexOf( riffGlobal.prefixBufferID );
				if ( tClassName[k].indexOf( riffGlobal.prefixBufferID ) > -1 )	 //n if the prefix exists
				{
					return parseInt( tClassName[k].substring( riffGlobal.prefixBufferID.length ) );
				}
			}
			return "";
		},

		//n @_elm {Array} an array of DOM nodes
		buffer : function ( _elm, _key, _value ) {
			if( arguments.length == 3) {				//n set mode
				function tFn ( _el ) {
					var tBufferID = riff.data.getBufferID( _el.className || "" );
					if( tBufferID ) {
						riffGlobal.buffer[ tBufferID ][_key] = _value;
					} else {
						tBufferID = ++riffGlobal.bufferID;
						riffGlobal.buffer[ tBufferID ] = {};
						riffAddClass( [_el], riffGlobal.prefixBufferID + riffGlobal.bufferID );
						riffGlobal.buffer[ tBufferID][_key] = _value;
					}
				};
				_elm.forEach( tFn );

				return true;
			} else if( arguments.length == 2) {			//n get mode
				if( _elm[0] && _elm[0].className ) {
					var tBufferID = riff.data.getBufferID( _elm[0].className || "" );
					if ( tBufferID ) return riffGlobal.buffer[ tBufferID ][_key];
				}
				return "";
			}
		},
		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_el {Node} DOM Elements.NOT ARRAY.
		deleteNodesBufferSingle : function( _el ) {
			function tFn ( _el2 ) {
				var tBufferID = "";
				if( _el2 ) tBufferID = riff.data.bufferFree( _el2.className );
				if( tBufferID ) {
					delete riffGlobal.buffer[ tBufferID ];
					riffGlobal.buffer[ tBufferID ] = null;
				};

				var tChildNodes = _el2.childNodes;
				for( var k in tChildNodes ) {
					if( tChildNodes[k].nodeType == 1 ) {
						deleteNodesBufferSingle( tChildNodes[k] );
					}
				}
				tChildNodes = null;
			}
			_el.forEach( tFn );
			return el;
		},

		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_elm { queryString } CSS QueryString .
		//n @_elm { Array of NodeList } DOM Elements. ARRAY.
		deleteNodesBuffer : function( _elm ) {
			_elm = riff.elmCheck( _elm );
			function tFn ( _el ) {
				deleteNodesBufferSingle( _el );
			}
			_elm.forEach( tFn );
			return _elm;
		}
	}
});
