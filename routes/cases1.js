module.exports = function(app)
{
	var compiler = require('compilex');
	var js = require('diff');
	var fc = require('file-compare');
	var option = {stats : true};
	compiler.init(option);
	
	app.get('/' , function (req , res ) {

		res.render('output',{output:'', input:'',code:'',status:'',exOutput:''});
	});
	
	app.post('/inputs' , function (req , res ) {
		
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		var fs = require("fs");
		var count = 1;
		var status = [];
		form.parse(req,function(err,fields,files){
		
		 	//Read number of files present in Multi_test_cases folder : Number of input test cases
			fs.readdir("./uploads/Mult_test_cases/input", function(err, filenames) {
		    	if (err) {
		    		onError(err);
		    		return;
		    	}
		    	
		    	count = count+filenames.length
		    });
		    
		   
		    
		    status.push({value : count});
		    
		    //Read output file
			fs.readFile(files.outputfile[0].path, 'utf8',function(err, outputfileData) {
				fs.writeFile("./uploads/Mult_test_cases/output/output" + count+".txt",outputfileData,'utf8', function(error){
					if(error)console.log(error ); 
				});
    		});
    		//Read input file
    		fs.readFile(files.inputfile[0].path, 'utf8',function(err, inputfileData) {
				fs.writeFile("./uploads/Mult_test_cases/input/input" + count + ".txt",'utf8',inputfileData, function(error){
					if(error)console.log(error ); 
				});
			});
    		console.log(count);
			res.render('testcases',{status:status,code:'',value:count,passCount:0,failCount: 0});
		});
	});//inputs
	
	app.post('/execute' , function (req , res ) {
		
		
		var result = 1;
        function compare ( outFile ,expFile, callback ){
        	var i = 0;
        	var j = 0;	
        	var out_str = "";
        	var exp_str = "";		
        	var out = "";
        	var expOut = "";
        	
        	fs.readFile(expFile, 'utf8',function(err, expOut) {
	    		fs.readFile(outFile, 'utf8',function(err, out) {
	    			console.log("out" + out);
	    			console.log("expOut" + expOut);    			
	    			while(j<=expOut.length){
	    				
	    				console.log(out[i] + "----- " + expOut[i]);
	    				
	    				while(((out[i] === ' ')||(out[i] === '\t')||(out[i] === '\n')) && (i<out.length)){
	    					console.log("here1............");
	    					i = i + 1;
	    				}
	    				while(((expOut[j] === ' ')||(expOut[j] === '\t')||(expOut[j] === '\n')) && (j<expOut.length)){
	    					console.log("here2............");	    					
	    					j = j + 1;
	    				}
	    				while(((out[i] !== ' ')&&(out[i] !== '\t')&&(out[i] !== '\n'))&&(i<out.length)){
	    					console.log("here3............");
	    					out_str = out_str + out[i];
	    					i = i+1;
	    				}
	    				
	    				while(((expOut[j] !== ' ')&&(expOut[j] !== '\t')&&(expOut[j] !== '\n'))&&(j<expOut.length)){
	    					console.log("here4............");
	    					exp_str = exp_str + expOut[j];
	    					j = j + 1;
	    				}
	    				
	    				console.log("outStr : " + out_str);
	    				console.log("expStr : " + exp_str);
	    				
	    				if(out_str.localeCompare(exp_str) === 0){
	    					result = 1;
	    					exp_str = "";
		    				out_str = "";
	    					console.log("equal");
	    					if(j>=expOut.length){
	    						callback(result);
	    						break;
	    					}
	    						
	    				}
	    				else{
	    					console.log("not equal");
	    					result = 0;
	    					exp_str = "";
		    				out_str = "";
	    		        	console.log("result1" + result);
	    					callback(result);	    	
	    					break;	    		 
	    				}
	    			}//while loop
	    		});//expOut read
        	});//out read
        }
		
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		var fs = require("fs");
		var status = [];
		
		form.parse(req,function(err,fields,files){
			var code = fields.code;
		    var lang = fields.lang;
		    var codeRadio = fields.codeRadio;
		    var fileKeys = files.mainfile;
			var count = 0;
			var i=1;
			var passCount = 0;
			var failCount = 0;
			var envData = { OS : "windows" , cmd : "g++"};
			
			if(codeRadio.toString() === "true"){
			    //Read number of files present in Multi_test_cases folder : Number of input test cases
				fs.readdir("./uploads/Mult_test_cases/input", function(err, filenames) {
			    	if (err) {
			    		onError(err);
			    		return;
			    	}
			    	count = filenames.length
				    //for all input files execute the code and save the status
				    filenames.forEach(function(key){
				    	//console.log(key[5]);
				    	fs.readFile("./uploads/Mult_test_cases/input/"+key, 'utf8',function(err, input) {
				    		fs.readFile("./uploads/Mult_test_cases/output/output" + key[5] + ".txt", 'utf8',function(err, output) {
				    		   //console.log("./uploads/Mult_test_cases/input/"+key);
				    		   //console.log(input);
				    		   //console.log("./uploads/Mult_test_cases/output/output" + key[5] + ".txt");
				    		   //console.log(output);
				    		   	
				    			//compile code
				    			compiler.compileCPPWithInput(envData , code.toString() ,input, function (data) {
				    				if(data.error){
										res.send(data.error);
									}else{
										//write the output for : input_i
										//console.log("Data output");
										//console.log(data.output);
										fs.writeFile("./uploads/Mult_test_cases/output/output" + key[5] +"_output",data.output,'utf8', function(error){
											if(error)console.log(error ); 
										});
										
										//console.log("Files being compared");
										//console.log("./uploads/Mult_test_cases/output/output" + key[5] +"_output")
										//console.log("./uploads/Mult_test_cases/output/output" + key[5] + ".txt")
										
										//Compare the output with the expected output
										compare("./uploads/Mult_test_cases/output/output" + key[5] +"_output","./uploads/Mult_test_cases/output/output" + key[5] + ".txt",function(isEqual) {
											console.log("isEqual?: " ,isEqual)
											if(isEqual){
											    //console.log("Test_case"+key[5]);
												status.push({name: "Test_case"+key[5] , stat:'PASS',in : input,out : data.output,exp_out : output});
												//console.log(status);
									 		}else{
												status.push({name: "Test_case"+key[5] , stat:'FAIL',in : input,out : data.output,exp_out : output});
											}
											//console.log("lengths");
											//console.log(filenames.length);
											//console.log(status.length);
											if(status.length >= filenames.length){
											    //console.log(status);
												res.render('testcases',{status:status,code:code,value:filenames.length});
											}
					    			    });//end of compare : output with expected output
				    				}//end of else
				    				
				    			});//end of compilation
				    			
				    		});//read output file
				    		
				    	});//read input file
				    	
				    });//for loop : count
				    
				});//read directory
			}//if(codeRadio.toString() === "true"
			else{
			    //Read number of files present in Multi_test_cases folder : Number of input test cases
				fs.readdir("./uploads/Mult_test_cases/input", function(err, filenames) {
			    	if (err) {
			    		onError(err);
			    		return;
			    	}
			    	count = filenames.length
			    	console.log(filenames);
				    //for all input files execute the code and save the status
				    filenames.forEach(function(key){
				    	//console.log(key[5]);
				    	fs.readFile("./uploads/Mult_test_cases/input/"+key, 'utf8',function(err, input) {
				    		fs.readFile("./uploads/Mult_test_cases/output/output" + key[5] + ".txt", 'utf8',function(err, output) {
				    		    
				    			//compile code		    		   	
				    			compiler.compileMultiFileCPPWithInput(envData , fileKeys ,input, function (data) {
				    				if(data.error){
										res.send(data.error);
									}else{
										//write the output for : input_i
										//console.log("Data output");
										//console.log(data.output);
										fs.writeFile("./uploads/Mult_test_cases/output/output" + key[5] +"_output",data.output,'utf8', function(error){
											if(error)console.log(error ); 
										});
										
										//console.log("Files being compared");
										//console.log("./uploads/Mult_test_cases/output/output" + key[5] +"_output")
										//console.log("./uploads/Mult_test_cases/output/output" + key[5] + ".txt")
										
										//Compare the output with the expected output
										compare("./uploads/Mult_test_cases/output/output" + key[5] +"_output","./uploads/Mult_test_cases/output/output" + key[5] + ".txt",function(isEqual) {
											console.log("isEqual?: " ,isEqual)
											if(isEqual){
											    //console.log("Test_case"+key[5]);
												status.push({name: "Test_case"+key[5] , stat:'PASS',in : input,out : data.output,exp_out : output});
												//console.log(status);
									 		}else{
												status.push({name: "Test_case"+key[5] , stat:'FAIL',in : input,out : data.output,exp_out : output});
											}
											//console.log("lengths");
											//console.log(filenames.length);
											//console.log(status.length);
											if(status.length >= filenames.length){
											    //console.log(status);
												res.render('testcases',{status:status,code:code,value:filenames.length});
											}
					    			    });//end of compare : output with expected output
				    				}//end of else
		
				    			});//end of compilation

				    		});//read output file
				    		
				    	});//read input file
				    	
				    });//for loop : count
				    
				});//read dir
			}//else
		});//form parse
		
		
	});//post execute
}