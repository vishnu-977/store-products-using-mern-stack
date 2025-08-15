import { create } from "zustand";

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api/products`;

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),

	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return { success: false, message: "Please fill in all fields." };
		}

		try {
			const res = await fetch(BASE_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newProduct),
			});

			if (!res.ok) throw new Error("Failed to create product");

			const data = await res.json();
			set((state) => ({ products: [...state.products, data.data] }));
			return { success: true, message: "Product created successfully" };
		} catch (error) {
			return { success: false, message: error.message };
		}
	},

	fetchProducts: async () => {
		try {
			const res = await fetch(BASE_URL);
			if (!res.ok) throw new Error("Failed to fetch products");

			const data = await res.json();
			set({ products: data.data });
		} catch (error) {
			console.error("Error fetching products:", error.message);
		}
	},

	deleteProduct: async (pid) => {
		try {
			const res = await fetch(`${BASE_URL}/${pid}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete product");

			const data = await res.json();
			set((state) => ({
				products: state.products.filter((product) => product._id !== pid),
			}));
			return { success: true, message: data.message };
		} catch (error) {
			return { success: false, message: error.message };
		}
	},

	updateProduct: async (pid, updatedProduct) => {
		try {
			const res = await fetch(`${BASE_URL}/${pid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedProduct),
			});
			if (!res.ok) throw new Error("Failed to update product");

			const data = await res.json();
			set((state) => ({
				products: state.products.map((product) =>
					product._id === pid ? data.data : product
				),
			}));
			return { success: true, message: data.message };
		} catch (error) {
			return { success: false, message: error.message };
		}
	},
}));
