
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.animations.add('stop', [16]);
    this.animations.add('run', [9,10, 11], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('climb', [3]);
    this.animations.add('fall', [4]);
    console.log(this.animation);
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.goingRight = true;
Hero.goingLeft = false;
Hero.idleFrame = 0;
Hero.onLadder = false;

Hero.prototype.move = function (direction) {
    const SPEED = 500;
    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 1000;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.climb = function (bool) {
    const CLIMB_SPEED = this.SPEED;
    if(!bool){
        this.body.velocity.y = -CLIMB_SPEED;
    }
    this.body.velocity.y = CLIMB_SPEED;
    
    
}

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    //climbing
    if(this.body.onLadder){
        name='climb'
    }

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

