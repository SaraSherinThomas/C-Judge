module.exports = function(app)
{
	var compiler = require('compilex');
	var fc = require('file-compare')
	var option = {stats : true};
	compiler.init(option);
	
	app.get('/' , function (req , res ) {

		res.render('output',{output:'', input:'',code:'',status:'',exOutput:''});
	});
	
	app.post('/inputs' , function (req , res ) {
		status = [];
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		var fs = require("fs");
		var count = 1;
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
				fs.writeFile("./uploads/Mult_test_cases/output/output" + count+".txt",outputfileData, function(error){
					if(error)console.log(error ); 
				});
    		});
    		//Read input file
    		fs.readFile(files.inputfile[0].path, 'utf8',function(err, inputfileData) {
				fs.writeFile("./uploads/Mult_test_cases/input/input" + count + ".txt",inputfileData, function(error){
					if(error)console.log(error ); 
				});
			});
    		console.log(count);
			res.render('testcases',{status:status,code:'',value:count,passCount:0,failCount: 0});
		});
	});//inputs
	
	app.post('/execute' , function (req , res ) {
		
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		var fs = require("fs");
		var status = [];
		
		form.parse(req,function(err,fields,files){
			var code = fields.code;
		    var lang = fields.lang;
			var count = 0;
			var i=1;
			var passCount = 0;
			var failCount = 0;
			var envData = { OS : "windows" , cmd : "g++"};
			console.log("I am here...");
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
			    	console.log(key[5]);
			    	fs.readFile("./uploads/Mult_test_cases/input/"+key, 'utf8',function(err, input) {
			    		fs.readFile("./uploads/Mult_test_cases/output/output" + key[5] + ".txt", 'utf8',function(err, output) {
			    		    console.log("./uploads/Mult_test_cases/input/"+key);
			    		   	console.log(input);
			    		   	console.log("./uploads/Mult_test_cases/output/output" + key[5] + ".txt");
			    		   	console.log(output);
			    		   	
			    			//compile code
			    			compiler.compileCPPWithInput(envData , code.toString() ,input, function (data) {
			    				if(data.error){
									res.send(data.error);
								}else{
									//write the output for : input_i
									console.log("Data output");
									console.log(data.output);
									fs.writeFile("./uploads/Mult_test_cases/output/output" + key[5] +"_output",data.output, function(error){
										if(error)console.log(error ); 
									});
									
									console.log("Files being compared");
									console.log("./uploads/Mult_test_cases/output/output" + key[5] +"_output")
									console.log("./uploads/Mult_test_cases/output/output" + key[5] + ".txt")
									
									//Compare the output with the expected output
									fc.compare("./uploads/Mult_test_cases/output/output" + key[5] +"_output","./uploads/Mult_test_cases/output/output" + key[5] + ".txt",function(isEqual) {
										console.log("isEqual?: " ,isEqual)
										if(isEqual){
										    console.log("Test_case"+key[5]);
											status.push({name: "Test_case"+key[5] , stat:'PASS',in : input,out : data.output,exp_out : output});
											console.log(status);
											passCount = passCount+1;
								 		}else{
											status.push({name: "Test_case"+key[5] , stat:'FAIL',in : input,out : data.output,exp_out : output});
											failCount=failCount+1;
										}
										console.log("lengths");
										console.log(filenames.length);
										console.log(status.length);
										if(status.length >= filenames.length){
										    console.log(status);
											res.render('testcases',{status:status,code:code,value:filenames.length,passCount:passCount,failCount:failCount});
										}
				    			    });//end of compare : output with expected output
			    				}//end of else
			    				
			    			});//end of compilation
			    			
			    		});//read output file
			    		
			    	});//read input file
			    	
			    });//for loop : count
			    
			});//read directory
			
		});//form parse
		
	});//post execute
}