var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

upload_dir = process.cwd();
console.log("File uploads will go to:", upload_dir);

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm({ 
      uploadDir: upload_dir ,  // don't forget the __dirname here
      keepExtensions: true,
      maxFileSize: 1000 * 1024 * 1024
    });

    form.parse(req, function (error, fields, files) {
      if (error) {        
        console.error(`Error at form.parse: ${error}`);
        res.writeHead(401); 
        return res.end("Error at form.parse.");
      } 
    
      if (!files || !files.filetoupload || files.filetoupload.originalFilename === '' ) {
        console.error(`No file received.`);
        res.writeHead(401); 
        return res.end('No file received.');
      }
    
      var oldpath = files.filetoupload.filepath;
      var newpath = upload_dir + '/' + files.filetoupload.originalFilename;

      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File ' + files.filetoupload.originalFilename + ' uploaded successfully.');
        console.log("File uploaded: " + newpath);
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br><br>');
    res.write('<input type="submit" style="margin: 10vh;" >');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);
