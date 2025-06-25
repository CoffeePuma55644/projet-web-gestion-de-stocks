// --- DONNÉES (Utiliser localStorage pour la persistance) ---
let stock = JSON.parse(localStorage.getItem("stockData")) || [
  // Données d'exemple initiales si localStorage est vide
  {
    id: Date.now() + 1,
    name: "PlayStation 5 Pro",
    quantity: 20,
    price: 799.99,
    image:
      "https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-dualsense-image-block-01-en-16aug24",
  },
  {
    id: Date.now() + 2,
    name: "Xbox Series X",
    quantity: 15,
    price: 499.99,
    image:
      "https://static.actu.fr/uploads/2020/02/xbox-series-x-fond-blanc-1.jpg",
  },
  {
    id: Date.now() + 3,
    name: "Nintendo Switch 2",
    quantity: 30,
    price: 499.99,
    image:
      "https://static-images.lpnt.fr/cd-cw809/images/2025/01/16/27224744lpw-27224953-mega-une-jpg_10784927.jpg",
  },
];

let salesToday = JSON.parse(localStorage.getItem("salesTodayData")) || [];

// Sauvegarder les données dans localStorage
const saveData = () => {
  localStorage.setItem("stockData", JSON.stringify(stock));
  localStorage.setItem("salesTodayData", JSON.stringify(salesToday));
};

const getStock = () => stock;
const getSalesToday = () => salesToday;

const setStock = (newStock) => {
  stock = newStock;
};

const addSale = (sale) => {
  salesToday.push(sale);
};

const addItem = (item) => {
  stock.push(item);
};

const updateItem = (updatedItem) => {
  stock = stock.map((item) =>
    item.id === updatedItem.id ? { ...item, ...updatedItem } : item
  );
};

const deleteItem = (itemId) => {
  stock = stock.filter((item) => item.id !== itemId);
};

const findItem = (itemId) => {
  return stock.find((item) => item.id === itemId);
};

export {
  getStock,
  getSalesToday,
  saveData,
  setStock,
  addSale,
  addItem,
  updateItem,
  deleteItem as deleteItemFromState,
  findItem,
};
