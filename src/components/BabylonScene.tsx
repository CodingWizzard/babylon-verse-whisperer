
import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const engine = new BABYLON.Engine(canvasRef.current, true);
    const createScene = () => {
      // Create a new scene
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      
      // Add a camera
      const camera = new BABYLON.ArcRotateCamera(
        "camera", 
        -Math.PI / 2, 
        Math.PI / 2.5, 
        15, 
        new BABYLON.Vector3(0, 0, 0), 
        scene
      );
      camera.attachControl(canvasRef.current, true);
      camera.lowerRadiusLimit = 10;
      camera.upperRadiusLimit = 20;
      
      // Add a light
      const light = new BABYLON.HemisphericLight(
        "light", 
        new BABYLON.Vector3(0, 1, 0), 
        scene
      );
      light.intensity = 0.7;
      
      // Create a more complex geometry
      const knot = BABYLON.MeshBuilder.CreateTorusKnot(
        "knot", 
        {
          radius: 2, 
          tube: 0.5, 
          radialSegments: 128, 
          tubularSegments: 64, 
          p: 2, 
          q: 3
        }, 
        scene
      );
      
      // Create a material with custom shader
      const material = new BABYLON.StandardMaterial("material", scene);
      material.diffuseColor = new BABYLON.Color3.FromHexString("#5c2d91");
      material.specularColor = new BABYLON.Color3.FromHexString("#42a5f5");
      material.emissiveColor = new BABYLON.Color3.FromHexString("#3e1d61").scale(0.2);
      knot.material = material;
      
      // Add animation
      scene.registerBeforeRender(() => {
        knot.rotation.x += 0.002;
        knot.rotation.y += 0.003;
      });
      
      // Create particles for background effect
      const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
      particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", scene);
      particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
      particleSystem.minEmitBox = new BABYLON.Vector3(-10, -10, -10);
      particleSystem.maxEmitBox = new BABYLON.Vector3(10, 10, 10);
      particleSystem.color1 = new BABYLON.Color4(0.7, 0.5, 1.0, 0.1);
      particleSystem.color2 = new BABYLON.Color4(0.3, 0.5, 0.7, 0.2);
      particleSystem.minSize = 0.1;
      particleSystem.maxSize = 0.3;
      particleSystem.minLifeTime = 8.0;
      particleSystem.maxLifeTime = 16.0;
      particleSystem.emitRate = 50;
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
      particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
      particleSystem.minAngularSpeed = -0.1;
      particleSystem.maxAngularSpeed = 0.1;
      particleSystem.minEmitPower = 0.5;
      particleSystem.maxEmitPower = 1.0;
      particleSystem.updateSpeed = 0.005;
      particleSystem.start();
      
      return scene;
    };
    
    const scene = createScene();
    
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    const handleResize = () => {
      engine.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      scene.dispose();
    };
  }, []);
  
  return (
    <div className="babylon-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BabylonScene;
