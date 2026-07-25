// Categories.tsx
import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, Tag } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "../../constant";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CategoryModal, { type CategoryFormData } from "./CategoryModal";


interface Category {
  id: number;
  categoryName: string;
}

const Categories = () => {
  const token = useSelector((state: any) => state.auth.token);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchCategories = async () => {
    try {
      const { data, status } = await axios.get(`${BASE_API_URL}/api/Category/all`, {
        headers: authHeaders,
      });
      if (status === 200 || status === 201) {
        setCategories(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode("edit");
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      if (modalMode === "add") {
        const { data } = await axios.post(
          `${BASE_API_URL}/api/Category`,
          formData,
          { headers: authHeaders }
        );
        toast.success(data?.message || "Category added successfully!");
      } else if (editingCategory) {
        // PUT /api/Category — id goes in the body, per your API
        const { data } = await axios.put(
          `${BASE_API_URL}/api/Category`,
          { id: editingCategory.id, ...formData },
          { headers: authHeaders }
        );
        toast.success(data?.message || "Category updated successfully!");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
      console.log(error?.response?.data || error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;

    try {
      setDeletingId(id);
      const { data } = await axios.delete(`${BASE_API_URL}/api/Category/${id}`, {
        headers: authHeaders,
      });
      toast.success(data?.message || "Category deleted successfully!");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete category.");
      console.log(error?.response?.data || error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm sm:max-w-sm">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Category
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="transition hover:bg-orange-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <Tag size={18} />
                      </div>
                      <span className="font-medium text-gray-800">
                        {category.categoryName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        {deletingId === category.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-12 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        mode={modalMode}
        initialData={editingCategory}
      />
    </div>
  );
};

export default Categories;