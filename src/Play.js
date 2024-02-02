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

        this.wallB = this.physics.add.sprite(0, height/2, 'wall')
        this.wallB.setX(Phaser.Math.Between(0+this.wallB.width/2, width-this.wallB.width/2))
        this.wallB.body.setImmovable(true)
        // bouncy wall
        this.wallBounce = 1

        this.walls = this.add.group([wallA, this.wallB])


        // add one-way
        this.oneway = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneway.setX(Phaser.Math.Between(0+this.oneway.width/2, width-this.oneway.width/2))
        this.oneway.body.setImmovable(true)
        this.oneway.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => { // pointerdown = click event
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(this.SHOT_VELOCITY_X * shotDirectionX) // between is inclusive
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
            this.shotCounterNum++;
            this.shotCounter.text = `shot counter: ${this.shotCounterNum}`
            this.percentage.text = `succesful shot percentage: ${Math.round(this.scoreNum / this.shotCounterNum * 100, 4)}%`
        })

        // cup/ball collision
        // use collider so we don't have to set colliable and set check collide update
        // collider = an event that happens is something that when things collide NOT THE COLLISION BOX
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => { // the two objects are automatically passed in
            ball.setVelocity(0)
            ball.x = width/2
            ball.y = height-height/10
            this.scoreNum++;
            this.score.text = `score: ${this.scoreNum}`
            this.percentage.text = `succesful shot percentage: ${Math.round(this.scoreNum / this.shotCounterNum * 100, 4)}%`
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)
        // if you make a callback, it'll give you the ball and the specific wall it hit

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneway)

        let textConfig = {
            color: '#FFF',
            fontFamily: 'Courier',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
                left: 10
            },
            fixedWidth: 0
        }
        this.shotCounter = this.add.text(0, 0, 'shot counter: 0', textConfig)
        this.score = this.add.text(0, 15, 'score: 0', textConfig)
        this.percentage = this.add.text(0, 30, 'succesful shot percentage: 0%', textConfig)
        this.shotCounterNum = 0
        this.scoreNum = 0
    }

    update() {
        this.wallB.x += this.wallBounce
        if (this.wallB.x >= width-this.wallB.width/2 || this.wallB.x <= 0+this.wallB.width/2) {
            this.wallBounce *= -1
        }
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/