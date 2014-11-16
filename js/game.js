var Game = function(game){};
//ประกาศตัวแปร Game เป็น State ประกอบไปด้วย 3 ฟังชั่น
Game.prototype = {
	//preload เป็นฟังชั่นที่จะทำงานก่อนเป็นอันดับแรก ใช่ในการโหลด ไฟล์ต่างๆเข้าสู่เกม
	preload: function() {

	//game.load.image(ชื่อที่จะเอาไว้เรียก, ที่อยู่ไฟล์);
	game.load.image('ground', 'assets/ground.png');
	game.load.image('logo', 'assets/phaser.png');
	//game.load.spritesheet(ชื่อที่จะเอาไว้เรียก, ที่อยู่ไฟล์, ความกว้างแต่ละเฟรม, ความสูงแต่ละเฟรม);
	game.load.spritesheet('crystal', 'assets/crystal.png', 16, 16);
	game.load.spritesheet('player', 'assets/player.png', 41, 36);

	},
	//create เป็นฟังชั่นที่ทำงานต่อจาก preload มีหน้าในการสร้าง  เกม และ แสดง assets file ต่างๆที่โหลดเข้ามา
	create: function() {
		// Reponsive and centered canvas
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.scale.minWidth = 320;
		this.scale.minHeight = 200;
		this.scale.maxWidth = 720;
		this.scale.maxHeight = 480;

		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.scale.setScreenSize(true);

		//เซท ระบบ Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = '#8DD3EC';

		//game.add.sprite(ตำแหน่งในนอน x, ตำแหน่งในแนวตั้ง y, ชื่อรูปภาพที่โหลดมาใน preload);
		this.logo = game.add.sprite(game.world.width / 2, 70, 'logo');
		//this.logo.scale.setTo(ขนาดสเกลของรูปในแนวนอน ค่าปกติคือ 1, ขนาดสเกลของรูปในแนวตั้ง ค่าปกติคือ 1);
		this.logo.scale.setTo(0.4, 0.4);
		//กำหนดจุดศูนย์กลางของรูปที่จะใช้ในการวาง this.logo.anchor.setTo(0.5, 0.5) ในที่นี้คือกึ่งกลางของรูปภาพพอดี ค่าปกติคือ 0,0 หรือมูมซ้ายบน ลองปรับเล่นดูนะครับ
		this.logo.anchor.setTo(0.5, 0.5);

		//สร้าง Group
		this.Worldground = game.add.group();
		//เปิดระบบ Physics ให้กับ object ทั้งหมดที่อยู่ใน group
		this.Worldground.enableBody = true;
		//สร้าง พื้น
		var ground = this.Worldground.create(0, game.world.height - 32, 'ground');
		//กำหนดสเกลของรูป มีความกว้างเป็น 2 เท่า เนื่องจากรูปที่มช้มีขนาดเล็กกว่าตัวเกม
		ground.scale.setTo(2,1);
		//กำหนดจุดหยุดของการตกเวลากระโดด
		ground.body.immovable = true;

		var groundLeft = this.Worldground.create(0, 210, 'ground');
		groundLeft.scale.setTo(0.5,0.5);
		groundLeft.body.immovable = true;

		var groundCenter = this.Worldground.create( 250, 140, 'ground');
		groundCenter.scale.setTo(0.3,0.5);
		groundCenter.body.immovable = true;

		var groundRight = this.Worldground.create( game.world.width - 80, 70, 'ground');
		groundRight.scale.setTo(1,0.5);
		groundRight.body.immovable = true;

		var groundTop = this.Worldground.create( 0, 70, 'ground');
		groundTop.scale.setTo(0.5,0.5);
		groundTop.body.immovable = true;

		//สร้างตัวละคร และตั้งค่า
		this.player = game.add.sprite(game.world.width - 50, game.world.height - 75, 'player');
		//เปิดระบบ Physics ให้ตัวละคร
		game.physics.arcade.enable(this.player);
		//กำหนัดการเด้งของวัตถุ
		this.player.body.bounce.y = 0.2;
		//แรงโน้มถ่วง
		this.player.body.gravity.y = 700;
		//ตั้งค่าตัวละคร ไม่สามารถออกน้อง world ได้
		this.player.body.collideWorldBounds = true;
		//ใส่ animations ให้ ตัวละคร
		//animations.add(กำหนดชื่อ animations, ตำแหน่ง frame, ความเร็วในการเปลี่ยน frame, วนรอบหรือไม่);
		this.player.animations.add('left', [10, 9, 10, 11], 5, true);
		this.player.animations.add('right', [4, 3, 4, 5], 5, true);
		//ตั้งค่า frame ปกติ
		this.player.frame = 1;
		//รับค่า Cursorkeys (ปุ่ม ขึ้, ลง, ซ้าย, ขาว) จากคีย์บอร์ด
		this.cursors = this.input.keyboard.createCursorKeys();

		this.crystal = game.add.group();

		this.crystal.enableBody = true;
		//วนลูปสร้าง จำนวน 10 อัน
		for (var i = 0; i < 10; i++) {
			//เรียนใช้ฟังชั่น randomCrystal
			this.randomCrystal();
		}
		this.score = 0;
		//Add text
		//คำลั่ง text(ตำแหน่งในแนวนอน, ตำแหน่งแนวตั้ง, ข้อความ, กำหนดสไตล์);
		this.scoreText = game.add.text(10, game.world.height - 25, 'score: ' + this.score, { fontSize: '20px', fill: '#000' });

	},
     // ฟังชั่น update เปรียบเสมือน Game logic มีการเรียกใช้ประมาณ 60 ครั้งต่อวินาที
	update: function() {

		//กำหนดการชนกันระหว่าง ตัวละครกับ พื้น
		game.physics.arcade.collide(this.player, this.Worldground);
		//กำหนดการเคลื่อนที่เป็น 0 ก่อนทุกครั้ง
		this.player.body.velocity.x = 0;
		//ถ้า กดปุ่ม ลูกศรขวา
		if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 150;
			//เล่น animationa ที่ชื่อว่า right
			this.player.animations.play('right');
		} else if (this.cursors.left.isDown) {
			//ถ้ากดปุ่ม ลูกศรซ้าย
			this.player.body.velocity.x = -150;
			//เล่น animationa ที่ชื่อว่า left
			this.player.animations.play('left');
		} else {
			//ถ้าไม่ได้กดปุ่มลูกศรใดๆ
			//หยุดเล่น animationa
			this.player.animations.stop();
			//และตัวละครอยู่ที่ frame 1
			this.player.frame = 1;
		}
		//ถ้ากดปุ่มลูก ศรขึ้น และ ตัวละครอยู่ติดพื้น
		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			//เคลื่อนที่ขึ้น
			this.player.body.velocity.y = -350;
		}
		//หมายเหตุ จะกระโดได้ก็ต่อเมื่อกดปุ่มลูกศรขึ้นและตัวละครต้องอยู่บนพื้นเท่านั้น

		game.physics.arcade.collide(this.crystal, this.Worldground);
		//overlap(object1, object2, เรียกใช้ฟังชั่น, เช็คค่าที่ืนมา, อ้างถึงส่วนมากใช้ this);
		//overlap เมื่อ ตัวละคร ชนกับ crystal เรียกฟังชั่น collectCrystal
		game.physics.arcade.overlap(this.player, this.crystal, this.collectCrystal, null, this);

	},
	randomCrystal: function() {
		//กำหนดตัวแปร x มีค่าเท่ากับสุ่มตัวเลขระหว่าง 0 ถึง ความกว้างของตัวเกมลบด้วย 40
		var x = this.rnd.integerInRange(0, game.world.width - 40);
		//กำหนดตัวแปร y มีค่าเท่ากับสุ่มตัวเลขระหว่าง 0 ถึง ความสูงของตัวเกมลบด้วย 100
		var y = this.rnd.integerInRange(0, game.world.height - 100);
		//สร้าง crystal
		this.crystal.create(x, y, 'crystal');
		//ทำการวนลูป crystal สร้าง animation
		this.crystal.forEach(function(crystal) {
			crystal.animations.add('effect', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
			crystal.animations.play('effect');
			crystal.body.gravity.y = 200;
			crystal.body.bounce.y = 0.5;
		});

	},
	collectCrystal: function(player, crystal) {

		//ทำลาย
		crystal.kill();
		//เพิ่มคะแนนทีละ 1 
		this.score += 1;
		this.scoreText.text = 'Score : ' + this.score;
		//สร้าง crystal ทดแทน
		this.randomCrystal();

	}
};
//Phaser.Game(ความกว้างของเกม, ความสูงของเกม, renderer มีอยู่ 3 แบบ Phaser.AUTO Phaser.CANVAS Phaser.WEBGL, id element ที่สร้างตัวเกมใน index.html )
var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game');
//ทำการ Add state Game โดยใช้ชื่อว่า game
game.state.add('game', Game);
//ทำการ Start game
game.state.start('game');