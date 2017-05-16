module.exports = function(app)
{
	var compiler = require('compilex');
	var fc = require('file-compare')
	var option = {stats : true};
	
	var fs = require('fs');
	
	compiler.init(option);
	
	app.get('/' , function (req , res ) {

		res.render('output',{output:'', input:'',code:'',status:'',exOutput:''});

	});

	app.post('/compileAllCode' , function (req , res ) {
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		var status = [];
		chartDataPass=0;
		chartDataFail=0;
		form.parse(req,function(err,fields,files){
			var fs = require("fs");
    		var fileKeys = files.mainfile;
    		var compareRadio = fields.compareRadio;
    		fs.readFile(files.outputfile[0].path, 'utf8',function(err, outputfileData) {
				fs.writeFile("./uploads/output/" + files.outputfile[0].originalFilename,outputfileData, function(error){
					if(error)console.log(error ); 
				});
    		});
    		fs.readFile(files.inputfile[0].path, 'utf8',function(err, inputfileData) {
					fs.writeFile("./uploads/input/" + files.inputfile[0].originalFilename,inputfileData, function(error){
						if(error)console.log(error ); 
					});
					
					fileKeys.forEach(function(key) {
						fs.readFile(key.path, 'utf8',function(err, keyfileData) {
							fs.writeFile("./uploads/" + key.originalFilename,keyfileData, function(error){
								if(error)console.log(error ); 
							});
							var envData = { OS : "windows" , cmd : "g++"};	 
							compiler.compileCPPWithInput(envData , keyfileData ,inputfileData, function (data) {
								if(data.error)
								{
									res.send(data.error);
								}    	
								else
								{
									
									fs.writeFile("./output/" + key.originalFilename+"_output",data.output, function(error){
										if(error)console.log(error ); 
									});
									
									if(compareRadio.toString() === "true")
		    				        {
										console.log("./output/" + key.originalFilename+"_output")
										console.log(files.outputfile[0].originalFilename)
										fc.compare("./output/" + key.originalFilename+"_output","./uploads/output/"+files.outputfile[0].originalFilename,function(isEqual) {
											  console.log("isEqual?: " ,isEqual)
											  if(isEqual){
												  fs.readFile(files.outputfile[0].path, 'utf8',function(err, outputfileData) {
													  status.push({name: key.originalFilename , status:'PASS',output : data.output, exp_out : outputfileData});
													  chartDataPass = chartDataPass + 1;
													  if(status.length >= fileKeys.length){
														  
														  
														 
														  res.render('bulkcompiler',{status:status,chartDataPass:chartDataPass,chartDataFail:chartDataFail});
													  }		
												  });
												 
											  }
											  else{
												  fs.readFile(files.outputfile[0].path, 'utf8',function(err, outputfileData) {
													  status.push({name: key.originalFilename , status:'FAIL',output : data.output, exp_out : outputfileData});
													  chartDataFail = chartDataFail + 1;
													  if(status.length >= fileKeys.length){

														 
														  res.render('bulkcompiler',{status:status,chartDataPass:chartDataPass,chartDataFail:chartDataFail});
													  }		
												  });
											  }
										});
										
		    				        }
									else{
										status.push({name: key.originalFilename , status:'PASS',output : data.output, exp_out : ""});
										 if(status.length >= fileKeys.length){
											  
											  res.render('bulkcompiler',{status:status});
										  }	
									}
								}
							});
        			});
   				});
   			});
    		
    		
  		});
   			
	});
}