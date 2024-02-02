class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
        // don't put variables here, usually
        // this is instantiated ONCE! variables can get overwritten
    }

    init() {
        // useful variables
        // we usually define our constants here
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        // there's no gravity, just forces, bounce, and drag
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4) 
        this.cup.body.setOffset(this.cup.width/4) 
        this.cup.body.setImmovable(true) // when colliding with another obj, it doesn't move
        
        // add ball
        this.ball = this.physics.add.sprite(width/2, height-height/10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)   // medium bounce
        this.ball.body.setDamping(true).setDrag(0.5) // damping makes angular velocity slightly more accurate

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall')
        wallA.setX(Phaser.Math.Between(0+wallA.width/2, width-wallA.width/2))
        wallA.body.setImmovable(true)
        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0+wallB.width/2, width-wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])


        // add one-way
        this.oneway = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneway.setX(Phaser.Math.Between(0+this.oneway.width/2, width-this.oneway.width/2))
        this.oneway.body.setImmovable(true)
        this.oneway.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => { // pointerdown = click event
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X)) // between is inclusive
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })

        // cup/ball collision
        // use collider so we don't have to set colliable and set check collide update
        // collider = an event that happens is something that when things collide NOT THE COLLISION BOX
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => { // the two objects are automatically passed in
            ball.setVelocity(0)
            ball.x = width/2
            ball.y = height-height/10
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)
        // if you make a callback, it'll give you the ball and the specific wall it hit

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneway)
    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/