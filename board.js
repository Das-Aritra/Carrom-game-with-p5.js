function Board()
{
  this.h = height-100;
  this.w = width-100;
  this.pocket_a = new Pocket(55+15,55+15,30);
  this.pocket_b = new Pocket(this.w+30,55+15,30);
  this.pocket_c = new Pocket(55+15,this.h+30,30);
  this.pocket_d = new Pocket(this.w+30,this.h+30,30);
  this.pockets= [this.pocket_a,this.pocket_b,this.pocket_c,this.pocket_d];
  this.boundary = [55,55,55+this.w-10,55+this.h-10];
  this.friction = 0.97;
  
  this.render = function(){
    noFill();
    
    stroke(255);
    rect(50,50,this.h,this.w);
    rect(55,55,this.h-10,this.w-10);
    
   // ellipse(55+15,55+15,30,30);
   this.pocket_a.render();
   this.pocket_b.render();
   this.pocket_c.render();
   this.pocket_d.render();
  }
}

function Pocket(x,y,s)
{
  this.x = x;
  this.y = y;
  this.size = s;
  
  this.render = function(){
    ellipse(x,y,s,s);
  }
}

function Playline(){
   this.line_1 = createVector(95,95);
   this.line_2 = createVector(95,95);
   this.line_3 = createVector(width-95,95);
   this.line_4 = createVector(95,height-95);
   this.lines = [this.line_1,this.line_2,this.line_3,this.line_4];
   this.linesize = 410;
   this.render = function(){
     line(this.line_1.x,this.line_1.y,this.line_1.x+this.linesize ,this.line_1.y);
    line(this.line_2.x,this.line_2.y,this.line_2.x,this.line_2.y+this.linesize);
     line(this.line_3.x,this.line_3.y,this.line_3.x,this.line_3.y+this.linesize);
    line(this.line_4.x,this.line_4.y,this.line_4.x+this.linesize,this.line_4.y);
   }
}

function ForceMeter()
{ 
  this.x = 200;
  this.y = height-30;
  this.meter_x = this.x; 
  this.meter_y = this.y-5;
  this.h = 200;
  this.w = 20;
  this.force = 0;
  this.metvel =0;
  this.render = function(){
    push();
    fill(0,255,0);
    rect(this.x,this.y,this.h,this.w);
    pop();
    
  }
  
  this.render_meter = function(){
    push();
    noFill();
    stroke(255);
    rect(this.meter_x,this.meter_y,5,30);
    pop();
  }
  this.update = function(){
    this.meter_x+=this.metvel;
    if (this.meter_x>this.x+this.h-5) this.meter_x = this.x+this.h-5;
    else if (this.meter_x<this.x) this.meter_x= this.x;
  }
  
  this.setForce = function()
  {
    var f = map(this.meter_x,this.x,this.x+this.h-5,5,28);
    this.force =f;
  }
  
}
