var config = {
    type: Phaser.AUTO,
    width: 950,
    height: 600,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
var map;
var collideLayer;
var player;
var groundLayer;
var bridgeLayer;

function preload(){
    
    this.load.image('RPGpack', 'assets/RPGpack_sheet.png');
    this.load.image('overworld', 'assets/overworld.png');
    this.load.tilemapTiledJSON('map', 'assets/bbmap.json');

    
    this.load.image('testingmap', 'assets/testSheet.png');
    this.load.image('test2', 'assets/tileSheet1.png');
    this.load.image('player','assets/alienPink.png');

    this.load.image('rain', 'assets/rain.png');
    this.load.image('snow', 'assets/snowflake-pixel.png')
}

async function create(){
    map = this.add.tilemap('map');
    var groundTiles = map.addTilesetImage('RPGpack');
    var bridgeTiles = map.addTilesetImage('overworld');
    groundLayer = map.createStaticLayer('Below Player', groundTiles, 0, 0);
    bridgeLayer = map.createStaticLayer('Below Player 2', bridgeTiles,0,0);
    collideLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

    //set boundaries of game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;


    player = this.physics.add.sprite(100,300,'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    map.setCollisionBetween(1,999,true,collideLayer);

    //collideLayer.setCollisionByProperty({collides:true});
    //this.physics.add.collider(player,collideLayer);
    //map.setCollisionByExclusion([],true,collideLayer);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    collideLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    cursors = this.input.keyboard.createCursorKeys();
    //set bounds for camera (game world)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //make camera follow player
    this.cameras.main.startFollow(player);

    if(navigator.onLine){
        
        const ipRequest = await fetch('https://json.geoiplookup.io/');
        const ipResponse = await ipRequest.json();

        const weatherRequest = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
                                            + ipResponse.city + ',' + ipResponse.country_code + '&appid=fa452ec635e9759a07cab7433d42104f');
        const weatherResponse = await weatherRequest.json();

        // For debugging only - will move inside if statement when it works!
        var rainParticles = this.add.particles('rain');
        // addRain(rainParticles, map.widthInPixels, map.heightInPixels);
        // addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);

        var snowParticles = this.add.particles('snow');
        addSnow(snowParticles, map.widthInPixels, map.heightInPixels);

        if(weatherResponse.weather[0].main == "Rain"){

        }

        else if(weatherResponse.weather[0].main == "Drizzle"){

        }

        else if(weatherResponse.weather[0].main == "Snow"){
            
        }
    }

}

function update(){

    if (cursors.up.isDown){
        player.body.position.y -=4;
    }
    if (cursors.down.isDown){
        player.body.position.y +=4;
    }
    if (cursors.left.isDown){
        player.body.position.x -=4;
    }
    if (cursors.right.isDown){
        player.body.position.x +=4;
    }
    this.physics.collide(player,collideLayer);
}
