const BASE_URL = "http://192.168.0.31:3000/api"; // do make sure to include your IP address here

export const api = {
  jobs: {
    getAll: async (page = 1, limit = 20) => {
      const response = await fetch(
        `${BASE_URL}/jobs?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },

    // New endpoints for categories
    getCategories: async () => {
      const response = await fetch(`${BASE_URL}/jobs/categories`);
      if (!response.ok) throw new Error("Failed to fetch job categories");
      return response.json();
    },

    getCategoryDetail: async (categoryName) => {
      const response = await fetch(
        `${BASE_URL}/jobs/categories/${encodeURIComponent(categoryName)}`
      );
      if (!response.ok) throw new Error("Failed to fetch category details");
      return response.json();
    },
  },
};
