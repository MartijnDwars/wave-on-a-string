// Copyright 2013-2018, University of Colorado Boulder

/**
 * the Strings node view
 *
 * Author: Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );

  /**
   * @constructor
   * @param {WOASModel} model
   * @param {frameEmitter} frame - emits an event when the animation frame changes
   * @param {Object} [options]
   */
  function TheStringNode( model, frameEmitter, options ) {
    Node.call( this, { layerSplit: true } );
    var theStringShape = new Shape();
    var theStringPath = new Path( theStringShape, {
      stroke: '#F00'
    } );
    var theString = [];
    this.addChild( theStringPath );

    theStringPath.computeShapeBounds = function() {
      return this.getShape().bounds.dilated( 20 ); // miterLimit should cut off with the normal stroke before this
    };

    var highlightCircle = new Circle( options.radius * 0.3, { fill: '#fff', x: -0.45 * options.radius, y: -0.45 * options.radius } );
    var scale = 3;
    var redBead = new Rectangle( -5, -2, 10, 4, { fill: 'black', scale: scale } );
    var limeBead = new Circle( options.radius, { fill: 'lime', stroke: 'black', lineWidth: 0.5, children: [ highlightCircle ], scale: scale } );

    var redNode;
    redBead.toDataURL( function( url, x, y ) {
      redNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    var limeNode;
    limeBead.toDataURL( function( url, x, y ) {
      limeNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    for ( var i = 0; i < model.yDraw.length; i++ ) {
      // var bead = ( i % 10 === 0 ) ? limeNode : redNode;
      theString.push( new Node( { x: i * options.radius * 2, children: [ redNode ] } ) );
    }
    theString[ 0 ].scale( 1.2 );
    this.addChild( new Node( { children: theString } ) );

    this.mutate( options );

    function updateTheString() {
      theStringShape = new Shape(); // ???
      theString[ 0 ].y = model.nextLeftY;
      theStringShape.lineTo( 0, model.nextLeftY || 0 ); // ??
      for ( var i = 1; i < model.yDraw.length; i++ ) {
        var y = model.yDraw[ i ] * Constants.hoekVerdraaingSchaal;
        var py = Math.sin(y);
        var px = Math.cos(y);

        if (px < 0) {
          theString[ i ].y = -1000;
        } else {
          theString[ i ].y = py * Constants.tekenSchaalY;
        }

        //theString[ i ].y = model.yDraw[ i ];
      }
      theStringPath.shape = theStringShape; // ???
    }

    var dirty = true;
    model.yNowChanged.addListener( function() { dirty = true; } );
    frameEmitter.addListener( function() {
      if ( dirty ) {
        updateTheString();
        dirty = false;
      }
    } );
  }

  waveOnAString.register( 'TheStringNode', TheStringNode );

  inherit( Node, TheStringNode );

  return TheStringNode;
} );
