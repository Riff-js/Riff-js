// riff.data.js
// version : v0.0.1
// revision : 693

riff.extend(
{
	data : {
		//n @_elm {Array} an array of DOM nodes
		increaseBufferIdx : function ( _el ) {
			_el.bufferIdx = riff.global.bufferIdx++;
			return _el.bufferIdx;
		},
		//n @_elm {Array} an array of DOM nodes
		buffer : function ( _elm, _key, _value ) {

			_elm = riff.elmCheck(_elm);

			if( arguments.length == 3) {				//n set mode
				function tFnSetMode ( _el ) {
					if( _el.bufferIdx ) {
						riff.global.buffer[ _el.bufferIdx ][_key] = _value;
					} else {
						tBufferID = riff.data.increaseBufferIdx( _el );
						riff.global.buffer[ tBufferID ] = {};
						riff.global.buffer[ tBufferID][_key] = _value;
					}
				};
				_elm.forEach( tFnSetMode );
				return _elm;
			} else if( arguments.length == 2) {			//n get mode
				if( _elm[0] && _elm[0].bufferIdx ) {
					if ( _elm[0].bufferIdx ) return riff.global.buffer[ _elm[0].bufferIdx ][ _key ];
				}
				return "";
			}
		},
		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_el {Node} DOM Elements.NOT ARRAY.
		deleteBufferSingle : function( _el ) {
			if( _el.bufferIdx ) {
				delete riff.global.buffer[ _el.bufferIdx ];
				riff.global.buffer[ _el.bufferIdx ] = null;
				_el.bufferIdx = null;
			};

			var tChildNodes = _el.childNodes;
			for( var k in tChildNodes ) {
				if( tChildNodes[k].nodeType == 1 ) {
					riff.data.deleteNodesBufferSingle( tChildNodes[k] );
				}
			}
			tChildNodes = null;
			return _el;
		},

		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_elm { queryString } CSS QueryString .
		//n @_elm { Array of NodeList } DOM Elements. ARRAY.
		deleteBuffer : function( _elm ) {
			_elm = riff.elmCheck( _elm );
			function tFn ( _el ) {
				riff.data.deleteBufferSingle( _el );
			}
			_elm.forEach( tFn );
			return _elm;
		}
	}
});


