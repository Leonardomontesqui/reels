import { useState, useEffect } from "react";
import { usePopularProducts } from "@shopify/shop-minis-react";
import { BackgroundPaths } from "./components/ui/background-paths";

// Character Display Component
function CharacterDisplay({
  selectedHead,
  selectedTorso,
  selectedLegs,
  faces,
  torsoParts,
  legParts,
}: {
  selectedHead: number;
  selectedTorso: number;
  selectedLegs: number;
  faces: string[];
  torsoParts: string[];
  legParts: string[];
}) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        {/* Container for stacked LEGO parts */}
        <div className="relative w-48 h-64">
          {/* Head */}
          <img
            src={`/faces/${faces[selectedHead]}`}
            alt="LEGO Head"
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 z-30"
          />

          {/* Torso */}
          <img
            src={`/torso/${torsoParts[selectedTorso]}`}
            alt="LEGO Torso"
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-24 z-20"
          />

          {/* Legs */}
          <img
            src={`/legs/${legParts[selectedLegs]}`}
            alt="LEGO Legs"
            className="absolute top-20 left-1/2 transform -translate-x-1/2 w-20 h-28 z-10"
          />
        </div>
      </div>
    </div>
  );
}

// Hero Section Component
function HeroSection({ onStartCustomization }: { onStartCustomization: () => void }) {
  return (
    <BackgroundPaths
      title="MINIs Figure"
      buttonText="Create your MINI"
      onButtonClick={onStartCustomization}
    />
  );
}

// Character Customization Page
function CharacterCustomization({
  selectedHead,
  setSelectedHead,
  selectedTorso,
  setSelectedTorso,
  selectedLegs,
  setSelectedLegs,
  faces,
  torsoParts,
  legParts,
  onNext,
  onBack,
}: {
  selectedHead: number;
  setSelectedHead: (value: number) => void;
  selectedTorso: number;
  setSelectedTorso: (value: number) => void;
  selectedLegs: number;
  setSelectedLegs: (value: number) => void;
  faces: string[];
  torsoParts: string[];
  legParts: string[];
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-white pb-6">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-8">
        <button 
          onClick={onBack}
          className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold"
        >
          ←
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Next
        </button>
      </div>

      {/* Character Preview */}
      <CharacterDisplay
        selectedHead={selectedHead}
        selectedTorso={selectedTorso}
        selectedLegs={selectedLegs}
        faces={faces}
        torsoParts={torsoParts}
        legParts={legParts}
      />

      {/* Selection Sections */}
      <div className="px-4 space-y-6">
        {/* Head Selection */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Head</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {faces.map((face, index) => (
              <button
                key={index}
                onClick={() => setSelectedHead(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                  selectedHead === index
                    ? "border-purple-600 border-4 shadow-lg"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={`/faces/${face}`}
                  alt={`Face ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Torso Selection */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Torso</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {torsoParts.map((torso, index) => (
              <button
                key={index}
                onClick={() => setSelectedTorso(index)}
                className={`flex-shrink-0 w-20 h-24 rounded-lg border-2 overflow-hidden ${
                  selectedTorso === index
                    ? "border-purple-600 border-4 shadow-lg"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={`/torso/${torso}`}
                  alt={`Torso ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Legs Selection */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Legs</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {legParts.map((legs, index) => (
              <button
                key={index}
                onClick={() => setSelectedLegs(index)}
                className={`flex-shrink-0 w-20 h-28 rounded-lg border-2 overflow-hidden ${
                  selectedLegs === index
                    ? "border-purple-600 border-4 shadow-lg"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={`/legs/${legs}`}
                  alt={`Legs ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Selection Page
function ProductSelection({
  selectedHead,
  selectedTorso,
  selectedLegs,
  faces,
  torsoParts,
  legParts,
  onBack,
}: {
  selectedHead: number;
  selectedTorso: number;
  selectedLegs: number;
  faces: string[];
  torsoParts: string[];
  legParts: string[];
  onBack: () => void;
}) {
  const { products, loading, error } = usePopularProducts();
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: string | string[];
  }>({});

  // Helper function to categorize products
  const categorizeProduct = (product: any): string => {
    const title = product.title?.toLowerCase() || "";
    const productType = product.productType?.toLowerCase() || "";

    // Top (t-shirts, hoodies, etc)
    if (
      title.includes("t-shirt") ||
      title.includes("tshirt") ||
      title.includes("shirt") ||
      title.includes("tee") ||
      title.includes("hoodie") ||
      title.includes("sweater") ||
      title.includes("sweatshirt") ||
      title.includes("jacket") ||
      title.includes("blazer") ||
      title.includes("cardigan") ||
      title.includes("vest") ||
      title.includes("tank") ||
      title.includes("blouse") ||
      title.includes("top") ||
      productType.includes("shirt") ||
      productType.includes("top") ||
      productType.includes("sweater") ||
      productType.includes("hoodie")
    ) {
      return "Top";
    }

    // Bottom (pants, shorts)
    if (
      title.includes("pants") ||
      title.includes("jeans") ||
      title.includes("shorts") ||
      title.includes("trousers") ||
      title.includes("leggings") ||
      title.includes("joggers") ||
      title.includes("sweatpants") ||
      title.includes("chinos") ||
      title.includes("skirt") ||
      title.includes("bottom") ||
      productType.includes("pants") ||
      productType.includes("shorts") ||
      productType.includes("bottom") ||
      productType.includes("jeans")
    ) {
      return "Bottom";
    }

    // Headwear (hats)
    if (
      title.includes("hat") ||
      title.includes("cap") ||
      title.includes("beanie") ||
      title.includes("helmet") ||
      title.includes("headband") ||
      title.includes("visor") ||
      title.includes("beret") ||
      title.includes("headwear") ||
      productType.includes("hat") ||
      productType.includes("cap") ||
      productType.includes("headwear")
    ) {
      return "Headwear";
    }

    // Accessories (hand bags, glasses, rackets, golf club, hockey sticks)
    if (
      title.includes("bag") ||
      title.includes("handbag") ||
      title.includes("purse") ||
      title.includes("backpack") ||
      title.includes("tote") ||
      title.includes("wallet") ||
      title.includes("glasses") ||
      title.includes("sunglasses") ||
      title.includes("eyewear") ||
      title.includes("racket") ||
      title.includes("racquet") ||
      title.includes("golf club") ||
      title.includes("golf") ||
      title.includes("hockey stick") ||
      title.includes("hockey") ||
      title.includes("stick") ||
      title.includes("belt") ||
      title.includes("watch") ||
      title.includes("jewelry") ||
      title.includes("necklace") ||
      title.includes("bracelet") ||
      title.includes("ring") ||
      title.includes("earring") ||
      title.includes("scarf") ||
      title.includes("gloves") ||
      productType.includes("accessory") ||
      productType.includes("jewelry") ||
      productType.includes("bag") ||
      productType.includes("sport") ||
      productType.includes("equipment")
    ) {
      return "Accessories";
    }

    return "Other";
  };

  // Group products by categories
  const groupedProducts =
    products?.reduce((groups: { [key: string]: any[] }, product: any) => {
      const category = categorizeProduct(product);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
      return groups;
    }, {}) || {};

  // Add local accessories to the Accessories category
  const localAccessories = [
    {
      id: "local-marcjacobsbag",
      title: "Marc Jacobs Designer Handbag",
      featuredImage: {
        url: "/accesories/marcjacobsbag.webp",
      },
      price: {
        amount: "295.00",
      },
    },
  ];

  // Add local accessories to the grouped products
  if (groupedProducts.Accessories) {
    groupedProducts.Accessories = [
      ...groupedProducts.Accessories,
      ...localAccessories,
    ];
  } else {
    groupedProducts.Accessories = localAccessories;
  }

  // Create a linear list of selected image URLs for API calls
  const getSelectedImages = (): string[] => {
    const selectedImages: string[] = [];

    // Add LEGO face only (not torso or legs)
    selectedImages.push(`/faces/${faces[selectedHead]}`);

    // Add selected products from all categories
    Object.entries(selectedProducts).forEach(([category, selection]) => {
      if (category === "Accessories") {
        // Handle multiple accessories
        const selectedAccessoryIds = (selection as string[]) || [];
        const allAccessories = [
          ...(products?.filter((p) => categorizeProduct(p) === "Accessories") ||
            []),
          ...localAccessories,
        ];

        selectedAccessoryIds.forEach((accessoryId) => {
          const accessory = allAccessories.find(
            (acc) => acc.id === accessoryId
          );
          if (accessory && accessory.featuredImage?.url) {
            selectedImages.push(accessory.featuredImage.url);
          }
        });
      } else {
        // Handle single selections for Top, Bottom, Headwear
        const productId = selection as string;
        if (productId) {
          const allProducts = products || [];
          const product = allProducts.find((p) => p.id === productId);
          if (product && product.featuredImage?.url) {
            selectedImages.push(product.featuredImage.url);
          }
        }
      }
    });

    return selectedImages;
  };

  // Get the current list of selected images (this updates when selections change)
  const selectedImagesList = getSelectedImages();

  // Log the selected images for debugging/development use
  console.log("Selected Images List:", selectedImagesList);

  const handleProductSelect = (productType: string, productId: string) => {
    setSelectedProducts((prev) => {
      if (productType === "Accessories") {
        const currentAccessories = (prev[productType] as string[]) || [];

        // If already selected, remove it
        if (currentAccessories.includes(productId)) {
          return {
            ...prev,
            [productType]: currentAccessories.filter((id) => id !== productId),
          };
        }

        // If less than 2 selected, add it
        if (currentAccessories.length < 2) {
          return {
            ...prev,
            [productType]: [...currentAccessories, productId],
          };
        }

        // If 2 already selected, replace the first one
        return {
          ...prev,
          [productType]: [currentAccessories[1], productId],
        };
      } else {
        // For other categories, single selection
        return {
          ...prev,
          [productType]: productId,
        };
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading products</p>
          <button
            onClick={onBack}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-6">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-8">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold"
        >
          ←
        </button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
          Complete
        </button>
      </div>

      {/* Character Preview */}
      <CharacterDisplay
        selectedHead={selectedHead}
        selectedTorso={selectedTorso}
        selectedLegs={selectedLegs}
        faces={faces}
        torsoParts={torsoParts}
        legParts={legParts}
      />

      {/* Selected Images Summary */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Selected Items ({selectedImagesList.length})
        </h2>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {selectedImagesList.map((imageUrl, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 h-16 border-2 border-green-500 rounded-lg overflow-hidden"
            >
              <img
                src={imageUrl}
                alt={`Selected item ${index + 1}`}
                className="w-full h-full object-cover"
                title={imageUrl}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Choose Your Products
        </h2>

        {["Top", "Bottom", "Accessories"]
          .filter((productType) => groupedProducts[productType] && groupedProducts[productType].length > 0)
          .map((productType) => {
            const typeProducts = groupedProducts[productType];
            return (
            <div key={productType}>
              <h3 className="text-xl font-bold text-gray-800 mb-3 capitalize">
                {productType}
                {productType === "Accessories" && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Select up to 2) -{" "}
                    {((selectedProducts[productType] as string[]) || []).length}
                    /2 selected
                  </span>
                )}
              </h3>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {typeProducts.map((product: any) => {
                  const isSelected =
                    productType === "Accessories"
                      ? (
                          (selectedProducts[productType] as string[]) || []
                        ).includes(product.id)
                      : selectedProducts[productType] === product.id;

                  return (
                    <button
                      key={product.id}
                      onClick={() =>
                        handleProductSelect(productType, product.id)
                      }
                      className={`flex-shrink-0 w-32 h-40 rounded-lg border-2 overflow-hidden bg-white ${
                        isSelected
                          ? "border-purple-600 border-4 shadow-lg"
                          : "border-gray-300"
                      }`}
                    >
                      {product.featuredImage && (
                        <img
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="w-full h-24 object-cover"
                        />
                      )}
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-800 line-clamp-2">
                          {product.title}
                        </p>
                        {product.price && (
                          <p className="text-xs text-gray-600 mt-1">
                            ${product.price.amount}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function App() {
  // Asset arrays based on actual file names in public folder
  const faces = ["Faces.png", "Faces-1.png", "Faces-2.png"];

  const torsoParts = [
    "Property 1=Martial Arts Gi (Custom Colour Belt) - Custom Design Minifigure Torso, Property 2=Soccer Shirt - Custom Design Minifigure Torso.png",
    "Property 1=Rose Maxi Dress Torso - CUSTOM DESIGN MINIFIGURE TORSO, Property 2=Soccer Shirt - Custom Design Minifigure Torso.png",
    "Property 1=Spotty Maxi Dress Torso - Custom Design Minifigure Torso, Property 2=Soccer Shirt - Custom Design Minifigure Torso.png",
  ];

  const legParts = [
    "Property 1=Container.png",
    "Property 1=Blue Grey Jeans - Custom Printed Minifigure Legs.png",
    "Property 1=Blue Grey Legs - LEGO Minifigure Legs.png",
    "Property 1=Light Grey Legs - LEGO Minifigure Legs.png",
    "Property 1=Light Tan Chinos With White Tennis Shoes - Custom Printed Minifigure Legs.png",
  ];

  // State for selected parts
  const [selectedHead, setSelectedHead] = useState(0);
  const [selectedTorso, setSelectedTorso] = useState(0);
  const [selectedLegs, setSelectedLegs] = useState(0);

  // State for current page: 'hero', 'character', or 'products'
  const [currentPage, setCurrentPage] = useState("hero");

  const handleStartCustomization = () => {
    setCurrentPage("character");
  };

  const handleCharacterNext = () => {
    setCurrentPage("products");
  };

  const handleCharacterBack = () => {
    setCurrentPage("hero");
  };

  const handleProductsBack = () => {
    setCurrentPage("character");
  };

  // Render the appropriate page based on current state
  if (currentPage === "hero") {
    return <HeroSection onStartCustomization={handleStartCustomization} />;
  }

  if (currentPage === "products") {
    return (
      <ProductSelection
        selectedHead={selectedHead}
        selectedTorso={selectedTorso}
        selectedLegs={selectedLegs}
        faces={faces}
        torsoParts={torsoParts}
        legParts={legParts}
        onBack={handleProductsBack}
      />
    );
  }

  return (
    <CharacterCustomization
      selectedHead={selectedHead}
      setSelectedHead={setSelectedHead}
      selectedTorso={selectedTorso}
      setSelectedTorso={setSelectedTorso}
      selectedLegs={selectedLegs}
      setSelectedLegs={setSelectedLegs}
      faces={faces}
      torsoParts={torsoParts}
      legParts={legParts}
      onNext={handleCharacterNext}
      onBack={handleCharacterBack}
    />
  );
}
