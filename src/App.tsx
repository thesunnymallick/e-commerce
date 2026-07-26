import AppLayout from "./layouts/AppLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import AdminLayout from "./layouts/AdminLayout";
import Categories from "./pages/admin/Categories";
import ProductsList from "./pages/product/ProductsList";
import ProductDetails from "./pages/product/ProductDetails";
import CartPage from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import MyOrders from "./pages/orders/MyOrders";
import AdminOrders from "./pages/admin/AdminOrders";


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/product/:id" element={<ProductDetails/>} />
              <Route path="/cart" element={<CartPage/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<CheckoutSuccess />} />
              <Route path="/orders" element={<MyOrders />} />
            </Route>
            <Route element={<AdminRoute />}>
             <Route element={<AdminLayout/>}>
             <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/orders" element={<AdminOrders/>} />
              <Route path="/admin/Categories" element={<Categories/>} />
              {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
             </Route>
      
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          // theme="colored"
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
