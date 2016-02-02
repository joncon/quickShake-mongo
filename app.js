//Connect to Earthworm waveserver to retrieve traceBuf2 packages for a given SCNL and time window 
//and stuff into mongodb 
//ALL EPOCH TIMES ARE MILLISECONDS!!!!

var Waveserver = require("./lib/waveserver.js"),
    Conf = require("./config.js"), //config file
    MongoClient  = require('mongodb').MongoClient;

//get configs
var conf = new Conf();
var scnls = conf.scnls,
    waveHost = conf.waveHost,
    wavePort = conf.wavePort;

var daemon, start, stop;
//daemon mode will run indefinetly with current data
//daemon is assumed if stop is blank
daemon = true;
stop = Date.now()
start = stop - 1000; //1 second

//Connect to Mongo
var url = "mongodb://" + conf.mongoHost + ":" + conf.mongoPort + "/" + conf.mongodbName;



var scnlIndex = 0;
var count;
var tripStart=Date.now();
// main function
function getData(scnl){
  count=0;
  // console.log('getData called');
  if(scnl.lastBufStart === null){
    scnl.lastBufStart = start;
  }
  if(daemon){
    var scnlStop = Date.now();
  }else{
    var scnlStop = scnl.lastBufStart + 5*1000; //move 5 seconds at a time for back filling
  }
  var ws = new Waveserver(waveHost, wavePort, scnl);
  ws.connect(scnl.lastBufStart, scnlStop);

 
  //parse getScnlRaw flag and decide whether to disconnect or continue
  ws.on('header', function(header){
    if (header.flag ==="FR"){ //most common error missed by current data not in ws yet
      ws.disconnect();
      console.log("Wave ERROR: FR (Current data not in Wave yet)");
    }else if(header.flag === 'FB'){
      console.log("Wave ERROR: there has been a terrible error of some sort or other.");
      ws.disconnect();
    }
  });

  ws.on('data', function(message){
    var scnl = findScnl(message); 
    if(message.starttime > scnl.lastBufStart){
      scnl.lastBufStart = message.starttime;
      // var json = JSON.stringify(message);
      var json = message
      // MongoClient.connect(url, function(err, db){
      //   insertDocuments(db, scnl, json,  function() {
      //      db.close();
      //   });
      // });
      count++;
      // console.log("from=" + message.sta + ":" + message.chan + ":" + message.net + ":" + message.loc + " length=" +
      //             message.data.length + " start=" + strToTime(message.starttime) + " end=" + strToTime(message.endtime));
    }
  });

  ws.on('error', function(error){
    console.log("Wave Error (closed): " + error); //error
  });
  
  //called when all data are processed or socket timesout
  ws.on("close", function(){
    if(daemon || scnl.lastBufStart && scnl.lastBufStart < stop){
      console.log("received " + count + " packets for station: " + scnls[scnlIndex].sta)
      scnlIndex ++;
      //toggle through index
      scnlIndex = scnlIndex == scnls.length ? 0 : scnlIndex;
      if(scnlIndex==0){
        var now = Date.now()
        console.log("Roundtrip time is: " + ((now-tripStart)/1000) + " seconds")
        tripStart=now;
      }
      var scnl = scnls[scnlIndex];
      getData(scnl);
    }else{
      if(db)
        db.close();
      process.exit(code=0);
    }
  });
} // end getData()

//the first call
var end = Date.now();
getData(scnls[0]);


function insertDocuments(db, scnl, json) {
  var key = makeScnlKey(scnl);
  console.log(json);
  // console.log(key);
  db.collection(key).insertOne({'test': 'one'}, function(err, result) {
    assert.equal(err, null);
    // assert.equal(3, result.result.n);
    // assert.equal(3, result.ops.length);
    // console.log("Inserted 3 documents into the document collection");
  });
};




// // ECONNREFUSED just in case - try to reconnect
// process.on('uncaughtException', function(err) {
//   // try to reconnect
//   if(err.code == 'ECONNREFUSED'){
//     setTimeout(getData(scnls[0]), 5000);
//   }
// });


/* FUNCTIONS */

//find channel object based on returned message
//needed to track each channels last start
function findScnl(msg){
  var scnl;
  for(var i=0; i < scnls.length; i++){
    var c = scnls[i];
    if(c.sta == msg.sta && c.chan == msg.chan && c.net == msg.net && c.loc == msg.loc){
     scnl = c;
     break;
    }
  }
  // console.log(scnl);
  return scnl;
}

// function printClientCount() {
//   console.log('Total Connected Clients:  ' + this.Object.size(allSocks));
//   console.log('Total Clients (lifetime): ' + connectionIDCounter);
// }
// 
// function printClientStatus(ws, status) {
//   console.log(new Date() + ' Client ' + status + ' id: ' + ws.id + ' IP: '+ ws.IP);
// }
// 
// function printSourceStatus(status) {
//   console.log(new Date() + ' ' + status + ' from: ' + config.sourceSocket);
// }
// 
function strToTime(unix_timestamp) {
  var date = new Date(unix_timestamp);
  var year =  date.getFullYear();
  var month = "0" + date.getMonth() + 1;
  var day =  "0" + date.getDate();
  var hours = "0" + date.getHours();// hours part from the timestamp
  var minutes = "0" + date.getMinutes(); // minutes part from the timestamp
  var seconds = "0" + date.getSeconds(); // seconds part from the timestamp
  var ms = "0" + date.getMilliseconds(); // milliseconds part from the timestamp
  // will display time in 1/18/2015 10:30:23.354 format
  return  "/" + month.substr(minutes.length-2) + "/ " + day.substr(minutes.length-2) + "/" + year + " " + 
          hours.substr(minutes.length-2) + ':' + minutes.substr(minutes.length-2) + ':' + 
          seconds.substr(seconds.length-2) + '.' + ms.substr(ms.length-3);
}



function makeScnlKey(scnl){
  var loc = scnl.loc == "--" ? "" : "_" + scnl.loc;
  return  scnl.sta.toLowerCase() + "_" + scnl.chan.toLowerCase() + "_" + scnl.net.toLowerCase()  + loc ;
};



// prototype to return size of associative array
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
