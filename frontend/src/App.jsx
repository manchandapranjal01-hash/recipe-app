import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';

// Auth Pages
import AdminLogin from './stitch_pages/AdminLogin';
import UserRegistration from './stitch_pages/UserRegistration';

// User Pages
import DiscoverRecommend from './stitch_pages/DiscoverRecommend';
import RecipeDetailText from './stitch_pages/RecipeDetailText';
import SearchCookbook from './stitch_pages/SearchCookbook';
import GroceryFinder from './stitch_pages/GroceryFinder';
import GiveReview from './stitch_pages/GiveReview';
import AddNewRecipe from './stitch_pages/AddNewRecipe';
import UserProfile from './stitch_pages/UserProfile';

// Admin Pages
import AdminDashboard from './stitch_pages/AdminDashboard';
import ManageIngredients from './stitch_pages/ManageIngredients';
import ManageRecipes from './stitch_pages/ManageRecipes';
import ManageGroceryStores from './stitch_pages/ManageGroceryStores';
import UserDetails from './stitch_pages/UserDetails';
import AdminProfile from './stitch_pages/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth - full screen */}
          <Route path="/" element={<AdminLogin />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<UserRegistration />} />

          {/* User routes - shared bottom nav */}
          <Route element={<UserLayout />}>
            <Route path="/discoverrecommend" element={<DiscoverRecommend />} />
            <Route path="/searchcookbook" element={<SearchCookbook />} />
            <Route path="/groceryfinder" element={<GroceryFinder />} />
            <Route path="/addnewrecipe" element={<AddNewRecipe />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/givereview" element={<GiveReview />} />
            <Route path="/givereview/:recipeId" element={<GiveReview />} />
          </Route>

          {/* Recipe detail - separate (no bottom nav overlapping long content) */}
          <Route path="/recipe/:id" element={<RecipeDetailText />} />

          {/* Admin routes - shared sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="recipes" element={<ManageRecipes />} />
            <Route path="ingredients" element={<ManageIngredients />} />
            <Route path="stores" element={<ManageGroceryStores />} />
            <Route path="users" element={<UserDetails />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
