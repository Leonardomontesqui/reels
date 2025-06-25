import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Grid } from '@react-three/drei';
import { useCurrentUser } from "@shopify/shop-minis-react";
import * as THREE from 'three';



// Background environment component
function BackgroundEnvironment() {
  return (
    <group>
      {/* Gradient background sphere */}
      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshBasicMaterial 
          color="#f8f9fa"
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Grid floor */}
      <Grid
        position={[0, -3, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#e9ecef"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#dee2e6"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      
      {/* Subtle ground plane for shadows */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// Camera positioning component based on model bounding box
function CameraFitter({ children }: { children: React.ReactNode }) {
  const { camera, controls } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [fitted, setFitted] = useState(false);

  useEffect(() => {
    if (groupRef.current && controls && !fitted) {
      // Wait a frame for the model to be fully loaded
      const timer = setTimeout(() => {
        if (!groupRef.current) return;
        
        // Calculate bounding box of the model
        const box = new THREE.Box3().setFromObject(groupRef.current);
        
        // Check if we have a valid bounding box
        if (box.isEmpty()) return;
        
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        // Only proceed if we have a reasonable size
        if (size === 0 || size > 1000) return;

        // Set control distances based on model size
        if ('maxDistance' in controls && 'minDistance' in controls) {
          (controls as any).maxDistance = size * 8;
          (controls as any).minDistance = size * 0.1;
        }

        // Set camera planes based on model size
        camera.near = Math.max(0.1, size / 100);
        camera.far = Math.min(2000, size * 100);
        camera.updateProjectionMatrix();

        // Position camera to view the model at optimal distance
        const distance = size * 1.5;
        camera.position.set(distance * 0.5, distance * 0.3, distance);
        camera.lookAt(center);

        // Update controls target to center of model
        if ('target' in controls) {
          (controls as any).target.copy(center);
          (controls as any).update();
        }

        setFitted(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [camera, controls, fitted]);

  return <group ref={groupRef}>{children}</group>;
}

// LEGO Minifig GLB Model Component
function LEGOMinifig({ autoFit }: { autoFit: boolean }) {
  const meshRef = useRef<any>(null);
  
  // Load the GLB model
  const { scene } = useGLTF('/models/minifig.glb');
  
  // Clone the scene to avoid sharing issues
  const clonedScene = scene.clone();

  if (autoFit) {
    return (
      <CameraFitter>
        <group ref={meshRef} position={[0, -2, 0]}>
          <primitive object={clonedScene} />
        </group>
      </CameraFitter>
    );
  }

  return (
    <Center>
      <group ref={meshRef} scale={[2, 2, 2]} position={[0, -2, 0]}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

export function App() {
  const { currentUser } = useCurrentUser();
  const [autoFit, setAutoFit] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const handleRefreshClick = () => {
    setShowAlert(true);
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };



    return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="pt-safe-top pt-12 px-6 pb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {currentUser?.displayName || 'Shams'}'s Lego Avatar
        </h1>
      </div>



      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        {/* 3D Scene */}
        <div className="w-full max-w-md">
          <div className="aspect-square relative">
            <Canvas 
              camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 1000 }}
              style={{ background: 'transparent' }}
            >
                              <Suspense fallback={null}>
                  {/* Background Environment */}
                  <BackgroundEnvironment />
                  
                  {/* Lighting */}
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[5, 5, 5]} intensity={1.0} />
                  <hemisphereLight color="#ffffff" groundColor="#f0f0f0" intensity={0.3} />
                  
                  {/* Show GLB model */}
                  <LEGOMinifig autoFit={autoFit} />
                
                {/* Controls */}
                <OrbitControls 
                  makeDefault
                  enableZoom={true}
                  enablePan={false}
                  enableRotate={true}
                  zoomSpeed={0.3}
                  rotateSpeed={0.4}
                  minDistance={2}
                  maxDistance={8}
                />
              </Suspense>
            </Canvas>
            
            {/* Refresh button */}
            <button 
              onClick={handleRefreshClick}
              className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          {/* Alert notification */}
          {showAlert && (
            <div className="mt-6 mx-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Avatar refreshed successfully! 
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Your LEGO avatar has been updated with the latest configuration.
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setShowAlert(false)}
                      className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
