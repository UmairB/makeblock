var MegaPi = require("../megapi").MegaPi;
var bot = new MegaPi("/dev/ttyS0",onStart);

var level = 1;
function loop(){
  bot.dcMotorRun(0,level?50:-50);
  level = 1-level;
}
function onStart(){
  bot.dcMotorStop(0);
  setInterval(loop,2000);
}
