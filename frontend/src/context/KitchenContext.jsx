import React, { createContext, useContext, useEffect, useReducer } from 'react';

// Initial state
const initialState = {
  pantry: [], // Array of { id, name, quantity, unit }
  cart: [], // Array of { id, name, quantity, unit, storeId }
  savedRecipes: [], // Array of recipe IDs
  activeFilters: [], // Array of string tags (e.g., 'Vegan', 'Keto')
  userPriceUpdates: {} // Map of ingredientId -> { price, timestamp, storeId }
};

// Actions
const ACTIONS = {
  ADD_TO_PANTRY: 'ADD_TO_PANTRY',
  REMOVE_FROM_PANTRY: 'REMOVE_FROM_PANTRY',
  UPDATE_PANTRY_ITEM: 'UPDATE_PANTRY_ITEM',
  TEST_ADD_CART: 'TEST_ADD_CART', // Can expand to full cart logic later
  TOGGLE_SAVED_RECIPE: 'TOGGLE_SAVED_RECIPE',
  TOGGLE_FILTER: 'TOGGLE_FILTER',
  ADD_PRICE_UPDATE: 'ADD_PRICE_UPDATE',
  RESTORE_STATE: 'RESTORE_STATE'
};

function kitchenReducer(state, action) {
  switch (action.type) {
    case ACTIONS.RESTORE_STATE:
      return { ...state, ...action.payload };
    
    case ACTIONS.ADD_TO_PANTRY:
      // If already exists, we might want to increase quantity instead, but keeping it simple
      if (state.pantry.find(item => item.id === action.payload.id)) return state;
      return { ...state, pantry: [...state.pantry, action.payload] };
      
    case ACTIONS.REMOVE_FROM_PANTRY:
      return { ...state, pantry: state.pantry.filter(item => item.id !== action.payload) };

    case ACTIONS.UPDATE_PANTRY_ITEM:
      return {
        ...state,
        pantry: state.pantry.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };

    case ACTIONS.TOGGLE_SAVED_RECIPE:
      const exists = state.savedRecipes.includes(action.payload);
      return {
        ...state,
        savedRecipes: exists 
          ? state.savedRecipes.filter(id => id !== action.payload)
          : [...state.savedRecipes, action.payload]
      };

    case ACTIONS.TOGGLE_FILTER:
      const filterExists = state.activeFilters.includes(action.payload);
      return {
        ...state,
        activeFilters: filterExists
          ? state.activeFilters.filter(f => f !== action.payload)
          : [...state.activeFilters, action.payload]
      };

    case ACTIONS.ADD_PRICE_UPDATE:
      return {
        ...state,
        userPriceUpdates: {
          ...state.userPriceUpdates,
          [action.payload.ingredientId]: {
            price: action.payload.price,
            timestamp: Date.now(),
            storeId: action.payload.storeId
          }
        }
      };

    default:
      return state;
  }
}

const KitchenContext = createContext();

export function KitchenProvider({ children }) {
  const [state, dispatch] = useReducer(kitchenReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('kitchenState');
    if (savedState) {
      try {
        dispatch({ type: ACTIONS.RESTORE_STATE, payload: JSON.parse(savedState) });
      } catch (e) {
        console.error("Failed to parse kitchen state from localStorage", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('kitchenState', JSON.stringify(state));
  }, [state]);

  // Sync to backend when back online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('App is online. Syncing local state with backend...');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // This endpoint needs to be implemented on the backend later
          await fetch(`${import.meta.env.VITE_API_URL}/api/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(state)
          });
          console.log('State synced successfully');
        }
      } catch (e) {
        console.error('Failed to sync state', e);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [state]);

  const value = {
    ...state,
    
    // Pantry actions
    addToPantry: (item) => dispatch({ type: ACTIONS.ADD_TO_PANTRY, payload: item }),
    removeFromPantry: (id) => dispatch({ type: ACTIONS.REMOVE_FROM_PANTRY, payload: id }),
    updatePantryItem: (item) => dispatch({ type: ACTIONS.UPDATE_PANTRY_ITEM, payload: item }),
    
    // Recipe actions
    toggleSavedRecipe: (id) => dispatch({ type: ACTIONS.TOGGLE_SAVED_RECIPE, payload: id }),
    
    // Filter actions
    toggleFilter: (filter) => dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: filter }),
    
    // Price actions
    addPriceUpdate: (updateObj) => dispatch({ type: ACTIONS.ADD_PRICE_UPDATE, payload: updateObj })
  };

  return (
    <KitchenContext.Provider value={value}>
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error('useKitchen must be used within a KitchenProvider');
  }
  return context;
}
