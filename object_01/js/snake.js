//获取随机数对象
(function(){
	function Random(){
		
	}
	//获取随机数
	Random.prototype.getRandom= function(min,max){
		return Math.floor(Math.random()*(max-min) +min);
	}
	window.Random = new Random();
})();

//食物对象
(function(){
	console.log(Random.getRandom(0,5));
	var elements = [];
	//食物对象构造函数
	function Food(x,y,width,height,color){
		this.width = width||20;
		this.height = height||20;
		this.color = color||"green";
		this.x =x||0;
		this.y= y||0;
	};
	//食物初始化
	Food.prototype.init = function(map){
		remove();
		var element =  document.createElement("div");
		
		element.style.width = this.width + "px";
		element.style.height = this.height + "px";
		element.style.backgroundColor = this.color;
		element.style.position = "absolute";
		
		this.x = Random.getRandom(0,map.offsetWidth/this.width) * this.width;
		this.y = Random.getRandom(0,map.offsetHeight/this.height) * this.height;
		element.style.left = this.x +"px";
		element.style.top =  this.y + "px";
		map.appendChild(element);
		elements.push(element);
	};
	//删除食物
	function remove(){
		for(var i=0;i<elements.length;i++){
			var div = elements[i];
			div.parentNode.removeChild(div);
			elements.splice(i,1);
		}
	};
	
	window.Food = Food;
})();
//小蛇对象
(function(){
	//存储小蛇的每一块
	var elements=[];
	//小蛇构造函数
	function Snake(width,height,direction){
		this.width = width||20;
		this.height = height||20;
		this.direction = direction||"right";
		this.body = [
			{x:3,y:2,color:"red"},
			{x:2,y:2,color:"orange"},
			{x:1,y:2,color:"orange"}
		];
	};
	//小蛇初始化
	Snake.prototype.init = function(map){
		remove();
		for(var i=0;i<this.body.length;i++){
			var div = document.createElement("div");
			
			div.style.position= "absolute";
			div.style.width = this.width +"px";
			div.style.height = this.height + "px";
			div.style.left = this.body[i].x * this.width+"px";
			div.style.top = this.body[i].y*this.height +"px";
			div.style.backgroundColor = this.body[i].color;
			map.appendChild(div);
			elements.push(div);
		};
	};
	//小蛇移动
	Snake.prototype.move = function(food,map){	
		
		var i=this.body.length-1;
		for(;i>0;i--){
			this.body[i].x = this.body[i-1].x;
			this.body[i].y = this.body[i-1].y;
		};
		switch(this.direction){
			case "right": this.body[0].x+=1;break;
			case "left":this.body[0].x-=1;break;
			case "top":this.body[0].y-=1;break;
			case "bottom":this.body[0].y+=1;break;
		};
		//判断是否迟到食物
		var headX = this.body[0].x*this.width;
		var headY = this.body[0].y*this.height;
		var foodX = food.x;
		var foodY = food.y;
		if(headX==foodX&&headY==foodY){
			//获取小蛇最后的尾巴
			var last = this.body[this.body.length-1];
			this.body.push({
				x:last.x,
				y:last.y,
				color:last.color
			});
			//初始化食物
			food.init(map);
		};
	};
	
	function remove(){
		var i = elements.length-1;
		for(;i>=0;i--){
			var ele = elements[i];
			 ele.parentNode.removeChild(ele);
			 elements.splice(i,1);
		};
	};
	window.Snake = Snake;
})();
//游戏对象
(function(){
	var that = null;
	//游戏对象构造函数
	function Game(map){
		this.food = new Food();
		this.snake = new Snake();
		this.map = map;
		that = this;
	};
	//游戏对象初始化
	Game.prototype.init = function(){
		this.food.init(this.map);
		this.snake.init(this.map);
		this.runSnake();
		this.bindKey();
	};
	//游戏开始
	Game.prototype.runSnake = function(){	
		var timeId = setInterval(function(){
			this.snake.move(this.food,this.map);
			this.snake.init(this.map);
			var maxX = this.map.offsetWidth/this.snake.width;
			var maxY = this.map.offsetHeight/this.snake.Height;
			var headX = this.snake.body[0].x;
			var headY = this.snake.body[0].y;
			if(headX<0||headX>=maxX){
				clearInterval(timeId);
				alert("游戏结束");
			};
			if(headY<0||headY>=maxY){
				clearInterval(timeId);
				alert("游戏结束");
			};
		}.bind(that),150);
	};
	//监听键盘按下事件
	Game.prototype.bindKey = function(){
		document.addEventListener("keydown",function(e){
			switch(e.keyCode){
				case 37:this.snake.direction="left";break;
				case 38:this.snake.direction="top";break;
				case 39:this.snake.direction="right";break;
				case 40:this.snake.direction="bottom";break;
			};
		}.bind(that),false);
	};
	window.Game = Game;
})();
var map = document.querySelector(".map");
var game = new Game(map);
game.init();

