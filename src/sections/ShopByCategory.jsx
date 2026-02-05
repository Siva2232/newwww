// import { useProducts } from "../Context/ProductContext";
// import SectionTitle from "../components/common/SectionTitle";

// export default function ShopByCategory() {
//   const { shopCategories } = useProducts();

//   if (!shopCategories || shopCategories.length === 0) {
//     return (
//       <section className="py-16 bg-gray-50">
//         <SectionTitle
//           label="Shop by Category"
//           title="Selection made simple."
//           description="Browse our curated categories to find the perfect fit for your needs."
//           center
//         />
//         <div className="text-center text-gray-400 py-10 text-lg">No categories found.</div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 bg-gray-50">
//       <SectionTitle
//         label="Shop by Category"
//         title="Selection made simple."
//         description="Browse our curated categories to find the perfect fit for your needs."
//         center
//       />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-8">
//         {shopCategories.map((cat) => (
//           <div
//             key={cat._id || cat.id || cat.name}
//             className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center hover:shadow-lg transition-all cursor-pointer"
//           >
//             <img
//               src={cat.image || "/placeholder-category.jpg"}
//               alt={cat.name}
//               className="w-24 h-24 object-cover rounded-full mb-4 border border-gray-100"
//               onError={e => { e.target.src = "/placeholder-category.jpg"; }}
//             />
//             <h3 className="text-lg font-bold text-gray-800 mb-2">{cat.name}</h3>
//             {cat.description && (
//               <p className="text-gray-500 text-sm text-center">{cat.description}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
