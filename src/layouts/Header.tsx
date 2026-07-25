import {
    ShoppingCart,
    Heart,
    Search,
    User,
    Menu,
  } from "lucide-react";
import { useNavigate } from "react-router";
import CartIcon from "../components/CartIcons";
  
  const Header = () => {
    const navigation=useNavigate();


    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-2">
  
            <h1 className="text-2xl font-bold text-gray-800">
              Shop<span className="text-orange-500">Kart</span>
            </h1>
          </div>
  
  
          <div className="hidden w-[450px] items-center rounded-full border bg-gray-100 px-4 py-2 md:flex">
            <Search size={18} className="text-gray-500" />
  
            <input
              type="text"
              placeholder="Search products..."
              className="ml-3 w-full bg-transparent outline-none"
            />
          </div>
  
 
  
          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#" className="font-medium hover:text-orange-500">
              Home
            </a>
  
            <a href="#" className="font-medium hover:text-orange-500">
              Shop
            </a>
  
            <a href="#" className="font-medium hover:text-orange-500">
              Categories
            </a>
  
            <a href="#" className="font-medium hover:text-orange-500">
              Contact
            </a>
          </nav>
  
  
          <div className="flex items-center gap-5">
  
            <button>
              <Heart className="text-gray-700 hover:text-orange-500" />
            </button>
  
             <CartIcon/>
  
            <button>
              <User className="text-gray-700 hover:text-orange-500" />
            </button>
  
            <button className="lg:hidden">
              <Menu />
            </button>
  
          </div>
  
        </div>
      </header>
    );
  };
  
  export default Header;