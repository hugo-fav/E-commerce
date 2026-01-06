// src/lib/data.js

export const products = [
  {
    id: "1",
    name: "Classic Hoodie",
    price: 18000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "A comfortable classic hoodie made of premium cotton.",
    category: "Hoodies",
  },
  {
    id: "1.1",
    name: "Classic Hoodie",
    price: 18000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "A comfortable classic hoodie made of premium cotton.",
    category: "Hoodies",
  },
  {
    id: "1.2",
    name: "Classic Hoodie",
    price: 18000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "A comfortable classic hoodie made of premium cotton.",
    category: "Hoodies",
  },

  {
    id: "2",
    name: "Summer Dress",
    price: 25000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "Light and breezy summer dress.",
    category: "Dresses",
  },
  {
    id: "2.1",
    name: "Summer Dress",
    price: 25000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "Light and breezy summer dress.",
    category: "Dresses",
  },
  {
    id: "2.2",
    name: "Summer Dress",
    price: 25000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "Light and breezy summer dress.",
    category: "Dresses",
  },

  {
    id: "3",
    name: "Denim Jacket",
    price: 30000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "Stylish denim jacket with a modern fit.",
    category: "Jackets",
  },
  {
    id: "3.1",
    name: "Denim Jacket",
    price: 30000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "Stylish denim jacket with a modern fit.",
    category: "Jackets",
  },
  {
    id: "3.2",
    name: "Denim Jacket",
    price: 30000,
    images: [
      "/productimage/men1.jfif",
      "/productimage/men2.jfif",
      "/productimage/men3.jfif",
    ],
    description: "Stylish denim jacket with a modern fit.",
    category: "Jackets",
  },
];

export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

export const categories = [
  { id: "1", name: "Hoodies" },
  { id: "2", name: "Dresses" },
  { id: "3", name: "Jackets" },
];

export const getRelatedProducts = (category, currentProductId) => {
  return products.filter(
    (product) =>
      product.category === category && product.id !== currentProductId
  );
};
