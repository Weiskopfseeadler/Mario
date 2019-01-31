

PlayState = {};

const LEVEL_COUNT = 3;

PlayState.timer;

PlayState.init = function (data) {
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);

    
    this.hasKey = false;
    this.level = (data.level || 0) % LEVEL_COUNT;
};



PlayState.preload = function () {

    this.game.load.json('level:0', 'data/level03.json');
    this.game.load.json('level:2', 'data/level00.json');	    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.json('level:1', 'data/level01.json');	    this.game.load.json('level:2', 'data/level00.json');


    this.game.load.image('font:numbers', 'images/numbers.png');

    this.game.load.image('background', 'images/pixel-castle-background.png');
    this.game.load.image('dk', 'images/DoKo.png');

    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('icon:coin', 'images/coin_icon.png');

    this.game.load.image('row','images/platform.png',1,1);
    this.game.load.image('ladder','images/Ladder.png');
    this.game.load.image('barrel','images/Barrel.png');
    this.game.load.image('flag','images/FinishFlag.png');

    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);

    this.game.load.spritesheet('hero', 'images/MarioWalk.png', 47, 64);
    this.game.load.spritesheet('door', 'images/door.png', 65, 50);


    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    
    this.game.load.audio('sfx:door', 'audio/door.wav');
};

PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        key: this.game.add.audio('sfx:key'),
        door: this.game.add.audio('sfx:door')
    };

    // create level
    this.game.add.image(0, 0, 'background');
    this.game.add.image(500, 20, 'dk');
    //this.game.add.image(20, 18, 'barrels');
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
};

PlayState.update = function () {
    this.barrels.forEach(element => {
        element.angle+=element.ROLLSPEED;
    });
    this._handleCollisions();
    this._handleInput();
};

PlayState._handleCollisions = function () {
    //this.game.physics.arcade.collide(this.barrels, this.platforms);
    //this.game.physics.arcade.collide(this.barrels, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);

    this.game.physics.arcade.collide(this.barrels, this.platforms);
    this.game.physics.arcade.collide(this.barrels, this.enemyWalls);
    this.game.physics.arcade.overlap(this.hero, this.Flag, this._onHeroVsFinishFlag,
        null, this);


    this.game.physics.arcade.overlap(this.hero, this.barrels,
        this._onHeroVsEnemy, null, this);

};


PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.barrels = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.Barrelspawns = this.game.add.group();
    this.ladders = this.game.add.group();

    this.Flag = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn all platforms
    
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero});
    this._spawnBarrels({barrels: data.barrels});
    // spawn important objects

    //this._spawnDK(data.DK.x, data.DK.y);
    this._spawnFlag(data.Flag.x, data.Flag.y);
    data.Barrelspawns.forEach(this._barrelspawnspawn,this);
    data.ladders.forEach(this._spawnLadders,this);
   

    // enable gravity
    const GRAVITY = 2400;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnDK = function (x, y) {
    this.DK = this.bgDecoration.create(x, y, 'dk');
    this.DK.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.DK);
    this.DK.body.allowGravity = false;
};
PlayState._spawnFlag = function (x, y) {
    this.Flag = this.bgDecoration.create(x, y, 'flag');
    this.Flag.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.Flag);
    this.Flag.body.allowGravity = false;
};

PlayState._spawnLadders = function (ladder) {
    let sprite = this.ladders.create(
        ladder.x, ladder.y, ladder.image);

    this._spawnEnemyWall(ladder.x, ladder.y, 'left');
    this._spawnEnemyWall(ladder.x + sprite.width, ladder.y, 'right');
};

PlayState._barrelspawnspawn = function(Barelspawn){

   
    this.game.time.events.loop(Barelspawn.rate, this._spawnBarrel, this,Barelspawn);
    

};

t = function() {
    //console.log("Hallo");
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.angle+=platform.rotate;


};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnBarrel = function (barrelspawn) {
    // spawn barrels
       console.log(barrelspawn);
       var sw=true;
    let sprite = new Barrel(this.game, barrelspawn.x, barrelspawn.y);
        switch (barrelspawn.direction) {
            case 1:break;
            case 2: sprite.changeDirection();break;
            case 3: if (sw){
                sprite.changeDirection();
            } ;break;
                
        }    
    
        this.barrels.add(sprite);

   
};

PlayState._spawnBarrels = function (data) {
    // spawn barrels
    
    data.barrels.forEach(function (barrel) {
        let sprite = new Barrel(this.game, barrel.x, barrel.y);
        this.barrels.add(sprite);
    }, this);
};



PlayState._spawnCharacters = function (data) {
    

    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};






PlayState._onHeroVsEnemy = function (hero, enemy) {
    if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
        hero.bounce();
        this.sfx.stomp.play();
    }
    else { // game over -> restart the game
        this.sfx.stomp.play();
        this.game.state.restart(true, false, {level: this.level});
    }
};


PlayState._onHeroVsDoor = function (hero, door) {
    this.sfx.door.play();
    this.game.state.restart(true, false, { level: this.level + 1 });
};

PlayState._onHeroVsFinishFlag = function () {
    //console.log(this.level);
    this.game.state.restart(true, false, { level: this.level + 1 });
};



// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(1200, 890, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play', true, false, {level: 0});
};
