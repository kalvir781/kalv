import * as THREE from 'three';

console.log("loaded the index.js");

class Visualizer {
	constructor(visualizer) {
    console.log('init visualizer');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
  }
}

//const visualizer = document.getElementById("visualier");
//  if (visualizer !== null) {
//    new Visualizer(visualizer);
//  }
