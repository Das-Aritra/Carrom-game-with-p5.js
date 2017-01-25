function Striker(playline,num,friction)
{
  this.pos = playline.lines[num].copy();
  //this.y = playline.lines[num].y;
  this.size = 25;
  this.displace = 0;
  this.vel = createVector(0,0);
  //this.force = createVector(0,0);
  this.gameon = false;
  this.direction=0;
  this.dacc = friction;
  this.mass = 18;
  
  this.render = function(){
    push();
    fill(0,60,120);
    ellipse(this.pos.x,this.pos.y,this.size,this.size);
    pop();
  }
  this.update = function(){
    
    if (striker.gameon === false ){
      if (lineno==3 || lineno==1){
            this.pos.x+=this.displace;
            if (this.pos.x>playline.lines[num].x+playline.linesize)
                  this.pos.x=playline.lines[num].x+playline.linesize;
            else if (this.pos.x<playline.lines[num].x)
                      this.pos.x=playline.lines[num].x;
          }
          else{
            
            this.pos.y+=this.displace;
            if (this.pos.y>playline.lines[num].y+playline.linesize)
                  this.pos.y=playline.lines[num].y+playline.linesize;
            else if (this.pos.y<playline.lines[num].y)
                      this.pos.y=playline.lines[num].y;
          }
    }  
  
  }
  
  this.collidingWithBoardEdges = function(board){
    
    if(this.pos.x-(this.size/2)<=board.boundary[0] && this.pos.y-(this.size/2)<=board.boundary[1])
		{this.pos.x = board.boundary[0]+this.size/2;
		this.pos.y = board.boundary[1]+this.size/2;
		this.vel.x*=-1;
		this.vel.y*=-1;}
	else if(this.pos.x+(this.size/2) >=board.boundary[2] && this.pos.y-(this.size/2)<=board.boundary[1])
		{this.pos.x=board.boundary[2]-this.size/2;
		this.pos.y = board.boundary[1]+this.size/2;
		this.vel.x*=-1;
		this.vel.y*=-1;}
	else if(this.pos.x+(this.size/2)>=board.boundary[2] && this.pos.y+(this.size/2)>=board.boundary[3])
		{ this.pos.x = board.boundary[2]-this.size/2;
		  this.pos.y = board.boundary[3]-this.size/2;
		  this.vel.x*=-1;
		  this.vel.y*=-1;}
	else if(this.pos.x-(this.size/2)<=board.boundary[0] && this.pos.y+(this.size/2)>=board.boundary[3])
          {	this.pos.x=board.boundary[0]+this.size/2;
			this.pos.y = board.boundary[3]-this.size/2;
            this.vel.x*=-1;
            this.vel.y*=-1;}
     else if (this.pos.x-(this.size/2)<= board.boundary[0])
			{this.pos.x=board.boundary[0]+this.size/2;
			this.vel.x*=-1;}
	else if (this.pos.x+(this.size/2)>=board.boundary[2])
			{ this.pos.x=board.boundary[2]-this.size;
			  this.vel.x*=-1;}
      else if (this.pos.y-(this.size/2)<=board.boundary[1]) 
			{ this.pos.y = board.boundary[1]+this.size/2;
			this.vel.y*=-1;}
	else if (this.pos.y+(this.size/2)>=board.boundary[3])
			{ this.pos.y=board.boundary[3]-this.size/2;
			this.vel.y*=-1;}
    
    this.move();
     
  }
  
  this.collidingWithDices = function(dice){
    var d = dist(this.pos.x,this.pos.y,dice.pos.x,dice.pos.y);
    if (d<=(this.size/2+dice.size/2)){
          return true;
    }
  }
  
  this.inpocket = function(board){
    
    for(var i =0;i<board.pockets.length;i++){
        var d = dist(this.pos.x,this.pos.y,board.pockets[i].x,board.pockets[i].y);
        if(d < board.pockets[i].size-3){
            return true;
        }
    }
  }
  
  this.reposition = function()
  {
    this.gameon = false;
    this.pos = playline.lines[num].copy();
    this.displace=0;
    this.vel= createVector(0,0);
  }
  
  this.move = function(){
    this.pos.add(this.vel);
    this.vel.mult(this.dacc);
  }
  
  this.boost = function(dp,f)
  { this.direction = dp.direction;
    this.vel.add(p5.Vector.fromAngle(dp.direction).setMag(f));
  }
    
}

function Dpointer(s)
{ this.pos = s.pos.copy();
  this.len = s.size/2;
  this.direction = 0;
  this.rotation=0;
  //this.posvec = p5.Vector.fromAngle(this.direction*PI/2);
  
  this.render = function()
  { push();
    //print('drawing dpointer');
    translate(this.pos.x,this.pos.y);
    rotate(this.direction);
    fill(0,255,0);
    //stroke(255,0,0);
    rect(15,0,this.len,2);
    pop();
  }
  
  this.update = function(s){
    this.pos = s.pos.copy();
    this.direction+=this.rotation;
  }

}

function Dice(board,position){
  
  
  this.size = 20;
  this.pos = position;
  this.vel = createVector(0,0);
  this.mass = 10;
  
  this.render = function(){
    push();
    fill(255,255,0);
    ellipse(this.pos.x,this.pos.y,this.size,this.size);
    pop();
  }
  
  this.inpocket = function(board){
    
    for(var i =0;i<board.pockets.length;i++){
        var d = dist(this.pos.x,this.pos.y,board.pockets[i].x,board.pockets[i].y);
        if(d < board.pockets[i].size-3){
            return true;
        }
    }
  }
  
  this.update = function(){
    this.pos.add(this.vel);
    this.vel.mult(board.friction);
    
  }
  
  this.collidingWithBoardEdges = function(board){
    
    if(this.pos.x-(this.size/2)<=board.boundary[0] && this.pos.y-(this.size/2)<=board.boundary[1])
		{this.pos.x = board.boundary[0]+this.size/2;
		this.pos.y = board.boundary[1]+this.size/2;
		this.vel.x*=-1;
		this.vel.y*=-1;}
	else if(this.pos.x+(this.size/2) >=board.boundary[2] && this.pos.y-(this.size/2)<=board.boundary[1])
		{this.pos.x=board.boundary[2]-this.size/2;
		this.pos.y = board.boundary[1]+this.size/2;
		this.vel.x*=-1;
		this.vel.y*=-1;}
	else if(this.pos.x+(this.size/2)>=board.boundary[2] && this.pos.y+(this.size/2)>=board.boundary[3])
		{ this.pos.x = board.boundary[2]-this.size/2;
		  this.pos.y = board.boundary[3]-this.size/2;
		  this.vel.x*=-1;
		  this.vel.y*=-1;}
	else if(this.pos.x-(this.size/2)<=board.boundary[0] && this.pos.y+(this.size/2)>=board.boundary[3])
          {	this.pos.x=board.boundary[0]+this.size/2;
			this.pos.y = board.boundary[3]-this.size/2;
            this.vel.x*=-1;
            this.vel.y*=-1;}
     else if (this.pos.x-(this.size/2)<= board.boundary[0])
			{this.pos.x=board.boundary[0]+this.size/2;
			this.vel.x*=-1;}
	else if (this.pos.x+(this.size/2)>=board.boundary[2])
			{ this.pos.x=board.boundary[2]-this.size;
			  this.vel.x*=-1;}
      else if (this.pos.y-(this.size/2)<=board.boundary[1]) 
			{ this.pos.y = board.boundary[1]+this.size/2;
			this.vel.y*=-1;}
	else if (this.pos.y+(this.size/2)>=board.boundary[3])
			{ this.pos.y=board.boundary[3]-this.size/2;
			this.vel.y*=-1;}
    
    this.update();
     
  }
  
  this.inpocket = function(board){
    
    for(var i =0;i<board.pockets.length;i++){
        var d = dist(this.pos.x,this.pos.y,board.pockets[i].x,board.pockets[i].y);
        if(d < board.pockets[i].size-3){
            return true;
        }
    }
  }
  
  this.collisionWithDices = function(otherDice)
  {   
      var d = dist(this.pos.x,this.pos.y,otherDice.pos.x,otherDice.pos.y);
      if(d<=this.size)
      { print('Two Dices are colliding');
        return true;
      }
  }
}

