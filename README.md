# Fast-Radius-3D
<a href="https://imgflip.com/gif/2uwigr"><img src="https://i.imgflip.com/2uwigr.gif" title="made at imgflip.com"/></a>

This is my coding challenge for Fast Radius. To run this code, git clone this repository, then run npm install in the root repository and in the client folder. Then once you installed the dependencies, run 'npm start' in the client folder, then run 'node server.js' in the root. 

This project parses and STL file, and then displays the 3D model to the screen using Three.js, WebGL, and React. After it parses the STL file, it shows the number of triangles, surface area, and bounding box of the model. In the code, I had the client side make a get request to an express server and the server would send the file back to client. Once the client receives the file, it parses it by splitting it up line by line and forms an object that three.js can use to show the model in 3D. Once I built out the object needed to display the 3D model and data, I used React components to display all of the data. 

I kept the design simple. Showing relevant data, while also showing a 3D model that is spinning 360 degrees. If I were to build out this application more, I would make it so you can upload your own STL file, and then it would display that file in 3D. I would also show more data about the object. I would also try and improve the ParseStl() function to make it more dynamic and be able to handle millions of lines of an STL file. 