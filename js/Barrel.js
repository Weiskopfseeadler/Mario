Barrel.SPEED = 400;
Barrel.ROLLSPEED = Barrel.SPEED/20 ;


function Barrel(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'barrel');
    // anchor
    this.anchor.set(0.5);
     
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    
    this.body.velocity.x = Barrel.SPEED;
    this.ROLLSPEED = Barrel.ROLLSPEED;
 
}


Barrel.prototype = Object.create(Phaser.Sprite.prototype);
Barrel.prototype.constructor = Barrel;

Barrel.prototype.changeDirection = function () {    
        this.ROLLSPEED*= -1;
        this.body.velocity.x *= -1;
       };


Barrel.prototype.update = function () {
   
     
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Barrel.SPEED;      
        this.ROLLSPEED *= -1; 
       
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Barrel.SPEED; 
        this.ROLLSPEED *= -1;    
    }
};

Barrel.prototype.die = function () {
    this.body.enable = false;
 
     this.kill();
   
};
