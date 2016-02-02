//try native first

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test2Trace';



stas = ['RCM', 'RCS', 'FMW', 'STAR'];
for(var i=0; i< stas.length; i++){
  sta = stas[i];
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    insertDocuments(db, mockCollection(sta), mockTraceJson(sta), function() {
        db.close();
      });
  });
  
}



var insertDocuments = function(db, collection, json, callback) {
  // Get the documents collection
  var collection = db.collection(collection);
  // Insert some documents
  console.log(json);
  collection.insert([json], function(err, result) {
    console.log(err);
    assert.equal(err, null);
    assert.equal(1, result.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
};



//mock collection
function mockCollection(sta){
  return sta + "_" + "EHZ" + "_" + "UW" + "--";
}

//create mock data
function mockTraceJson(sta, data){
  return { 
    "starttime":  Date.now() -2000,
    "endtime":    Date.now(),
    "samprate":   200, 
    "sta":        sta,
    'chan':       "EHZ",
    'net':        "UW",
    'loc':        "--",
    'data':       [1,3, 100000,-200]
  };
}




//test using mongoose
//var mongoose  = require('mongoose'),
//     assert    = require("assert");
// mongoose.connect('mongodb://localhost/test');
// 
// 
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log("connected");
// });
// 
// var traceDataSchema = mongoose.Schema({
//       starttime:  Number,
//       endtime:    Number,
//       samprate:   Number, 
//       sta:        String,
//       chan:       String,
//       net:        String,
//       loc:        String,
//       data:       Array
// });
// 
// var TraceData = mongoose.model("TraceData", traceDataSchema);

