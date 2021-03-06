// Copyright 2013-2018, University of Colorado Boulder

/**
 * buttons and model control elements view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Slider = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/slider/Slider' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // strings
  var amplitudeString = require( 'string!WAVE_ON_A_STRING/amplitude' );
  var dampingString = require( 'string!WAVE_ON_A_STRING/damping' );
  var frequencyString = require( 'string!WAVE_ON_A_STRING/frequency' );
  var highString = require( 'string!WAVE_ON_A_STRING/high' );
  var lowString = require( 'string!WAVE_ON_A_STRING/low' );
  var patternValueUnitCmString = require( 'string!WAVE_ON_A_STRING/patternValueUnitCm' );
  var patternValueUnitHzString = require( 'string!WAVE_ON_A_STRING/patternValueUnitHz' );
  var patternValueUnitPercentageString = require( 'string!WAVE_ON_A_STRING/patternValueUnitPercentage' );
  var patternValueUnitSString = require( 'string!WAVE_ON_A_STRING/patternValueUnitS' );
  var pulseWidthString = require( 'string!WAVE_ON_A_STRING/pulseWidth' );
  var referenceLineString = require( 'string!WAVE_ON_A_STRING/referenceLine' );
  var rulersString = require( 'string!WAVE_ON_A_STRING/rulers' );
  var tensionString = require( 'string!WAVE_ON_A_STRING/tension' );
  var timerString = require( 'string!WAVE_ON_A_STRING/timer' );

  var OFFSET = 35;

  function BottomControlPanel( model ) {

    Node.call( this, { scale: 0.7 } );

    var checkboxTextOptions = {
      font: new PhetFont( 15 ),
      maxWidth: 130
    };
    var checkboxGroup = new VerticalCheckboxGroup( [ {
      node: new Text( rulersString, checkboxTextOptions ),
      property: model.rulersProperty
    }, {
      node: new Text( timerString, checkboxTextOptions ),
      property: model.timerProperty
    }, {
      node: new Text( referenceLineString, checkboxTextOptions ),
      property: model.referenceLineProperty
    } ] );

    var separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    separator.right = checkboxGroup.left - 20;
    checkboxGroup.centerY = separator.centerY;

    var tensionSlider = new Slider( {
      title: tensionString,
      property: model.tensionProperty,
      round: false,
      range: Constants.tensionRange,
      titleVerticalOffset: 15,
      tick: { step: 0.25, minText: lowString, maxText: highString },
      constrainValue: function( value ) {
        // logic to round the value to nearest .25 to have snap behaviour
        value = Util.toFixedNumber( value, 2 );
        value = value * 100;
        value = Util.roundSymmetric( value / 25 ) * 25;
        value = value / 100;
        return value;
      }
    } );

    tensionSlider.right = separator.left - 20;

    var dampingSlider = new Slider( {
      title: dampingString,
      type: 'button',
      buttonStep: 1,
      property: model.dampingProperty,
      patternValueUnit: patternValueUnitPercentageString,
      roundingDigits: 0,
      range: Constants.dampingRange
    } );

    dampingSlider.right = tensionSlider.left - OFFSET;

    var frequencySlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: frequencyString,
      property: model.frequencyProperty,
      patternValueUnit: patternValueUnitHzString,
      roundingDigits: 2,
      range: Constants.frequencyRange
    } );

    frequencySlider.right = dampingSlider.left - OFFSET;

    var pulseWidthSlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: pulseWidthString,
      property: model.pulseWidthProperty,
      patternValueUnit: patternValueUnitSString,
      roundingDigits: 2,
      range: Constants.pulseWidthRange
    } );

    pulseWidthSlider.right = dampingSlider.left - OFFSET;

    var amplitudeSlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: amplitudeString,
      property: model.amplitudeProperty,
      patternValueUnit: patternValueUnitCmString,
      roundingDigits: 2,
      range: Constants.amplitudeRange
    } );

    amplitudeSlider.right = frequencySlider.left - OFFSET;


    var oscillatePanel = new Panel( new Node( {
      children: [ amplitudeSlider, frequencySlider, dampingSlider, tensionSlider, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( oscillatePanel );

    var manualPanel = new Panel( new Node( {
      children: [ dampingSlider, tensionSlider, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( manualPanel );

    var pulsePanel = new Panel( new Node( {
      children: [ amplitudeSlider, pulseWidthSlider, dampingSlider, tensionSlider, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( pulsePanel );

    oscillatePanel.right = manualPanel.right;
    pulsePanel.right = manualPanel.right;
    model.modeProperty.link( function updateBottomControlPanel( value ) {
      oscillatePanel.setVisible( value === 'oscillate' );
      manualPanel.setVisible( value === 'manual' );
      pulsePanel.setVisible( value === 'pulse' );
    } );
  }

  waveOnAString.register( 'BottomControlPanel', BottomControlPanel );

  inherit( Node, BottomControlPanel );

  return BottomControlPanel;
} );
