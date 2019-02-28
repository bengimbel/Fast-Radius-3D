import React, { Component } from 'react';
import * as THREE from 'three';
class ThreeJSComponent extends Component {
constructor(props){
    super(props)
    
    
}

componentDidMount(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.z = 70;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    this.scene.add( this.camera );
   
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = 0; 
    directionalLight.position.y = 0; 
    directionalLight.position.z = 1; 
    directionalLight.position.normalize();
    this.scene.add( directionalLight );
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth/2, window.innerHeight/2);
   
    this.renderer.setClearColor('#ffffff')
    this.mount.appendChild(this.renderer.domElement)

    this.start()
}

componentWillReceiveProps(nextProps){
    if(nextProps.mesh !== this.props.mesh){
        this.scene.add(nextProps.mesh)
        nextProps.mesh.rotateX(250.00)
        nextProps.mesh.rotateY(50.00)
    }   
}
componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
}
stop = () => {
    cancelAnimationFrame(this.frameId)
  }
animate = () => {
    if (this.props.mesh) {
        this.props.mesh.rotation.z += 0.02;
        this.props.mesh.scale.set( 14.5, 14.5, 14.5 )
    } 
   this.renderScene()
   this.frameId = window.requestAnimationFrame(this.animate)
 }
renderScene = () => {
  this.renderer.render(this.scene, this.camera)
}

    render(){
        return(
            <div
                style={{ display: 'flex' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default ThreeJSComponent;