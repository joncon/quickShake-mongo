//remove example from name before using this file
//all conf files will be gitignored
var Scnl = require('./lib/scnl.js');


function Conf(){
  this.waveHost = "products01.ess.washington.edu";
  this.wavePort = 16021;
  this.mongoHost = "quickShake-mongo";
  this.mongoPort = 27017;
  this.mongodbName = "pnsn_waveforms";
  //all channels you want to archive
  this.channels=["YACH.HNZ.UW.--",
                 "WISH.ENZ.UW.--",
                 "WEDR.HNZ.UW.--",
                 "TILL.HNZ.UW.--",
                 "TAHO.HNZ.UW.--",
                 "RSLG.HNZ.UW.--",
                 "ROBC.HNZ.UW.--",
                 "RADR.ENZ.UW.--",
                 "OSD.ENZ.UW.--",
                 "OOW2.HNZ.UW.--",
                 "ONAB.HNZ.UW.--",
                 "OCP.HNZ.UW.--",
                 "OCEN.HNZ.UW.--",
                 "MKAH.HNZ.UW.--",
                 "LWCK.HNZ.UW.--",
                 "JEDS.ENZ.UW.--",
                 "FORK.ENZ.UW.--",
                 "FLRE.HNZ.UW.--",
                 "CORE.HNZ.UW.--",
                 "COOS.HNZ.UW.--",
                 "CNNB.HNZ.UW.--",
                 "CHZZ.HNZ.UW.--",
                 "CABL.HNZ.UW.--",
                 "BROK.HNZ.UW.--",
                 "BILS.HNZ.UW.--",
                 "BAND.HNZ.UW.--",
                 "BABR.ENZ.UW.--"
  ]
  this.scnls = [];
  for(var i =0; i< this.channels.length; i++){
    channel=this.channels[i].split(".");
    this.scnls.push(new Scnl({sta: channel[0], chan: channel[1], net: channel[2], loc: channel[3]}))
  }
 
 // this.scnls = [
 //            new Scnl({sta: 'JEDS', chan: 'ENZ', net: 'UW', loc: '--'}),
 //            new Scnl({sta: 'BABR', chan: 'ENZ', net: 'UW', loc: '--'}),
 //            new Scnl({sta: 'OSD', chan: 'ENZ', net: 'UW', loc: '--'}),
 //            new Scnl({sta: 'OCP', chan: 'HNZ', net: 'UW', loc: '--'}),
 //            new Scnl({sta: 'BROK', chan: 'HNZ', net: 'UW', loc: '--'}),
 //            new Scnl({sta: 'CORE', chan: 'HNZ', net: 'UW', loc: '--'})
 //           ];
 
  
               
             
}
module.exports = Conf;