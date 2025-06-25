import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { usePopularProducts, ProductCard } from "@shopify/shop-minis-react";

// Simple rotating box to test if Three.js is working
function TestBox() {
  const meshRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
}

// LEGO Figure Component - Simplified
function LEGOFigure({ selectedProduct }: { selectedProduct: any }) {
  const meshRef = useRef<any>(null);
  
  // Rotate the figure slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.8, 8]} />
        <meshStandardMaterial color="#FFDC5D" />
      </mesh>
      
      {/* Face dots */}
      <mesh position={[-0.2, 1.9, 0.55]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 1.9, 0.55]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 1.7, 0.55]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Torso - Simple colored version for now */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.6, 8]} />
        <meshStandardMaterial color={selectedProduct ? "#E74C3C" : "#E74C3C"} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.9, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#FFDC5D" />
      </mesh>
      <mesh position={[0.9, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#FFDC5D" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.3, -0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.4, 8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.3, -0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.4, 8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.3, -1.2, 0.2]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, -1.2, 0.2]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Product selector component
function ProductSelector({ products, selectedProduct, onSelectProduct }: {
  products: any[];
  selectedProduct: any;
  onSelectProduct: (product: any) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 text-center">Select a T-Shirt</h3>
      <div className="grid grid-cols-1 gap-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className={`p-2 rounded-lg border-2 transition-all ${
              selectedProduct?.id === product.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              {product.images?.[0]?.url && (
                <img 
                  src={product.images[0].url} 
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="text-left flex-1">
                <p className="font-medium text-sm">{product.title}</p>
                <p className="text-xs text-gray-500">{product.vendor}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function App() {
  const { products, loading, error } = usePopularProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showTestBox, setShowTestBox] = useState(false);

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
  React.useEffect(() => {
    if (tShirts.length > 0 && !selectedProduct) {
      setSelectedProduct(tShirts[0]);
    }
  }, [tShirts, selectedProduct]);

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
          Lego Avatar
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Select a t-shirt to see it on our LEGO figure!
        </p>
        
        {/* Debug Toggle */}
        <div className="text-center mb-4">
          <button 
            onClick={() => setShowTestBox(!showTestBox)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          >
            {showTestBox ? 'Show LEGO Figure' : 'Show Test Box'}
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="px-4 pb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Products loaded: {products?.length || 0}</p>
          <p>T-shirts found: {tShirts.length}</p>
          <p>Selected product: {selectedProduct?.title || 'None'}</p>
          <p>Show test box: {showTestBox ? 'Yes' : 'No'}</p>
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
                  camera={{ position: [0, 0, 4], fov: 50 }}
                  style={{ background: '#f0f0f0' }}
                >
                  <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    
                    {/* Show either test box or LEGO figure */}
                    {showTestBox ? (
                      <TestBox />
                    ) : (
                      <LEGOFigure selectedProduct={selectedProduct} />
                    )}
                    
                    {/* Controls */}
                    <OrbitControls 
                      enableZoom={true}
                      enablePan={false}
                      minDistance={2}
                      maxDistance={8}
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI - Math.PI / 6}
                    />
                  </Suspense>
                </Canvas>
                
                {/* Instructions overlay */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
                  🖱️ Drag to rotate • 🔍 Scroll to zoom
                </div>
                
                {/* Canvas Info */}
                <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 px-3 py-2 rounded text-xs">
                  Canvas: {showTestBox ? 'Test Box' : 'LEGO Figure'}
                </div>
              </div>
            </div>

            {/* Product Selector */}
            <ProductSelector 
              products={tShirts}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <ProductCard product={selectedProduct} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
