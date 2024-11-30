endpoints: 

DELETE a check from the /data/checks.json : http://localhost:5000/api/documents/delete/(the id here )
POST an image ( form-data with key : file ) : http://localhost:5000/api/ocr/upload
POST JSON data back to the server so it can be saved in /data/checks.json : http://localhost:5000/api/documents/save
GET the /data/checks.json : http://localhost:5000/api/admin/checks

