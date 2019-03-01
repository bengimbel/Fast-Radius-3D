const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');

app.listen(port, () => console.log(`Connected port ${port}`));

//GET route to fetch STL file
app.get('/express_backend', (req, res) => {
  fs.readFile( __dirname + '/assets/Moon.stl', (err, data) => {
    if (err) {
      throw err; 
    } 

    res.send({express: data.toString()});
  });
});


