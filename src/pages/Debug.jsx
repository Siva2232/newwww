import React, { useState } from 'react';
import { useProducts } from '../Context/ProductContext';

export default function Debug() {
  const { heroBanners, setHeroBanners, shopCategories, setShopCategories } = useProducts();
  const [testBanner, setTestBanner] = useState({ title: '', description: '', image: '' });

  const handleAddTestBanner = () => {
    console.log('[Debug] Before adding banner - heroBanners:', heroBanners);
    const newBanner = {
      id: Date.now(),
      title: testBanner.title,
      description: testBanner.description,
      image: testBanner.image,
    };
    console.log('[Debug] New banner to add:', newBanner);
    setHeroBanners([...heroBanners, newBanner]);
    console.log('[Debug] setHeroBanners called');
    setTestBanner({ title: '', description: '', image: '' });
  };

  const handleAddTestCategory = () => {
    console.log('[Debug] Before adding category - shopCategories:', shopCategories);
    const newCategory = {
      id: Date.now(),
      name: testBanner.title,
      image: testBanner.image,
      link: `/category/${testBanner.title.toLowerCase().replace(/\s+/g, "-")}`,
    };
    console.log('[Debug] New category to add:', newCategory);
    setShopCategories([...shopCategories, newCategory]);
    console.log('[Debug] setShopCategories called');
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Page - Context Testing</h1>
      
      <div className="bg-blue-100 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Hero Banners</h2>
        <p className="mb-4">Count: {heroBanners.length}</p>
        <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(heroBanners, null, 2)}
        </pre>
      </div>

      <div className="bg-green-100 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Shop Categories</h2>
        <p className="mb-4">Count: {shopCategories.length}</p>
        <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(shopCategories, null, 2)}
        </pre>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Test Inputs</h2>
        <input
          type="text"
          placeholder="Title"
          value={testBanner.title}
          onChange={(e) => setTestBanner({ ...testBanner, title: e.target.value })}
          className="block w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={testBanner.description}
          onChange={(e) => setTestBanner({ ...testBanner, description: e.target.value })}
          className="block w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={testBanner.image}
          onChange={(e) => setTestBanner({ ...testBanner, image: e.target.value })}
          className="block w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleAddTestBanner}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Add Test Banner
        </button>
        <button
          onClick={handleAddTestCategory}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Test Category
        </button>
      </div>

      <div className="bg-purple-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Enter a title, description, and image URL</li>
          <li>Click "Add Test Banner" or "Add Test Category"</li>
          <li>Check browser console (F12) for debug logs</li>
          <li>Verify the count increases above</li>
          <li>Refresh page and check if data persists from localStorage</li>
        </ol>
      </div>
    </div>
  );
}
