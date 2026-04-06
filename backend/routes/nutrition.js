import express from 'express';

const router = express.express.Router ? express.Router() : express.Router();

router.post('/analyze', (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients array required' });
  }

  // Very basic mock calculation just to return some data to the UI
  // Real implementation would pass to Edamam API via fetch/axios
  let totalCalories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  ingredients.forEach(ing => {
    // Arbitrary rules for the mock
    const title = typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase();
    
    if (title.includes('chicken') || title.includes('dal') || title.includes('paneer')) {
      protein += 20;
      totalCalories += 150;
      fat += 5;
    } else if (title.includes('rice') || title.includes('flour') || title.includes('potato')) {
      carbs += 30;
      totalCalories += 130;
    } else if (title.includes('oil') || title.includes('butter') || title.includes('ghee')) {
      fat += 14;
      totalCalories += 120;
    } else {
      carbs += 5;
      totalCalories += 20; // veggies
    }
  });

  res.json({
    calories: totalCalories,
    totalNutrients: {
      PROCNT: { label: 'Protein', quantity: protein, unit: 'g' },
      CHOCDF: { label: 'Carbs', quantity: carbs, unit: 'g' },
      FAT: { label: 'Fat', quantity: fat, unit: 'g' },
    }
  });
});

export default router;
