var board;
var playline;
var lineno=3;
//var strikervel=0;
//var diceok=false;
var points=0;
var dpointer;
var fmeter;
var dices=[];
//var gameon = false;
function setup() {
  createCanvas(600,600);
  board= new Board();
  playline = new Playline();
  striker = new Striker(playline,lineno,board.friction);
  dpointer = new Dpointer(striker);
  fmeter = new ForceMeter();
  
  var posd;
  var newDice;
  var collWD=0; // to check if newDice colliding with other objects
  
  //before pushing a new Dice into the dices array , making sure it's not overlapping with other objects
  while(dices.length!=10){
    
      posd = createVector(random(board.boundary[0]+20,board.boundary[2]-20),random(board.boundary[1]+20,board.boundary[3]-20));
      newDice = new Dice(board,posd);
      
      if(newDice.inpocket(board)) { //dice not possible to be floating over a pocket
          
            collWD=1;
      }
      else if(striker.collidingWithDices(newDice)){ //dice overlapping with striker
          
            collWD=1;
      }
      else {
        for(var j=0;j<dices.length;j++){
                
            if(dices[j].collisionWithDices(newDice)){ //dice overlapping with other dice
                  
                 // diceok=false;
                  collWD=1;
            }
        }
      }
      
      if(collWD===0) {
          dices.push(newDice);
         // diceok=true;
      }
      
      collWD=0;
    
  }
      
  
  
 print(dices.length);
}

function draw() {
  //frameRate(60);
  background(0);
  board.render();
  fmeter.render();
  fmeter.render_meter();
  fmeter.update();
  playline.render();
  text('POINTS = '+points,width-100,30);
  
  striker.move();
  striker.render();
  striker.update();
  
  
  for(var i=0;i<dices.length;i++){
    dices[i].update()
    dices[i].render();
    dices[i].collidingWithBoardEdges(board);
    
    }
  var cols ;
  var check = [];
  
  //checking if dices are colliding with one another 
  
  for(var i=0;i<dices.length;i++)
  {   cols = new Array(dices.length);
    for(var j=0;j<dices.length;j++)
    {
        cols[j]=0;
    }
    check[i]=cols;
  }
  for(var i=0;i<dices.length;i++)
  {
    for(var j=0;j<dices.length;j++)
    {
      if(i!=j && check[i][j]!=1 && check[j][i]!=1)
      { 
        check[i][j]=1;
        check[j][i]=1;
        
        
        if(dices[i].collisionWithDices(dices[j])) {
          print('colliding! '+i+' with '+j);
      
          changeDirection(dices[i],dices[j]);
        }
      }
    }
  }
 
 
 for(var i=0;i<dices.length;i++){
    if(dices[i].inpocket(board)) 
    {dices.splice(i,1); points+=1;}
 }
  if (striker.gameon === false){
    dpointer.render();
    dpointer.update(striker);
    
  }
  
  if(striker.inpocket(board))
  { striker.gameon = false;
    points-=1;
    striker.reposition();
  }
  striker.collidingWithBoardEdges(board);
  //striker.boost();
  for(var i=0;i<dices.length;i++){
    if(striker.collidingWithDices(dices[i]))
    { print('Striker collided with dice '+i);
      changeDirection(striker,dices[i]);
    }
  }
    
}

function keyPressed(){
  if(keyCode == RIGHT_ARROW || keyCode == UP_ARROW){
    striker.displace=2;
  }
  else if(keyCode == LEFT_ARROW || keyCode == DOWN_ARROW){
    striker.displace=-2;
  }
  
  if(key == 'A') dpointer.rotation = -0.05;
  else if (key == 'S') dpointer.rotation = 0.05;
  
  if (key == ' ') {striker.boost(dpointer,fmeter.force); striker.gameon = true;}
   
  if (key == 'W') {fmeter.metvel=2; }
  else if (key == 'Q') {fmeter.metvel=-2;}
  
  if (key == 'R') striker.reposition();
}

function keyReleased()
{   if (key == 'W' || key == 'Q')
        fmeter.setForce();
    striker.displace=0;
    dpointer.rotation = 0;
    fmeter.metvel=0;
}

function changeDirection(a,b){
     // print(other.vel);
      var va = a.vel.copy();
      var vb = b.vel.copy();
      // normal and tangent vector calculation
      
      var Unormal = createVector(b.pos.x-a.pos.x,b.pos.y-a.pos.y);
      Unormal.normalize();
      var Utangent = createVector(-Unormal.y,Unormal.x);
      var va_norm = Unormal.copy().dot(va);
      var va_tan = Utangent.copy().dot(va);
      
      var vb_norm = Unormal.copy().dot(vb);
      var vb_tan = Utangent.copy().dot(vb);
      
      print('Calculating new Direction');
      
      var vaf_tan = va_tan;
      var vbf_tan = vb_tan;
      
      var total_mass = a.mass+b.mass;
      
      var vaf_norm = (va_norm*(a.mass-b.mass)+2*b.mass*vb_norm)/total_mass;
      var vbf_norm = (vb_norm*(b.mass-a.mass)+2*a.mass*va_norm)/total_mass;
      
      var vaf_norm_vec = Unormal.copy().mult(vaf_norm);
      var vaf_tan_vec = Utangent.copy().mult(vaf_tan);
      
      var vbf_norm_vec = Unormal.copy().mult(vbf_norm);
      var vbf_tan_vec = Utangent.copy().mult(vbf_tan);
      
      var vaf = vaf_norm_vec.add(vaf_tan_vec);
      var vbf = vbf_norm_vec.add(vbf_tan_vec);
      
      a.vel = vaf;
      b.vel = vbf;
      
      /*
      var vaf_x = (va.x*(a.mass-b.mass)+2*b.mass*vb.x)/(a.mass+b.mass);
      var vaf_y = (va.y*(a.mass-b.mass)+2*b.mass*vb.y)/(a.mass+b.mass);
      
      var vbf_x = (vb.x*(b.mass-a.mass)+2*a.mass*va.x)/(a.mass+b.mass);
      var vbf_y = (vb.y*(b.mass-a.mass)+2*a.mass*va.y)/(a.mass+b.mass);
      
      a.vel.x = vaf_x;
      a.vel.y = vaf_y;
      
      b.vel.x = vbf_x;
      b.vel.y = vbf_y;
      */
      a.update();
      b.update();
  
}



