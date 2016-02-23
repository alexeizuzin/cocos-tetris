var Figure = function(){
  this.isFree = true;
  this.current = {
    figure: null,
    rotation: 0,
    position: {top: 0, left: 4}
  };
  this.moveOnStart = function(){
    var random = parseInt(Math.random() * this.types.length, 10);
    this.current.figure = this.types[random];
    this.current.position.top = 0;
    this.current.position.left = 4;
    this.current.rotation = 0;
  };
  this.presenter = function(){
    return this.current.figure[this.current.rotation];
  }
  this.rotateCurrent = function(){
    this.current.rotation++;
    if(this.current.rotation == this.current.figure.length){
      this.current.rotation = 0;
    }
  }
  this.rotateCurrentBack = function(){
    this.current.rotation--;
    if(this.current.rotation < 0){
      this.current.rotation = this.current.figure.length - 1;
    }
  }
  this.moveDown = function(){
    this.current.position.top++;
  }
  this.moveUp = function(){
    this.current.position.top--;
  }
  this.moveLeft = function(){
    this.current.position.left++;
  }
  this.moveRight = function(){
    this.current.position.left--;
  }
};

Figure.prototype = {
  types: [
    // S 
    [
      [{top: 0, left: 0}, {top: 1, left: 0}, {top: 1, left: 1}, {top: 2, left: 1}],
      [{top: 1, left: 0}, {top: 1, left: 1}, {top: 0, left: 1}, {top: 0, left: 2}]
    ],
    // Z
    [
      [{top: 0, left: 0}, {top: 0, left: 1}, {top: 1, left: 1}, {top: 1, left: 2}],
      [{top: 0, left: 1}, {top: 1, left: 1}, {top: 1, left: 0}, {top: 2, left: 0}]
    ],
    // O
    [
      [{top: 0, left: 0}, {top: 0, left: 1}, {top: 1, left: 1}, {top: 1, left: 0}]
    ],
    // I
    [
      [{top: 0, left: 1}, {top: 1, left: 1}, {top: 2, left: 1}, {top: 3, left: 1}],
      [{top: 1, left: 0}, {top: 1, left: 1}, {top: 1, left: 2}, {top: 1, left: 3}]
    ],
    // T
    [
      [{top: 1, left: 0}, {top: 1, left: 1}, {top: 0, left: 1}, {top: 1, left: 2}],
      [{top: 0, left: 1}, {top: 1, left: 1}, {top: 1, left: 2}, {top: 2, left: 1}],
      [{top: 1, left: 0}, {top: 1, left: 1}, {top: 2, left: 1}, {top: 1, left: 2}],
      [{top: 0, left: 1}, {top: 1, left: 1}, {top: 1, left: 0}, {top: 2, left: 1}]
    ],
    // J
    [
      [{top: 0, left: 2}, {top: 0, left: 1}, {top: 1, left: 1}, {top: 2, left: 1}],
      [{top: 1, left: 0}, {top: 1, left: 1}, {top: 1, left: 2}, {top: 2, left: 2}],
      [{top: 0, left: 1}, {top: 1, left: 1}, {top: 2, left: 1}, {top: 2, left: 0}],
      [{top: 0, left: 0}, {top: 1, left: 0}, {top: 1, left: 1}, {top: 1, left: 2}]
    ],
    // L
    [
      [{top: 0, left: 0}, {top: 0, left: 1}, {top: 1, left: 1}, {top: 2, left: 1}],
      [{top: 1, left: 0}, {top: 1, left: 1}, {top: 1, left: 2}, {top: 0, left: 2}],
      [{top: 0, left: 1}, {top: 1, left: 1}, {top: 2, left: 1}, {top: 2, left: 2}],
      [{top: 2, left: 0}, {top: 1, left: 0}, {top: 1, left: 1}, {top: 1, left: 2}]
    ]
  ]
}