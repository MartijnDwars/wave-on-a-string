/**
 * Copyright 2002-2013, University of Colorado
 * start object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  // var Line = require( 'SCENERY/nodes/Line' );
  // var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  // var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Constants = require( 'WOAS/Constants' );

  var wrenchImage = require( 'image!WOAS/wrench_3.svg' );
  var oscillatorWheelImage = require( 'image!WOAS/oscillator_wheel.png' );

  function StartNode( model, events, options ) {
    options = _.extend( { layerSplit: true }, options );

    var postNodeHeight = 158;
    var postScale = 3;

    Node.call( this );
    var thisNode = this;

    var wheel = new Node( { children: [ new Image( oscillatorWheelImage, {
      scale: 0.4,
      center: Vector2.ZERO
    } ) ] } );
    wheel.addChild( new Circle( 29.4, { stroke: '#333', lineWidth: 1.4 } ) );

    // var wheelRadius = 29.5;
    // var wheel = new Circle( wheelRadius, {
    //   stroke: '#333',
    //   lineWidth: 1.5,
    //   fill: new LinearGradient( -wheelRadius, 0, wheelRadius, 0 ).addColorStop( 0, 'rgb(200,186,186)' ).addColorStop( 1, 'rgb(230,230,230)' )
    // } );

    // var innerWheelRadius = 4.8;
    // wheel.addChild( new Circle( innerWheelRadius, {
    //   stroke: '#333',
    //   lineWidth: 1.5,
    //   fill: '#fff'
    // } ) );
    // wheel.addChild( new Line( -innerWheelRadius, 0, innerWheelRadius, 0, { stroke: '#333', lineWidth: 1.5 } ) );
    // wheel.addChild( new Circle( innerWheelRadius, {
    //   x: innerWheelRadius * 1.5 - wheelRadius,
    //   stroke: '#333',
    //   lineWidth: 0.5,
    //   fill: new RadialGradient( 0, 0, 0, 0, 0, innerWheelRadius ).addColorStop( 0.2, '#eee' ).addColorStop( 1, 'rgb(110,50,25)' )
    // } ) );

    var key = new Node( {children: [new Image( wrenchImage, {x: -40, y: -25, scale: 0.9, pickable: false} )], cursor: 'pointer'} );
    var post = new Rectangle( Constants.offsetWheel.x - 5, 0, 10, postNodeHeight, {
      stroke: '#000',
      fill: Constants.postGradient
    } );

    // cache the post as an image, since otherwise with the current Scenery its gradient is updated every frame in the defs (NOTE: remove this with Scenery 0.2?)
    var postCache = new Node( { scale: 1 / postScale } );
    new Node( { children: [post], scale: postScale } ).toImageNodeAsynchronous( function( image ) {
      postCache.addChild( image );
    } );
    post = new Node( { children: [postCache] } );

    thisNode.addChild( key );
    thisNode.addChild( post );
    thisNode.addChild( new Node( {children: [wheel], translation: Constants.offsetWheel} ) );

    key.touchArea = Shape.bounds( key.bounds.dilated( Constants.dilatedTouchArea ) );
    key.mouseArea = Shape.bounds( key.bounds );

    key.addInputListener( Constants.dragAndDropHandler( key, function( point ) {
      model.nextLeftY = Math.max( Math.min( point.y, options.range.max ), options.range.min );
      model.play = true;
      model.trigger( 'yNowChanged' );
    } ) );

    thisNode.mutate( options );
    function updateKey() {
      if ( key.isVisible() ) {
        key.y = model.yNow[0];
      }
    }

    function updatePost() {
      var y = model.yNow[0];
      if ( post.isVisible() ) {
        // TODO: reduce garbage allocation here
        post.setMatrix( Matrix3.createFromPool( 1, 0, 0,
          0, ( Constants.offsetWheel.y - (y + 7) ) / postNodeHeight, y + 7,
          0, 0, 1 ) );
      }
    }

    var dirty = true;
    model.on( 'yNowChanged', function() { dirty = true; } );
    events.on( 'frame', function() {
      if ( dirty ) {
        updateKey();
        updatePost();
        dirty = false;
      }
    } );

    // workaround for image not being perfectly centered
    // wheel.addChild( new Circle( 29.4, { stroke: '#333', lineWidth: 1.4 } ) );

    model.angleProperty.link( function updateWheel( value ) {
      // wheel.rotation = value;
      wheel.setMatrix( Matrix3.rotation2( value ) ); // doesn't need to compute current transform, or do matrix multiplication
    } );
    model.modeProperty.link( function updateVisible( value ) {
      var keyIsVisible = value === 'manual';
      if ( key.isVisible() !== keyIsVisible ) {
        key.setVisible( keyIsVisible );

        updateKey();
      }

      if ( post.isVisible() === keyIsVisible ) {
        wheel.setVisible( !keyIsVisible );
        post.setVisible( !keyIsVisible );

        updatePost();
      }
    } );
  }

  inherit( Node, StartNode );
  return StartNode;
} );
