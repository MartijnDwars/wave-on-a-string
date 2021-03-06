// Copyright 2013-2018, University of Colorado Boulder

/**
 * end object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // images
  var clampImage = require( 'image!WAVE_ON_A_STRING/clamp.png' );
  var ringBackImage = require( 'image!WAVE_ON_A_STRING/ring_back.png' );
  var ringFrontImage = require( 'image!WAVE_ON_A_STRING/ring_front.png' );
  var windowImage = require( 'image!WAVE_ON_A_STRING/window-back.png' );

  /**
   * @constructor
   * @param {WOASModel} model
   * @param {[type]} frameEmitter - emits an event when animation frame changes
   * @param {Object} [options]
   */
  function EndNode( model, frameEmitter, options ) {
    Node.call( this );
    var clamp = new Image( clampImage, { x: -17, y: -31, scale: 0.4 } );
    var ringBack = new Node( { children: [ new Image( ringBackImage, { x: 5, y: -14 / 2, scale: 0.5 } ) ] } );
    let ringFrontImageNode = new Image( ringFrontImage, { x: 4.7, y: 0, scale: 0.5 } );
    var ringFront = new Node( { children: [ ringFrontImageNode ], cursor: 'pointer' } );
    var windowNode = new Image( windowImage, { right: Constants.windowXOffset + Constants.windowShift, centerY: 0, scale: Constants.windowScale } );
    var post = new Rectangle( -5, -130, 10, 260, {
      stroke: '#000',
      fill: Constants.postGradient,
      x: 20
    } );

    ringFront.touchArea = Shape.bounds(ringFrontImageNode.bounds.dilated(Constants.dilatedTouchArea));
    ringFront.mouseArea = Shape.bounds(ringFrontImageNode.bounds);

    this.addChild( clamp );
    this.addChild( ringBack );
    this.addChild( post );
    this.addChild( ringFront );
    this.windowNode = windowNode;

    ringFront.addInputListener(Constants.dragAndDropHandler(ringFront, function (point) {
      console.log("Ring drag to ", point);
      ringBack.y = point.y;
      ringFront.y = point.y;
    }, function endCallback(event, trail) {
      console.log("Ring drop.");
    }, function endCallback(event, trail) {
      console.log("Ring dropped?");
    }));

    this.mutate( options );

    function updateRing() {
      // ringFront.y = ringBack.y = model.yNow[ model.yNow.length - 1 ] || 0;
    }

    var dirty = true;
    model.yNowChanged.addListener( function() { dirty = true; } );
    frameEmitter.addListener( function() {
      if ( dirty ) {
        updateRing();
        dirty = false;
      }
    } );

    model.typeEndProperty.link( function updateVisible( value ) {
      clamp.setVisible( value === 'fixedEnd' );
      ringBack.setVisible( value === 'looseEnd' );
      post.setVisible( value === 'looseEnd' );
      ringFront.setVisible( value === 'looseEnd' );
      windowNode.setVisible( value === 'noEnd' );

      if ( value === 'fixedEnd' ) {
        // when moving to fixed, zero out the very end point
        model.yNow[ model.nSegs - 1 ] = 0;
        model.yDraw[ model.nSegs - 1 ] = 0;

        model.yNowChanged.emit();
      }
    } );

  }

  waveOnAString.register( 'EndNode', EndNode );

  inherit( Node, EndNode );

  return EndNode;
} );
