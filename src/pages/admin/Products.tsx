import { useEffect, useState } from "react";
import { Plus, Search, Trash2, ImageOff, PackageX } from "lucide-react";
import AddProductModal, { type ProductFormData } from "./Addproductmodal";
import axios from "axios";
import { BASE_API_URL } from "../../constant";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Sample seed data so the page isn't empty — replace/remove once wired to a backend
const SAMPLE_PRODUCTS = [
  {
    // id: "1",
    ProductName: "Samsung A52s 5g",
    Description: "This is Samsung A52s 5g mobile",
    Price: "29000",
    Category: "Mobiles",
    imagePreview: null,
  },
  {
    // id: "2",
    ProductName: "MacBook Air M2",
    Description: "13-inch, 8GB RAM, 256GB SSD",
    Price: "104900",
    Category: "Laptops",
    imagePreview: null,
  },
];

const Products = () => {
  const token = useSelector((state: any) => state.auth.token);
  const [products, setProducts] = useState<[]>();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = async (product: ProductFormData) => {
    try {
      const formData = new FormData();

      formData.append("ProductName", product.ProductName);
      formData.append("Description", product.Description);
      formData.append("Price", product.Price);
      formData.append("Category", product.Category);

      if (product.image) {
        formData.append("ImageFile", product.image);
      }

      const { data } = await axios.post(
        `${BASE_API_URL}/api/Product/Add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data?.message || "Product added successfully!");

      fetchProducts();

      // Optional: Refresh product list here
      // fetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add product.");

      console.log(error.response?.data || error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await axios.get(`${BASE_API_URL}/api/Product/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (data?.status === 200 || data.status === 201) {
        setProducts(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleDelete = (id: string) => {
  //   setProducts((prev) => prev.filter((p) => p.id !== id));
  // };

  const filteredProducts = products?.filter((product: any) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store's product catalog
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm sm:max-w-sm">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Description
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredProducts?.length || 0 > 0 ? (
              filteredProducts?.map((product: any) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-orange-50/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                          <ImageOff size={18} />
                        </div>
                      )}

                      <span className="font-medium text-gray-800">
                        {product.productName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </td>

                  <td className="max-w-sm truncate px-6 py-4 text-gray-600">
                    {product.description}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500 hover:text-white">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default Products;
