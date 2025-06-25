import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { usePopularProducts, ProductCard, useCurrentUser } from "@shopify/shop-minis-react";
import * as THREE from 'three';



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
function LEGOMinifig({ selectedProduct, autoFit }: { selectedProduct: any; autoFit: boolean }) {
  const meshRef = useRef<any>(null);
  
  // Load the GLB model
  const { scene } = useGLTF('/models/minifig.glb');
  
  // Clone the scene to avoid sharing issues
  const clonedScene = scene.clone();

  if (autoFit) {
    return (
      <CameraFitter>
        <group ref={meshRef}>
          <primitive object={clonedScene} />
        </group>
      </CameraFitter>
    );
  }

  return (
    <Center>
      <group ref={meshRef} scale={[2, 2, 2]}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

export function App() {
  const { products, loading, error } = usePopularProducts();
  const { currentUser, loading: userLoading, error: userError } = useCurrentUser();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [autoFit, setAutoFit] = useState(true);

  // Filter for t-shirts and clothing items
  const tShirts = products?.filter((product: any) => {
    const title = product.title?.toLowerCase() || '';
    const productType = product.productType?.toLowerCase() || '';
    return (
      title.includes('t-shirt') || 
      title.includes('tshirt') || 
      title.includes('shirt') ||
      title.includes('tee') ||
      productType.includes('shirt') ||
      productType.includes('apparel') ||
      productType.includes('clothing')
    );
  }) || [];

  // Auto-select first t-shirt when available

  // React.useEffect(() => {
  //   if (tShirts.length > 0 && !selectedProduct) {
  //     setSelectedProduct(tShirts[0]);
  //   }
  // }, [tShirts, selectedProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading awesome t-shirts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 p-8">
          <p className="text-lg mb-4">Error loading products: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="pt-8 px-4 pb-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        {currentUser?.displayName}'s Lego Avatar
        </h1>
      </div>

      {/* Debug Info */}
      <div className="px-4 pb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Popular Products loaded: {products?.length || 0}</p>
          <p>Selected product(s): {selectedProduct?.title || 'None'}</p>
          <p>Model path: /models/minifig.glb</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
        {tShirts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No t-shirts found in popular products</p>
            <p className="text-sm text-gray-400 mb-4">
              Showing all products instead:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {products?.slice(0, 4).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 3D Scene */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 relative border border-gray-200">
                <Canvas 
                  camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 1000 }}
                  style={{ background: '#f0f0f0' }}
                >
                  <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={1.2} />
                    <hemisphereLight color="#ffffff" groundColor="#444444" intensity={0.5} />
                    
                    {/* Show GLB model */}
                    <LEGOMinifig selectedProduct={selectedProduct} autoFit={autoFit} />
                    
                    {/* Controls */}
                    <OrbitControls 
                      makeDefault
                      enableZoom={true}
                      enablePan={true}
                      enableRotate={true}
                      zoomSpeed={0.5}
                      panSpeed={0.5}
                      rotateSpeed={0.5}
                    />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
