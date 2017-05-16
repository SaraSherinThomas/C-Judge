module.exports = function(app)
{

	
	var compiler = require('compilex');
	var fc = require('file-compare')
	var option = {stats : true};
	compiler.init(option);
	
	app.get('/' , function (req , res ) {

		res.render('output',{output:'', input:'',code:'',status:'',exOutput:''});

	});
	
	app.get('/testCases' , function (req , res ) {

		res.render('testcases',{status:[],code:'',value:'',passCount:0,failCount:0});
		require('./cases')(app);

	});
	app.get('/bulkCompiler' , function (req , res ) {

		res.render('bulkcompiler',{status:[],chartDataPass:0,chartDataFail:0});
		require('./bulk')(app);

	});
	app.get('/multiCompiler' , function (req , res ) {

		res.render('multicompiler',{status:'',output:'',exp_out:''});
		require('./multi')(app);

	});
	app.post('/compilecode' , function (req , res ) {
		
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		form.parse(req,function(err,fields,files){
			var code = fields.code;
			var input = fields.input;
		    var inputRadio = fields.inputRadio;
		    var codeRadio = fields.codeRadio;
		    var compareRadio = fields.compareRadio;
		    var lang = fields.lang;
		    var expectedOutput = fields.expectedOutput;
		    if(lang.toString()=== 'C' || lang.toString()=== 'C++'){
		    	if(inputRadio.toString() === "true")
		        {
		    		var file = files.mainfile[0];
	        		var fs = require("fs");
	        		fs.readFile(file.path, 'utf8',function(err, fileData) {
	        			var path = "./uploads/" + file.originalFilename;
	        			var fileKeys = files.mainfile;

	        			fileKeys.forEach(function(key) {
	        				fs.readFile(key.path, 'utf8',function(err, keyfileData) {
	        					fs.writeFile("./uploads/" + key.originalFilename,keyfileData, function(error){
	        						if(error)console.log(error ); 
	        					});
	        				});
	        			});
	        			
	        			
	        			
	        			var envData = { OS : "windows" , cmd : "g++"};	  
	        			if(codeRadio.toString() === "true")
	    		        {
	        				compiler.compileCPPWithInput(envData , code.toString() ,input.toString(), function (data) {
	        					if(data.error)
	        					{
	        						console.log(data.error)
	        						res.send(data.error);
	        					}    	
	        					else
	        					{
	        						if(compareRadio.toString() === "true")
	        				        {
	        							if(fields.expectedOutput.toString()==data.output){
	        								res.render('output',{output:data.output, input:input.toString(),code:code.toString(),status:"PASS",exOutput:expectedOutput.toString()});
	        							}
	        							else{
	        								res.render('output',{output:data.output, input:input.toString(),code:code.toString(),status:"FAIL",exOutput:expectedOutput.toString()});
	        							}
										
	        				        }
	        						else{
	        							res.render('output',{output:data.output, input:input.toString(),code:code.toString(),status:"",exOutput:''});
	        						}
	        						
	        					}
	        					
	        				});
	    		        }
	        			else{
	        				fs.readFile(files.inputfile[0].path, 'utf8',function(err, fileInputData) {
	    	        			var path = "./uploads/" + file.originalFilename;
	    	        			
	    	        			fs.writeFile(path, fileInputData, function(error){
	    	        				if(error)console.log(error ); 
	    	        			})
	    	        			compiler.compileCPPWithInput(envData , fileData ,fileInputData, function (data) {
	    	        				if(data.error)
	    	        				{
	    	        					res.send(data.error);
	    	        				}    	
	    	        				else
	    	        				{
	    	        					
	    	        					if(compareRadio.toString() === "true")
		        				        {
		        							if(fields.expectedOutput.toString()==data.output){
		        								res.render('output',{output:data.output, input:fileInputData,code:fileData,status:"PASS",exOutput:expectedOutput.toString()});
		        							}
		        							else{
		        								res.render('output',{output:data.output, input:fileInputData,code:fileData,status:"FAIL",exOutput:expectedOutput.toString()});
		        							}
											
		        				        }
		        						else{
		        							res.render('output',{output:data.output, input:fileInputData,code:fileData,status:"",exOutput:''});
		        						}
	    	        				
	    	        				}
	        					
	    	        			});
	        				});
	        			}
	    		        
	        		})
		    		
		        	
		        	
		        }
		    	else{
		    		var file = files.mainfile[0];
	        		var fs = require("fs");
	        		fs.readFile(file.path, 'utf8',function(err, fileData) {
	        			var path = "./uploads/" + file.originalFilename;
	        			
	        			var fileKeys = files.mainfile;

	        			fileKeys.forEach(function(key) {
	        				fs.readFile(key.path, 'utf8',function(err, keyfileData) {
	        					fs.writeFile("./uploads/" + key.originalFilename,keyfileData, function(error){
	        						if(error)console.log(error ); 
	        					});
	        				});
	        			});
	        			
	        		
	        			var envData = { OS : "windows" , cmd : "g++"};	  
	        			if(codeRadio.toString() === "true")
	    		        {
	        				compiler.compileCPP(envData , code.toString() , function (data) {
	        					if(data.error)
	        					{
	        						res.send(data.error);
	        					}    	
	        					else
	        					{
	        						if(compareRadio.toString() === "true")
	        				        {
	        							if(fields.expectedOutput.toString()==data.output){
	        								res.render('output',{output:data.output, input:'',code:code.toString(),status:"PASS",exOutput:expectedOutput.toString()});
	        							}
	        							else{
	        								res.render('output',{output:data.output, input:'',code:code.toString(),status:"FAIL",exOutput:expectedOutput.toString()});
	        							}
										
	        				        }
	        						else{
	        							
	        							res.render('output',{output:data.output, input:'',code:code.toString(),status:"",exOutput:''});
	        						}
	        					}
	        					
	        				});
	    		        }
	        			else{
	        				compiler.compileCPP(envData , fileData , function (data) {
	        					if(data.error)
	        					{
	        						res.send(data.error);
	        					}    	
	        					else
	        					{
	        						if(compareRadio.toString() === "true")
	        				        {
	        							if(fields.expectedOutput.toString()==data.output){
	        								res.render('output',{output:data.output, input:'',code:fileData,status:"PASS",exOutput:expectedOutput.toString()});
	        							}
	        							else{
	        								res.render('output',{output:data.output, input:'',code:fileData,status:"FAIL",exOutput:expectedOutput.toString()});
	        							}
										
	        				        }
	        						else{
	        							
	        							res.render('output',{output:data.output, input:'',code:fileData,status:"",exOutput:''});
	        						}
	        						
	        					}
	        					
	        				});
	        			}
	    		        
	        		})
		    		
	    		        
		    	}
		    }
		});

	});

	
}