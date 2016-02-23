var GameLayer = cc.Layer.extend({
  ctor: function(){
    this._super();
    this.init();
  },
  field: {
    cells: [],
    position: {left: 80, bottom: 5},
    size: {width: 10, height: 20},
    brickSize: 24,
    brickScale: 0.36,
    fallen: []
  },
  score: 0,
  scoreLabel: null,
  isActive: true,
  speed: 1000,
  init: function(){
    this._super();
    var size = cc.director.getWinSize();

    this.scoreLabel = cc.LabelTTF.create('score: ' + this.score, "Arial", 16);
    this.scoreLabel.setPosition(this.field.position.left + (this.field.size.width * this.field.brickSize) + 250, 400);
    this.scoreLabel.setColor(cc.color(255,0,0));
    this.addChild(this.scoreLabel, 1);

    var infoLabel = cc.LabelTTF.create('controls: keyboard arrows', "Arial", 16);
    infoLabel.setPosition(this.field.position.left + (this.field.size.width * this.field.brickSize) + 250, 300);
    infoLabel.setColor(cc.color(30,30,30));
    this.addChild(infoLabel, 1);

    this.createField();
    this.initUserControl();
    this.figure = new Figure();
    this.figure.moveOnStart();
    this.startGame();
  },
  createField: function(){
    for (var h = this.field.size.height; h > 0; h--) {
      var fieldRow = [];
      for (var w = this.field.size.width; w > 0; w--) {
        var sprite = cc.Sprite.create("img/brick.png");
        var left =  w * this.field.brickSize + this.field.position.left;
        var bottom =  h * this.field.brickSize + this.field.position.bottom;
        sprite.setPosition(left, bottom);
        sprite.setScale(this.field.brickScale);
        sprite.setOpacity(20);
        this.addChild(sprite, 1);
        fieldRow.unshift(sprite);
      };
      this.field.cells.push(fieldRow);
    };
  },
  initUserControl: function(){
    var self = this;

    if ('mouse' in cc.sys.capabilities){
      var self = this;
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseDown: function(event){
          if(self.isActive == false) return;
          self.drawFigure(false);
          self.figure.rotateCurrent();
          if(!self.checkFigureFree()){
            self.figure.rotateCurrentBack();
          } 
          self.drawFigure(true);
        }
      },this);
    }

    // к сожалению, метод кокоса cc.EventListener.KEYBOARD не работает 
    window.onkeydown = function(event){
      self.keyPress(event);
    }

  },
  keyPress: function(e){
    this.drawFigure(false);
    if (e.keyCode == 84){
      this.stopGame();
      this.figure.moveOnStart();
      this.startGame();
    }
    if(this.isActive == false){
      this.drawFigure(true);
      return;
    }
    if (e.keyCode == 38){
      this.figure.rotateCurrent();
      if(!this.checkFigureFree()){
        this.figure.rotateCurrentBack();
      }
    }
    if (e.keyCode == 40){
      this.figure.moveDown();
      if(!this.checkFigureFree()){
        this.figure.moveUp();
      }
    }

    if (e.keyCode == 37){
      this.figure.moveRight();
      if(!this.checkFigureFree()){
        this.figure.moveLeft();
      }
    }

    if (e.keyCode == 39){
      this.figure.moveLeft();
      if(!this.checkFigureFree()){
        this.figure.moveRight();
      }
    }
    this.drawFigure(true);
  },
  startGame: function(){
    var self = this;
    this.speed = 1000;
    this.ticker = setInterval(function(){ self.figureFall() }, this.speed);

    this.drawFallen(false);
    this.drawFigure(false);
    this.field.fallen = [];
    this.score = 0;
    this.scoreLabel.setString('score: ' + this.score);
    this.isActive = true;
  },
  stopGame: function(){
    var self = this;
    clearInterval(this.ticker);
    this.scoreLabel.setString('score: ' + this.score + '/ game over / press T to restart');
    this.isActive = false;
  },
  speedUp: function(){
    var self = this;
    clearInterval(this.ticker);
    this.speed -= parseInt(this.speed/10, 10);
    this.ticker = setInterval(function(){ self.figureFall() }, this.speed);
  },
  figureFall: function(){
    this.drawFigure(false);
    this.figure.moveDown();
    if(!this.checkFigureFree()){
      this.figure.moveUp();
      this.addFigureToFallen();
      this.figure.moveOnStart();
      if(!this.checkFigureFree()){
        this.stopGame();
      }
      this.cleanRows();
    }
    this.drawFigure(true);
  },
  drawFigure: function(booleanShow){
    var figureBricks = this.figure.presenter();
    var top, left;
    for(var brick in figureBricks){
      top = this.figure.current.position.top + figureBricks[brick].top;
      left = this.figure.current.position.left + figureBricks[brick].left;
      this.field.cells[top][left].setOpacity(booleanShow?200:20);
    };
  },
  drawFallen: function(booleanShow){
    var top, left;
    for(var fallenBrick in this.field.fallen){
      top = this.field.fallen[fallenBrick].top;
      left = this.field.fallen[fallenBrick].left;
      this.field.cells[top][left].setOpacity(booleanShow?200:20);
    };
  },
  addFigureToFallen: function(){
    var figureBricks = this.figure.presenter();
    for(var brick in figureBricks){
      this.field.fallen.push(
        {
          top: this.figure.current.position.top + figureBricks[brick].top,
          left: this.figure.current.position.left + figureBricks[brick].left
        });
    };
  },
  checkFigureFree: function(){
    var figureBricks = this.figure.presenter();
    var brickTop = 0;
    var brickLeft = 0;
    for(var brick in figureBricks){
      brickTop = this.figure.current.position.top + figureBricks[brick].top;
      brickLeft = this.figure.current.position.left + figureBricks[brick].left;
      if (brickLeft < 0 || brickLeft >= this.field.size.width){
        return false;
      };
      if (brickTop == this.field.size.height){
        return false;
      };
      for(var fallenBrick in this.field.fallen){
        if( brickTop == this.field.fallen[fallenBrick].top && brickLeft == this.field.fallen[fallenBrick].left ){
          return false;
        }
      };
    };
    return true;
  },

  cleanRows: function(){
    this.drawFallen(false);
    for(var h = this.field.size.height - 1; h >= 0; h--){
      var bricksInRow = 0;
      for(var fallenBrick in this.field.fallen){
        if(this.field.fallen[fallenBrick].top == h){
          bricksInRow++;
        }
      };
      if(bricksInRow == this.field.size.width){
        var newFallen = this.field.fallen.filter(function(brick){
          if(brick.top == h){
            return false;
          }
          return true;
        });
        this.field.fallen = newFallen;
        for(var fallenBrick in this.field.fallen){
          if(this.field.fallen[fallenBrick].top < h){
            this.field.fallen[fallenBrick].top++;
          }
        };
        this.score++;
        this.scoreLabel.setString('score: ' + this.score);
        this.speedUp();
        // раз мы сдвинули все на один шаг вниз
        // эту линию надо снова проверить
        h++;
      };
    };
    this.drawFallen(true);
  },

  onEnter: function(){
    this._super();
  }
});

GameLayer.scene = function(){
  var scene = new cc.Scene();
  var layer = new GameLayer();
  scene.addChild(layer);
  return scene;
}

window.onload = function(){
  cc.game.onStart = function(){
      cc.LoaderScene.preload(["img/brick.png"], function () {
          cc.director.runScene(GameLayer.scene());
           cc.director.setDisplayStats(false);
      }, this);
  };
  cc.game.run("gameCanvas");
};