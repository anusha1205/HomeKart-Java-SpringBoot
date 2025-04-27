import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/auth/Profile';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
// import SellerDashboard from './pages/seller/SellerDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        
        {/* // Later we'll create AddProduct.js and SellerOrders.js */}

        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/add" element={<AddProduct />} />
        <Route path="/seller/edit/:id" element={<EditProduct />} />

      </Routes>
    </Router>
  );
}

export default App;
