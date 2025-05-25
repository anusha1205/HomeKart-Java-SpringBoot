import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/auth/Profile';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import Cart from './pages/customer/Cart';
import Favourites from './pages/customer/Favourites';
import Orders from './pages/customer/Orders';
import { ToastContainer } from 'react-toastify';
import ViewOrders from './pages/seller/ViewOrders';
import 'react-toastify/dist/ReactToastify.css';
import DeliveryOrders from './pages/delivery/DeliveryOrders';
import DeliveryHistory from './pages/delivery/DeliveryHistory';
import SellerOrderHistory from './pages/seller/SellerOrderHistory';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />


          {/* SELLERS */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add" element={<AddProduct />} />
          <Route path="/seller/edit/:id" element={<EditProduct />} />
          <Route path="/seller/orders" element={<ViewOrders />} />
          <Route path="/seller/history" element={<SellerOrderHistory />} />

          {/* CUSTOMERS */}
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/favourites" element={<Favourites />} />
          <Route path="/customer/orders" element={<Orders />} />

          {/* DELIVERY AGENTS */}
          <Route path="/delivery/orders" element={<DeliveryOrders />} />
          <Route path="/delivery/history" element={<DeliveryHistory />} />

        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2000} />


    </>
  );
}

export default App;
