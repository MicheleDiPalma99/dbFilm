var express = require('express');
var mysql = require('mysql');
const util = require('util');
var sConnection={
		host: 'localhost',
		port: 3306, 
		user: 'root',
		password: 'root',
		database: 'dbfilm',
		multipleStatements: true};
var app = express();
app.use(express.static('.')); // Consente modalità "static"
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*'); //'http://localhost:8888');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

// #region ATTORI 

app.get("/listAttori",function(req,res){
	connection= mysql.createConnection(sConnection)	;
	connection.connect(function(err){
		if (!err){
			var sQuery="select * from attori;";	
			connection.query(sQuery,function(err,rows,fileds){
		      if (err) 
				res.sendStatus(500); //Internal Server Error
				else
				res.setHeader('Access-Control-Allow-Origin','*');
				res.json(rows); //resituisce tutti i records in formato json
				//console.log(rows)
			})
		}
	})
})
  
app.get("/getData",function(req,res){
	connection= mysql.createConnection(sConnection)	;
	connection.connect(function(err){
		if (!err){
			var sQuery="call dbfilm.getData(?,?,?, @nRows, @nPages); select @nRows as nRows, @nPages as nPages";	
			var data=[];
			// console.log("del Attore:"+util.inspect(req, {showHidden: false, depth: null}));
			data.push(req.query.tableName);
			data.push(req.query.pageIndex);
			data.push(req.query.pageSize);
			
			console.log(data);
	        
			connection.query(sQuery,data,function(err,rows,fileds){
		      if (err) 
				res.sendStatus(500); //Internal Server Error
				else
				//res.setHeader('Access-Control-Allow-Origin','*');
				res.json(rows); //resituisce tutti i records in formato json
				console.log(rows);
			})
		}
	})
})

app.delete('/delAttore', function(req, res) {
	console.log("delAttore");
	//res.setHeader('Access-Control-Allow-Origin','*');
	connection = mysql.createConnection(sConnection);
    connection.connect(function(err){ // callback
    if(!err) {
      var sQuery="delete from attori where CodAttore=?;";
      var data=[];
	 // console.log("del Attore:"+util.inspect(req, {showHidden: false, depth: null}));
      data.push(req.query.CodAttore);
	  console.log(req.query.CodAttore);
	  console.log(data[0]);
      connection.query(sQuery, data, function(err, rows, fields) {
				console.log("err");
				console.log(err);
				
        if (err) 
          res.sendStatus(500); //Internal Server Error
				else if (rows.affectedRows==0){
					console.log("affectedRows");

					res.sendStatus(401); //non ha trovato il cliente 
				}
        else   {
					console.log("Cancellato");
					res.status(200).send({status: 200, Message: "Del OK" });
					//res.sendStatus(200); // Attore cancellato con successo!
				}
      }); 
    } else {
      console.log("Error connecting database ... ");    
      res.sendStatus(500); //Internal Server Error
    }
  });
});

// aggiorna i dati di un attore tra,ite CodAttore. Se non trovato lo inserisce
app.put('/ModAttore', function(req, res){
	console.log(req.body.Nome);
	//res.setHeader('Access-Control-Allow-Origin','*');
	connection = mysql.createConnection(sConnection);
	connection.connect(function(err){
    if(!err) {
		var sQuery="UPDATE Attori SET Nome = ?, AnnoNascita = ?, Nazionalita = ? WHERE CodAttore = ?;";
		var data = [];
		console.log(req.query.CodAttore);
		console.log(req.query.Nome);
		console.log(req.query.AnnoNascita);
		console.log(req.query.Nazionalita);
		data.push(req.query.Nome);
		data.push(req.query.AnnoNascita);
		data.push(req.query.Nazionalita);
		data.push(req.query.CodAttore);
		connection.query(sQuery, data, function(err, rows, fields) {
			if (err) 
			{	console.log(err);
				res.sendStatus(500); //Internal Server Error
			}
			else if (rows.affectedRows==0)
			{
				var sQuery2="INSERT INTO Attori(Nome, AnnoNascita, Nazionalita) VALUES(?,?,?)";
				connection.query(sQuery2, data, function(err, rows, fields) {
					if (err) 
					{
						console.log(err);
						res.sendStatus(500); //Internal Server Error
					}						
					else   
					//res.status(200).send({ status:200, Message: "Ins OK" });
					res.status(200).send({ 
						status:  200, 
						Message: "Ins OK",
						data: 	 req.query  
					});
					//	res.sendStatus(200)
				});
			}
			else   
			{
				//res.sendStatus(200)
				res.status(200).send({ 
						status:  200, 
						Message: "Mod OK",
						data:    req.query   
					});
			}
		  }); 
	} else {
      console.log("Error connecting database ... ");    
      res.sendStatus(500); //Internal Server Error
    }
  });
});

// #endregion 

// #region FILM 
app.get("/listFilm",function(req,res){
	connection= mysql.createConnection(sConnection)	;
	connection.connect(function(err){
		if (!err){
			var sQuery="select * from film;";	
			connection.query(sQuery,function(err,rows,fileds){
		      if (err) 
				res.sendStatus(500); //Internal Server Error
				else
				res.setHeader('Access-Control-Allow-Origin','*');
				res.json(rows); //resituisce tutti i records in formato json
				//console.log(rows)
			})
		}
	})
})
  
app.get("/getData",function(req,res){
	connection= mysql.createConnection(sConnection)	;
	connection.connect(function(err){
		if (!err){
			var sQuery="call dbfilm.getData(?,?,?, @nRows, @nPages); select @nRows as nRows, @nPages as nPages";	
			var data=[];
			// console.log("del Attore:"+util.inspect(req, {showHidden: false, depth: null}));
			data.push(req.query.tableName);
			data.push(req.query.pageIndex);
			data.push(req.query.pageSize);
			
			console.log(data);
	        
			connection.query(sQuery,data,function(err,rows,fileds){
		      if (err) 
				res.sendStatus(500); //Internal Server Error
				else
				//res.setHeader('Access-Control-Allow-Origin','*');
				res.json(rows); //resituisce tutti i records in formato json
				console.log(rows);
			})
		}
	})
})

app.delete('/delFilm', function(req, res) {
	console.log("delFilm");
	//res.setHeader('Access-Control-Allow-Origin','*');
	connection = mysql.createConnection(sConnection);
    connection.connect(function(err){ // callback
    if(!err) {
      var sQuery="delete from film where CodFilm=?;";
      var data=[];
	 // console.log("del Film:"+util.inspect(req, {showHidden: false, depth: null}));
      data.push(req.query.CodFilm);
	  console.log(req.query.CodFilm);
	  console.log(data[0]);
      connection.query(sQuery, data, function(err, rows, fields) {
				console.log("err");
				console.log(err);
				
        if (err) 
          res.sendStatus(500); //Internal Server Error
				else if (rows.affectedRows==0){
					console.log("affectedRows");

					res.sendStatus(401); //non ha trovato il cliente 
				}
        else   {
					console.log("Cancellato");
					res.status(200).send({status: 200, Message: "Del OK" });
					//res.sendStatus(200); // Film cancellato con successo!
				}
      }); 
    } else {
      console.log("Error connecting database ... ");    
      res.sendStatus(500); //Internal Server Error
    }
  });
});

// aggiorna i dati di un attore tra,ite CodAttore. Se non trovato lo inserisce
app.put('/ModFilm', function(req, res){
	console.log(req.body.Nome);
	//res.setHeader('Access-Control-Allow-Origin','*');
	connection = mysql.createConnection(sConnection);
	connection.connect(function(err){
    if(!err) {
		var sQuery="UPDATE film SET Titolo = ?, AnnoProduzione = ?, Nazionalita = ?, Regista = ?, Genere = ? WHERE CodFilm = ?;";
		var data = [];
		console.log(req.query.CodFilm);
		console.log(req.query.Titolo);
		console.log(req.query.AnnoProduzione);
		console.log(req.query.Nazionalita);
		console.log(req.query.Regista);
		console.log(req.query.Genere);

		
		data.push(req.query.Titolo);
		data.push(req.query.AnnoProduzione);
		data.push(req.query.Nazionalita);		
		data.push(req.query.Regista);
		data.push(req.query.Genere);
		data.push(req.query.CodFilm);
		connection.query(sQuery, data, function(err, rows, fields) {
			if (err) 
			{	console.log(err);
				res.sendStatus(500); //Internal Server Error
			}
			else if (rows.affectedRows==0)
			{
				var sQuery2="INSERT INTO film(Titolo, AnnoProduzione, Nazionalita, Regista, Genere) VALUES(?,?,?,?,?)";
				connection.query(sQuery2, data, function(err, rows, fields) {
					if (err) 
					{
						console.log(err);
						res.sendStatus(500); //Internal Server Error
					}						
					else   
					//res.status(200).send({ status:200, Message: "Ins OK" });
					res.status(200).send({ 
						status:  200, 
						Message: "Ins OK",
						data: 	 req.query  
					});
					//	res.sendStatus(200)
				});
			}
			else   
			{
				//res.sendStatus(200)
				res.status(200).send({ 
						status:  200, 
						Message: "Mod OK",
						data:    req.query   
					});
			}
		  }); 
	} else {
      console.log("Error connecting database ... ");    
      res.sendStatus(500); //Internal Server Error
    }
  });
});

// #endregion 

// #region RECITA 

// app.get('/listQryattorefilms', function(req, res) {
// 	connection.query('SELECT * FROM dbfilm.qryattorefilms;',function(err, data){
// 	  if(err)
// 	  {
// 		res.send(err);
// 	  }
// 	  res.send(data);
// 	  //res.render('pacientes',{data:data});
// 	  console.log(data);
// 	});
// 	});

	app.get("/getData",function(req,res){
		connection= mysql.createConnection(sConnection)	;
		connection.connect(function(err){
			if (!err){
				var sQuery="call dbfilm.getData(?,?,?, @nRows, @nPages); select @nRows as nRows, @nPages as nPages";	
				var data=[];
				// console.log("del Attore:"+util.inspect(req, {showHidden: false, depth: null}));
				data.push(req.query.tableName);
				data.push(req.query.pageIndex);
				data.push(req.query.pageSize);
				
				console.log(data);
				
				connection.query(sQuery,data,function(err,rows,fileds){
				  if (err) 
					res.sendStatus(500); //Internal Server Error
					else
					//res.setHeader('Access-Control-Allow-Origin','*');
					res.json(rows); //resituisce tutti i records in formato json
					console.log(rows);
				})
			}
		})
	})
	
	// app.delete('/delQryattorefilms', function(req, res) {
	// 	console.log("delQryattorefilms");
	// 	//res.setHeader('Access-Control-Allow-Origin','*');
	// 	connection = mysql.createConnection(sConnection);
	// 	connection.connect(function(err){ // callback
	// 	if(!err) {
	// 	  var sQuery="delete from qryattorefilms where CodAttore=?;";
	// 	  var data=[];
	// 	 // console.log("del Film:"+util.inspect(req, {showHidden: false, depth: null}));
	// 	  data.push(req.query.CodAttore);
	// 	  console.log(req.query.CodAttore);
	// 	  console.log(data[0]);
	// 	  connection.query(sQuery, data, function(err, rows, fields) {
	// 				console.log("err");
	// 				console.log(err);
					
	// 		if (err) 
	// 		  res.sendStatus(500); //Internal Server Error
	// 				else if (rows.affectedRows==0){
	// 					console.log("affectedRows");
	
	// 					res.sendStatus(401); //non ha trovato il cliente 
	// 				}
	// 		else   {
	// 					console.log("Cancellato");
	// 					res.status(200).send({status: 200, Message: "Del OK" });
	// 					//res.sendStatus(200); // Film cancellato con successo!
	// 				}
	// 	  }); 
	// 	} else {
	// 	  console.log("Error connecting database ... ");    
	// 	  res.sendStatus(500); //Internal Server Error
	// 	}
	//   });
	// });
	
	// aggiorna i dati di un attore tra,ite CodAttore. Se non trovato lo inserisce
	app.put('/ModQryattorefilms', function(req, res){
		console.log(req.body.Nome);
		//res.setHeader('Access-Control-Allow-Origin','*');
		connection = mysql.createConnection(sConnection);
		connection.connect(function(err){
		if(!err) {
			var sQuery="UPDATE qryattorefilms SET CodAttore= ?, CodFilm = ?, Titolo = ?, AnnoProduzione = ?, Nazionalita = ?, Regista = ?, Genere = ? WHERE CodFilm = ? AND CodAttore = ?;";
			var data = [];
			console.log(req.query.CodFilm);
			console.log(req.query.Titolo);
			console.log(req.query.AnnoProduzione);
			console.log(req.query.Nazionalita);
			console.log(req.query.Regista);
			console.log(req.query.Genere);

			data.push(req.query.CodAttore);
			data.push(req.query.CodFilm);
			data.push(req.query.Titolo);
			data.push(req.query.AnnoProduzione);
			data.push(req.query.Nazionalita);		
			data.push(req.query.Regista);
			data.push(req.query.Genere);
			data.push(req.query.CodFilm);
			connection.query(sQuery, data, function(err, rows, fields) {
				if (err) 
				{	console.log(err);
					res.sendStatus(500); //Internal Server Error
				}
				else if (rows.affectedRows==0)
				{
					var sQuery2="INSERT INTO qryattorefilms (CodAttore, CodFilm, Titolo, AnnoProduzione, Nazionalita, Regista, Genere) VALUES(?,?,?,?,?,?,?)";
					connection.query(sQuery2, data, function(err, rows, fields) {
						if (err) 
						{
							console.log(err);
							res.sendStatus(500); //Internal Server Error
						}						
						else   
						//res.status(200).send({ status:200, Message: "Ins OK" });
						res.status(200).send({ 
							status:  200, 
							Message: "Ins OK",
							data: 	 req.query  
						});
						//	res.sendStatus(200)
					});
				}
				else   
				{
					//res.sendStatus(200)
					res.status(200).send({ 
							status:  200, 
							Message: "Mod OK",
							data:    req.query   
						});
				}
			  }); 
		} else {
		  console.log("Error connecting database ... ");    
		  res.sendStatus(500); //Internal Server Error
		}
	  });
	});



// New

app.get("/listQryattorefilms",function(req,res){
	connection= mysql.createConnection(sConnection)	;
	connection.connect(function(err){
		if (!err){
			var sQuery="SELECT * from qryattorefilms WHERE CodAttore = ?;";	
			var data=[];
			data.push(req.query.CodAttore);
			connection.query(sQuery,data,function(err,rows,fileds){
			if (err) 
				res.sendStatus(500); //Internal Server Error
				else
				res.setHeader('Access-Control-Allow-Origin','*');
				res.json(rows); //resituisce tutti i records in formato json
			})
		}
	})
})

app.get("/listAllFilm",function(req,res){
	connection= mysql.createConnection(sConnection)	;
	connection.connect(function(err){
		if (!err){
			var sQuery="SELECT * from qryattorefilms where CodAttore != ?";	
			var data=[];
			data.push(req.query.CodAttore);
			connection.query(sQuery,data,function(err,rows,fileds){
			if (err) 
				res.sendStatus(500); //Internal Server Error
				else
				res.setHeader('Access-Control-Allow-Origin','*');
				res.json(rows); //resituisce tutti i records in formato json
			})
		}
	})
})
app.delete('/delQryattorefilms', function(req, res) {
	console.log("delQryattorefilms");
	connection = mysql.createConnection(sConnection);
	connection.connect(function(err){ // callback
	if(!err) {
	var sQuery="UPDATE qryattorefilms SET CodAttore = ?+10 WHERE CodFilm = ?;";
	var data=[];
	data.push(req.query.CodAttore);
	data.push(req.query.CodFilm);
	console.log(sQuery);
	console.log(data);
	connection.query(sQuery, data, function(err, rows, fields) {		
		if (err) 
		res.sendStatus(500); //Internal Server Error
				else if (rows.affectedRows==0){

					res.sendStatus(401); //non ha trovato il film
				}
		else   {
					console.log("Cancellato");
					res.status(200).send({status: 200, Message: "Del OK" }); 
				}
	}); 
	} else {
	console.log("Error connecting database ... ");    
	res.sendStatus(500); //Internal Server Error
	}
});
});

app.delete('/addQryattorefilms', function(req, res) {
	console.log("addQryattorefilms");
	connection = mysql.createConnection(sConnection);
	connection.connect(function(err){ // callback
	if(!err) {
	var sQuery="UPDATE qryattorefilms SET CodAttore = ? WHERE CodFilm = ?;";
	var data=[];
	data.push(req.query.CodAttore);
	data.push(req.query.CodFilm);
	console.log(sQuery);
	console.log(data);
	connection.query(sQuery, data, function(err, rows, fields) {		
		if (err) 
		res.sendStatus(500); //Internal Server Error
				else if (rows.affectedRows==0){

					res.sendStatus(401); //non ha trovato il film
				}
		else   {
					console.log("Aggiunto");
					res.status(200).send({status: 200, Message: "Add OK" }); 
				}
	}); 
	} else {
	console.log("Error connecting database ... ");    
	res.sendStatus(500); //Internal Server Error
	}
});
});

app.put('/InsAttoreFilm', function(req, res){
	connection = mysql.createConnection(sConnection);
	connection.connect(function(err){
	if(!err) {
		var currentTime = new Date();
		var sQuery="INSERT INTO qryattorefilms(CodAttore, CodFilm, Titolo, AnnoProduzione, Nazionalita, Regista, Genere) VALUES(?,?,?,?,?,?,?)";
		console.log(sQuery);
		var data = [];
		data.push(req.query.CodAttore);
		data.push(req.query.CodFilm);
		data.push(req.query.Titolo);
		data.push(req.query.AnnoProduzione);
		data.push(req.query.Nazionalita);
		data.push(req.query.Regista);
		data.push(req.query.Genere);
		console.log(sQuery);
		console.log(data);
		connection.query(sQuery, data, function(err, rows, fields) {
			if (err) 
			{
				console.log(err);
				res.sendStatus(500); //Internal Server Error
			}						
			else   
			//res.status(200).send({ status:200, Message: "Ins OK" });
				res.status(200).send({ 
					status:  200, 
					Message: "Ins OK",
					data: 	 req.query  
			});
		})
	}
})
});



// #endregion
app.listen(3000);
console.log("http://localhost:3000/listAttori!");