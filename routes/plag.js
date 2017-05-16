module.exports = function(app)
{
	app.get('/' , function (req , res ) {

		res.render('output',{output:'', input:'',code:'',status:'',exOutput:''});

	});
	app.get('/plagCheck' , function (req , res ) {

		var fs = require('fs');
		var CopyleaksCloud = require('plagiarism-checker');
		var clCloud = new CopyleaksCloud();
		var config = clCloud.getConfig();
		
		function readFiles(dirname, onFileContent, onError) {
		  fs.readdir(dirname, function(err, filenames) {
		    if (err) {
		      onError(err);
		      return;
		    }
		    console.log(filenames.length);
		    filenames.forEach(function(filename) {
		      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
		        if (err) {
		          onError(err);
		          return;
		        }
		        onFileContent(filename, content,filenames.length);
		      });
		    });
		  });
		}
		var status = [];
		var data = {};
		fs.readdir("./uploads", function(err, filenames) {
		    if (err) {
		      onError(err);
		      return;
		    }
		    filenames.forEach(function(filename) {
		    	clCloud.createByFile(filename,function(resp,err){
			    	//check if we have credits
			    	if(resp && resp.ProcessId){
			    		console.log('API: create-by-file');
			    		console.log('Process has been created: '+resp.ProcessId);
			    	}
		    	});
		    	status.push({name: filename , status:'PASS'});
			});
		});
		  
		  
			  
			  res.render('plagChecker',{status:status});
		  

	});	
	
}