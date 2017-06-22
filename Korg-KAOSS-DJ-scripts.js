function KAOSSDJ() {};

// LEDs all first bytes between 0x80 and 0xEF


KAOSSDJ.init = function (id, debugging) {
    // turn on all LEDs
    for (var i = 0x00; i <= 0xFF; i++) {
        for(var n = 0xB6; n <= 0xB8; n++) {
            midi.sendShortMsg(n, i, 0x7F);
      };
    };
};

KAOSSDJ.shutdown = function (id, debugging) {
  // turn on all LEDs
  for (var i = 0x00; i <= 0xFF; i++) {
    for(var n = 0xB6; n <= 0xB8; n++) {
      midi.sendShortMsg(n, i, 0x00);
    };
  };
};



KAOSSDJ();

var leds_channel = {
  'buttons-right': 0x98,
  'buttons-left': 0x97,
  'knobs-right': 0xB8,
  'knobs-left': 0xB7,
  'master': 0xB6
};

var leds = {
  'cue': 0x1E,
  'sync': 0x1D,
  'play': 0x1B,
  'headphones': 0x19,
  'fx': 0x18, //warning something up with this
  'strip_three': 0x17,
  'strip_one': 0x15,
};


KAOSSDJ.deck = function(decknum) {
  this.decknum = decknum;
  this.group = "[Channel" + decknum + "]";
  this.loaded = false;
  this.jogWheelsInScratchMode = false;
  this.shiftKey = false;
  this.touch = false;
};


KAOSSDJ.decks = {}
// Initialise the 4 deck objects and their properties
for (var i = 1; i <= 4; i++) {
  KAOSSDJ.decks['D' + i] = new KAOSSDJ.deck(i);
}


KAOSSDJ.getDeckByChannel = function(channel){
  var deckno = channel - 6;
  return KAOSSDJ.decks['D' + deckno];
};

 KAOSSDJ.updateDeckByChannel = function(channel, key, value){
   var deckno = channel - 6;
   KAOSSDJ.decks['D' + deckno][key] = value;
 };

KAOSSDJ.currentDeck = function(channel){
 script.midiDebug(channel);
 var chann = (channel - 6);
 print(chann);
 return chann;
};

KAOSSDJ.wheelTouch = function (channel, control, value, status, group) {
  var alpha = 1.0/8;
  var beta = alpha/32;

  var deck_info = KAOSSDJ.getDeckByChannel(channel);
  var deckno = deck_info.decknum;

  if (deck_info.jogWheelsInScratchMode) {
    if (value === 0X7F) {
        engine.scratchEnable(deckno, 128, 33+1/3, alpha, beta);
    }    //
    else if (value === 0x00) {
        engine.scratchDisable(deckno);
    };
  }
};


KAOSSDJ.wheelTurn = function (channel, control, value, status, group) {
  print(channel);
  var deckno = channel - 6;
  if (value < 64) {
    newValue = value;
  } else {
    newValue = value - 128;
  }
  if (engine.isScratching(deckno)) {
    engine.scratchTick(deckno, newValue); // Scratch!
  } else {
    engine.setValue('[Channel'+deckno+']', 'jog', newValue); // Pitch bend
  }
};

KAOSSDJ.scratchMode = function(channel, control, value, status, group) {

  if (value == 0x7F) {
    print('Entering scratch mode')
    KAOSSDJ.updateDeckByChannel(channel, 'jogWheelsInScratchMode', true);
  }
  else if (value == 0x00) {
    KAOSSDJ.updateDeckByChannel(channel, 'jogWheelsInScratchMode', false);
  }
}
