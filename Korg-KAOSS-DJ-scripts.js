function KAOSSDJ() {};

KAOSSDJ();

KAOSSDJ.deck = function(decknum) {
    this.decknum = decknum;
    this.group = "[Channel" + decknum + "]";
    this.loaded = false;
    this.jogWheelsInScratchMode = false;
    this.PADMode = false; //false = not pressed; true = pressed
    this.shiftKey = false;
    this.touch = false;

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
    var deckno = channel - 6
    print ('Deck num: ' + deckno);

    if (value === 0X7F) {
        engine.scratchEnable(deckno, 128, 33+1/3, alpha, beta);
    };    //
    if (value === 0x00) {
        engine.scratchDisable(deckno);
    };
};


KAOSSDJ.wheelTurn = function (channel, control, value, status, group) {
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
