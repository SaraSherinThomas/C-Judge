module.exports = function(app)
{
	var compiler = require('compilex');
	var fc = require('file-compare')
	var option = {stats : true};
	
	compiler.init(option);
	app.get('/' , function (req , res ) {

		res.render('output',{output:'', input:'',code:'',status:'',exOutput:''});

	});
	app.post('/compileMultiCode' , function (req , res ) {
		var multiparty = require("multiparty");
		var form = new multiparty.Form();
		var status = [];
		form.parse(req,function(err,fields,files){
			var fs = require("fs");
			var inputRadio = fields.inputRadio;
			var compareRadio = fields.compareRadio;
    		var fileKeys = files.mainfile;
    		fs.readFile(files.outputfile[0].path, 'utf8',function(err, outputfileData) {
				fs.writeFile("./uploads/output/" + files.outputfile[0].originalFilename,outputfileData, function(error){
					if(error)console.log(error ); 
				});
    		});
    		if(inputRadio.toString() == "false")
	        {
    			fs.readFile(files.mainfile[0].path, 'utf8',function(err, inputfileData) {
					
					fileKeys.forEach(function(key) {
						fs.readFile(key.path, 'utf8',function(err, keyfileData) {
							fs.writeFile("./uploads/" + key.originalFilename,keyfileData, function(error){
								if(error)console.log(error ); 
							});
						});
		    		});
		    		var envData = { OS : "windows" , cmd : "g++"};	 
		    		compiler.compileMultiFileCPP(envData , fileKeys, function (data)  {
						if(data.error)
						{
							res.send(data.error);
						}
						else{
							console.log(data.output);
							if(compareRadio.toString() === "true")
    				        {
								fs.readFile(files.outputfile[0].path, 'utf8',function(err, keyfileData) {
									if(keyfileData.toString()==data.output){
        								res.render('multicompiler',{status:"PASS",output:data.output,exp_out:keyfileData});
        							}
        							else{
        								res.render('multicompiler',{status:"FAIL",output:data.output,exp_out:keyfileData});
        							}
			        			});
    				        }
							else{
								res.render('multicompiler',{status:"PASS",output:data.output,exp_out:''});
							}
						}
					});
    			});
	        }
    		else{
    			fs.readFile(files.inputfile[0].path, 'utf8',function(err, inputfileData) {
    				fs.writeFile("./uploads/input/" + files.inputfile[0].originalFilename,inputfileData, function(error){
						if(error)console.log(error ); 
					});
					fileKeys.forEach(function(key) {
						fs.readFile(key.path, 'utf8',function(err, keyfileData) {
							fs.writeFile("./uploads/" + key.originalFilename,keyfileData, function(error){
								if(error)console.log(error ); 
							});
						});
		    		});
		    		var envData = { OS : "windows" , cmd : "g++"};	 
		    		compiler.compileMultiFileCPPWithInput(envData , fileKeys ,inputfileData, function (data) {
						if(data.error)
						{
							res.send(data.error);
						}
						else{
							if(compareRadio.toString() === "true")
    				        {
								fs.readFile(files.outputfile[0].path, 'utf8',function(err, keyfileData) {
									if(keyfileData.toString()==data.output){
        								res.render('multicompiler',{status:"PASS",output:data.output,exp_out:keyfileData});
        							}
        							else{
        								res.render('multicompiler',{status:"FAIL",output:data.output,exp_out:keyfileData});
        							}
			        			});
    				        }
							else{
								res.render('multicompiler',{status:"PASS",output:data.output,exp_out:''});	
							}
						}
					});
    			});
    		}
    		
  		});
   			
	});
}