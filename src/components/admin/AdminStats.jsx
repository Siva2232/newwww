// // src/components/admin/AdminStats.jsx
// import { Package, Image as ImageIcon, Grid3X3, TrendingUp, Gift, BookOpen } from "lucide-react";

// export default function AdminStats({
//   productsCount,
//   bannersCount,
//   categoriesCount,
//   featuredCount,
//   offersCount,
// }) {
//   const stats = [
//     { icon: Package, color: "amber", count: productsCount, label: "Products" },
//     { icon: ImageIcon, color: "sky", count: bannersCount, label: "Banners" },
//     { icon: Grid3X3, color: "purple", count: categoriesCount, label: "Categories" },
//     { icon: TrendingUp, color: "emerald", count: featuredCount, label: "Featured" },
//     { icon: Gift, color: "orange", count: offersCount, label: "Offers" },
//     { icon: BookOpen, color: "indigo", count: "?", label: "Custom Books" },
//   ];

//   return (
//     <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
//       {stats.map((stat, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition"
//         >
//           <div className={`mx-auto mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-${stat.color}-100`}>
//             <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
//           </div>
//           <p className={`text-2xl font-bold text-${stat.color}-700 leading-tight`}>
//             {stat.count}
//           </p>
//           <p className="text-xs font-medium text-gray-500">{stat.label}</p>
//         </div>
//       ))}
//     </div>
//   );
// }