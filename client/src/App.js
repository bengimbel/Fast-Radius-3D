import React, { Component } from 'react';
import * as THREE from 'three';
import ThreeJSComponent from './components/ThreeJSComponent';
import CardDataComponent from './components/CardDataComponent';

class App extends Component{
  constructor(props){
    super(props)

    this.state = {
      data: null
    };
  }

  componentDidMount(){
    this.callBackendAPI()
      .then((res) => {
        console.log(res.express, 'response')
        this.setState({ data: res.express }, () => {
          this.parseStl(res.express)
        })
      })
      .catch(err => console.log(err));
  }

  // Fetches STL file hosted on my Express server. 
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  trim = (str) => {
      str = str.replace(/^\s+/, '');
      for (var i = str.length - 1; i >= 0; i--) {
          if (/\S/.test(str.charAt(i))) {
              str = str.substring(0, i + 1);
              break;
          }
      }
      return str;
  }

  calculateSurfaceArea = (singleTriangleCoordinate) => {
    //Step 1 - Calculate vector by initial and terminal points:
    let xBA = singleTriangleCoordinate.b.x - singleTriangleCoordinate.a.x
    let yBA = singleTriangleCoordinate.b.y - singleTriangleCoordinate.a.y
    let zBA = singleTriangleCoordinate.b.z - singleTriangleCoordinate.a.z
    let xCA = singleTriangleCoordinate.c.x - singleTriangleCoordinate.a.x
    let yCA = singleTriangleCoordinate.c.y - singleTriangleCoordinate.a.y
    let zCA = singleTriangleCoordinate.c.z - singleTriangleCoordinate.a.z

    //Step 2 - Calculate cross product of vectors:
    let i = (yBA * zCA - zBA * yCA) / 1
    let j = (xBA * zCA - xCA * zBA) / -1
    let k = (xBA * yCA - yBA * xCA) / 1

    //Step 3 - Calculate magnitude of a vector:
    let productsOfVectors = Math.pow(i, 2) + Math.pow(j, 2) + Math.pow(k, 2)
    let surfaceArea = Math.sqrt(productsOfVectors) * 1/2
    
    //Step 4 return the calculated surface area
    return surfaceArea
}

  parseStl = (stl) => {
    let state = '';
    let geo = new THREE.Geometry();
    let normal
    let done
    let vCount = 0
    let singleTriangleCoordinate = {}
    let totalTriangleCoordinates = []
    let surfaceArea = 0
    let lines = stl.split('\n');
    //Split lines up and loop through each line...
    for (let i = 0; i < lines.length; i++) {
        if (done) {
            break;
        }
        let line = this.trim(lines[i]);
        let parts = line.split(' ');
        //Switch statement to work my way through each level of STL file
        switch (state) {
            case '':
                if (parts[0] !== 'solid') {
                    console.error(line);
                    console.error(`${parts[0]} should be "solid"`);
                    return;
                } else {
                    state = 'solid';
                }
                break;
            case 'solid':
                if (parts[0] !== 'facet' || parts[1] !== 'normal') {
                    console.error(line);
                    console.error(`${parts[0]} should be "facet normal"`);
                    return;
                } else {
                  //Add normal coordinates to normal array.
                    normal = [
                        parseFloat(parts[2]), 
                        parseFloat(parts[3]), 
                        parseFloat(parts[4])
                    ];
                    state = 'facet normal';
                }
                break;
            case 'facet normal':
                if (parts[0] !== 'outer' || parts[1] !== 'loop') {
                    console.error(line);
                    console.error(`${parts[0]} should be "outer loop"`);
                    return;
                } else {
                    state = 'vertex';
                }
                break;
            case 'vertex': 
                if (parts[0] === 'vertex') {
                  //Build a triangle with the 3 vertex's given                         
                    let triangle = new THREE.Vector3(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    )

                  //Build singleTriangleCoordinate Object to later calculate surface area
                    if(!singleTriangleCoordinate.hasOwnProperty('a')){
                        singleTriangleCoordinate.a = triangle
                    } else if(!singleTriangleCoordinate.hasOwnProperty('b')){
                      singleTriangleCoordinate.b = triangle
                    } else {
                      singleTriangleCoordinate.c = triangle
                    }

                  //Push triangle to geo.verticies array
                    geo.vertices.push(triangle);
                } else if (parts[0] === 'endloop') {
                  //Calculate surface area total
                    let surfaceAreaInstance = this.calculateSurfaceArea(singleTriangleCoordinate)
                    surfaceArea = surfaceArea + surfaceAreaInstance

                  //Push to array of total triangle coordinates
                    totalTriangleCoordinates.push(singleTriangleCoordinate)
                    singleTriangleCoordinate = {}

                  //Add Vcount to geo.faces array with normals. Also adding 1 to Vcount
                    geo.faces.push( new THREE.Face3( vCount*3, vCount*3+1, vCount*3+2, new THREE.Vector3(normal[0], normal[1], normal[2]) ) );
                    vCount++;
                    state = 'endloop';
                } else {
                    console.error(line);
                    console.error(`${parts[0]} should be vertex or endloop`);
                    return;
                }
                break;
            case 'endloop':
                if (parts[0] !== 'endfacet') {
                    console.error(line);
                    console.error(`${parts[0]} should be "endfacet`)
                    return;
                } else {
                    state = 'endfacet';
                }
                break;
            case 'endfacet':
                if (parts[0] === 'endsolid') {
                  //Add surface area to geo object 
                    geo.surfaceArea = surfaceArea
                    geo.totalTriangleCoordinates = totalTriangleCoordinates

                  //Compute bounding box for geo object
                    geo.computeBoundingBox()
                  
                  //Create Mesh
                    let mesh = new THREE.Mesh( 
                        geo, 
                        new THREE.MeshLambertMaterial({
                            overdraw:true,
                            color: 0x3E87FF,
                            shading: THREE.FlatShading
                        }
                    ));
                    this.setState({mesh})
                    done = true;
                } else if (parts[0] === 'facet' && parts[1] === 'normal') {
                    normal = [
                        parseFloat(parts[2]), 
                        parseFloat(parts[3]), 
                        parseFloat(parts[4])
                    ];
                    state = 'facet normal';
                } else {
                    console.error(line);
                    console.error(`${parts[0]} should be "endsolid" or "facet normal"`);
                    return;
                }
                break;
            default:
                console.error(`${state} is Invalid`);
                break;
        }
    }
};

// Pass mesh object as a prop to the ThreeComponent and CardDataComponent to display it's data
render(){
    return(
      <div>
        <h1 style={styles.title}>Fast Radius Coding Challenge</h1>
        <div style={styles.componentDiv}>
          <CardDataComponent mesh={this.state.mesh} style={styles.component}/>
          <ThreeJSComponent mesh={this.state.mesh} style={styles.component}/> 
        </div>
     </div>
    )
  }
}
export default App;

const styles = {
  componentDiv: {
      display: 'flex',
      
  },
  component: {
      display: 'flex',
      flex: 1,
  },
  title: {
    textAlign: 'center', 
    marginBottom: '100px'
  }
}