export function normalizePrice(price, quantity, unit) {
  // Convert everything to price per 100g or 1 unit
  let normalizedQuantity = parseFloat(quantity);
  let normalizedPrice = parseFloat(price);
  
  if (isNaN(normalizedQuantity) || isNaN(normalizedPrice)) return null;

  switch (unit.toLowerCase()) {
    case 'kg':
    case 'kilogram':
      return { unitString: 'per 100g', price: (normalizedPrice / (normalizedQuantity * 10)) }; // e.g. 1kg = 10 * 100g
    case 'g':
    case 'gram':
      return { unitString: 'per 100g', price: (normalizedPrice / (normalizedQuantity / 100)) };
    case 'l':
    case 'liter':
      return { unitString: 'per 100ml', price: (normalizedPrice / (normalizedQuantity * 10)) };
    case 'ml':
      return { unitString: 'per 100ml', price: (normalizedPrice / (normalizedQuantity / 100)) };
    default:
      // pieces, bunches, etc
      return { unitString: 'per unit', price: (normalizedPrice / normalizedQuantity) };
  }
}

export function getBestStore(ingredientName, storesList, userUpdates = {}) {
  // storesList: array of { storeId, storeName, price, quantity, unit }
  // userUpdates: from context userPriceUpdates (ingredientName -> updateObj)

  let best = null;
  let minNormalized = Infinity;

  // Let's mix in user updates if they exist for this ingredient
  const customUpdate = userUpdates[ingredientName];

  storesList.forEach(store => {
    // If the user has updated the price for this specific store and ingredient, use it
    let currentPrice = store.price;
    if (customUpdate && customUpdate.storeId === store.storeId) {
       currentPrice = customUpdate.price;
    }

    const norm = normalizePrice(currentPrice, store.quantity, store.unit);
    if (norm && norm.price < minNormalized) {
        minNormalized = norm.price;
        best = {
            ...store,
            price: currentPrice,
            normalizedPrice: norm.price,
            normalizedUnit: norm.unitString,
            isUserUpdated: !!(customUpdate && customUpdate.storeId === store.storeId)
        };
    }
  });

  return best;
}
