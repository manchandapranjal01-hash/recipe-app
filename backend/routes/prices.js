import express from 'express';

const router = express.Router();

// Mock Price Data (INR)
const MOCK_PRICES = [
  { ingredient_id: 1, name: 'Tomato', storeName: 'BigBasket', basePrice: 40, baseQuantity: 1, baseUnit: 'kg' },
  { ingredient_id: 1, name: 'Tomato', storeName: 'Blinkit', basePrice: 22, baseQuantity: 500, baseUnit: 'g' },
  { ingredient_id: 1, name: 'Tomato', storeName: 'Local Market', basePrice: 35, baseQuantity: 1, baseUnit: 'kg' },
  { ingredient_id: 2, name: 'Onion', storeName: 'BigBasket', basePrice: 30, baseQuantity: 1, baseUnit: 'kg' },
  { ingredient_id: 2, name: 'Onion', storeName: 'Blinkit', basePrice: 18, baseQuantity: 500, baseUnit: 'g' },
  { ingredient_id: 3, name: 'Toor Dal', storeName: 'BigBasket', basePrice: 160, baseQuantity: 1, baseUnit: 'kg' },
  { ingredient_id: 3, name: 'Toor Dal', storeName: 'Blinkit', basePrice: 85, baseQuantity: 500, baseUnit: 'g' }
];

router.get('/mock-scrape', (req, res) => {
  const { ingredientId } = req.query;

  let results = MOCK_PRICES;
  if (ingredientId) {
    results = MOCK_PRICES.filter(p => p.ingredient_id === parseInt(ingredientId));
  }

  // Simulate network delay for realistic scraping feel
  setTimeout(() => {
    res.json(results);
  }, 1200);
});

export default router;
