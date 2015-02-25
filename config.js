//remove example from name before using this file
//all conf files will be gitignored
var Scnl = require('./lib/scnl.js');


function ArchiveScnls(){
  //must have a startime
  this.start = 1421652510000;
  //mark stop as null if you want to run in daemon mode 
  this.stop = this.start*3*60*1000;
  this.waveHost = "products01.ess.washington.edu";
  this.wavePort = 16017;
  this.mongoHost = "localhost";
  this.mongoPort = 27017;
  this.mongodbName = "hawks";
  //all channels you want to archive
  this.scnls = [
                new Scnl({sta: 'HWK1', chan: 'HNZ', net: 'UW', loc: '--'}),
                new Scnl({sta: 'HWK2', chan: 'HNZ', net: 'UW', loc: '01'}),
                new Scnl({sta: 'HWK3', chan: 'HNZ', net: 'UW', loc: '--'})
                ];
             
}

module.exports = ArchiveScnls;