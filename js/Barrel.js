Barrel.SPEED = 200;
Barrel.ROLLSPEED = Barrel.SPEED/20 ;


function Barrel(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'barrel');
    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('roll', [0, 2, 4], 8, true); // 8fps, looped
    this.animations.play('roll');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    
    this.body.velocity.x = Barrel.SPEED;
    this.ROLLSPEED = Barrel.ROLLSPEED
    console.log(this);
}



// inherit from Phaser.Sprite
Barrel.prototype = Object.create(Phaser.Sprite.prototype);
Barrel.prototype.constructor = Barrel;

Barrel.prototype.changeDirection = function () {
    // check against walls and reverse direction if necessary
  
        this.body.velocity.x *= -1;
       };


Barrel.prototype.update = function () {
    // check against walls and reverse direction if necessary
    
    
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Barrel.SPEED; // turn left        
        this.ROLLSPEED *= -1; 
        console.log("CH")
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Barrel.SPEED; // turn right
        this.ROLLSPEED *= -1;
        console.log("CH")
    }
};

Barrel.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};
