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

    var lijnen = [];
    var paden = [];
    for (var i = 0; i < Constants.papaLijnKleuren.length; i++) {
      var lijnShape = new Shape();
      var lijnPath = new Path(lijnShape, {stroke: Constants.papaLijnKleuren[i]});
      this.addChild(lijnPath);
      lijnen.push(lijnShape);
      paden.push(lijnPath);
    }

    var theStringShape = new Shape();
    var theStringPath = new Path(theStringShape, {stroke: '#000'});
    this.addChild(theStringPath);

    theStringPath.computeShapeBounds = function() {
      return this.getShape().bounds.dilated( 20 ); // miterLimit should cut off with the normal stroke before this
    };

    this.mutate( options );

    function drawPapaLine(i) {
      theStringShape = new Shape();
      theStringShape.lineTo(0, model.nextLeftY || 0);

      lijnen[i] = new Shape();

      for (var j = 0; j < model.yDraw.length; j++) {
        var y = model.yDraw[ j ] * Constants.hoekVerdraaingSchaal;
        y += i * 2 * Math.PI / Constants.papaLijnKleuren.length;
        var py = Math.sin(y);
        var px = Math.cos(y);

        theStringShape.lineTo( j * options.radius * 2, model.yDraw[ j ] || 0 );

        if (px < 0) {
          lijnen[i].moveTo(j * options.radius * 2, py * Constants.tekenSchaalY);
        } else {
          lijnen[i].lineTo(j * options.radius * 2, py * Constants.tekenSchaalY);
        }
      }

      theStringPath.shape = theStringShape;
      paden[i].shape = lijnen[i];
    }

    function updateTheString() {
      for (var i = 0; i < Constants.papaLijnKleuren.length; i++) {
        drawPapaLine(i);
      }
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
