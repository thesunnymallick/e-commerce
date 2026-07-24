// productApi.ts
// Small API helper for product CRUD. Adjust BASE_URL / paths to match your backend.

const BASE_URL = "/api"; // e.g. "http://localhost:5000/api" if not proxied

export interface Product {
  _id: string;
  ProductName: string;
  Description: string;
  Price: number;
  Category: string;
  ImageUrl?: string;
}

export interface NewProductInput {
  ProductName: string;
  Description: string;
  Price: string; // kept as string from the form input, converted on submit
  Category: string;
  ImageFile: File | null;
}

// GET all products
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.products ?? data;
}

// POST a new product as multipart/form-data — mirrors the Postman request:
// ProductName, Description, Price, Category, ImageFile
export async function addProduct(input: NewProductInput): Promise<Product> {
  const formData = new FormData();
  formData.append("ProductName", input.ProductName);
  formData.append("Description", input.Description);
  formData.append("Price", input.Price);
  formData.append("Category", input.Category);

  if (input.ImageFile) {
    formData.append("ImageFile", input.ImageFile);
  }

  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    credentials: "include",
    // NOTE: do NOT set a Content-Type header manually — the browser sets the
    // correct multipart boundary automatically when the body is a FormData.
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add product");
  }

  const data = await res.json();
  return data.product ?? data;
}

// DELETE a product by id
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
}