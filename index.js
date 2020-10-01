const express= require('express');
const app=express();
const bodyparser=require('body-parser');
let server=require('./server.js');
let middleware=require('./middleware.js');
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
const MongoClient=require('mongodb');
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';
let db
MongoClient.connect(url,{ useUnifiedTopology: true }, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
});
app.get('/Hospitaldetails',middleware.checkToken,function(req,res){
	console.log("hospital details are fetching ....");
	db.collection('Hospital').find().toArray()
	.then(result => res.json(result));
});
app.get('/Ventilatordetails',middleware.checkToken,function(req,res){
	console.log("ventilator details are fetching ....");
	db.collection('Ventilators').find().toArray()
	.then(result => res.json(result));
});

app.post('/Searchventbystatus',middleware.checkToken,(req,res)=>{
	var h=req.body.status;
	console.log(h);
	var ventilatordetails = db.collection('Ventilators')
	.find({"status":h}).toArray().then(result => res.json(result));
});


app.post('/Searchventbyname',middleware.checkToken,(req,res)=>{
	var name=req.query.name;// Apollo  hospital,appollo 
	console.log(name);
	var ventilatordetails = db.collection('Ventilators')
	.find({"name":new RegExp(name , 'i')}).toArray().then(result => res.json(result));
});

app.put('/Updateventilator' ,middleware.checkToken,(req,res)=>{

	var ventid={ventilatorId :req.body.ventilatorId};
	console.log(ventid);
	var newvalues={ $set :{ status:req.body.status}};
	db.collection("Ventilators").updateOne(ventid,newvalues,function(err,result){
		if(err) throw err;
		console.log("Updated");
		res.json("updated");
	});
});
app.post('/addVentilator',middleware.checkToken,(req,res)=>{
	var hId=req.body.hId;
	var vid=req.body.ventilatorId;
	var st=req.body.status;
	var na=req.body.name;
	var item={hId:hId,ventilatorId:vid,status:st,name:na};
	db.collection("Ventilators").insertOne(item,function(err,result){
		if(err) throw err;
		console.log("inserted");
		res.json("Inserted");
	});
});
app.delete('/delete',middleware.checkToken, (req,res)=>{
	var id=req.body.ventilatorId;
	console.log(id);
	var query={ventilatorId:id};
	db.collection("Ventilators").deleteOne(query,function(err,res){
		if(err) throw err;
		console.log("deleted");
		res.json("deleted");
	});
})
app.listen(8080,function(){
	console.log("Started on port : 8080");
})
