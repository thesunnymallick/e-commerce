// import {
//     Facebook,
//     Instagram,
//     Twitter,
//     Linkedin,
//   } from "lucide-react";
  
  const Footer = () => {
    return (
      <footer className="mt-20 bg-gray-900 text-gray-300">
  
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
  
          {/* Logo */}
  
          <div>
            <h2 className="text-3xl font-bold text-white">
              Shop<span className="text-orange-500">Kart</span>
            </h2>
  
            <p className="mt-4 text-sm leading-7">
              Discover premium products at unbeatable prices with fast and
              secure delivery.
            </p>
          </div>
  
          {/* Quick Links */}
  
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>
  
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-orange-500">Home</a></li>
              <li><a href="#" className="hover:text-orange-500">Shop</a></li>
              <li><a href="#" className="hover:text-orange-500">About</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact</a></li>
            </ul>
          </div>
  
          {/* Customer */}
  
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Customer Service
            </h3>
  
            <ul className="space-y-3">
              <li>FAQs</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
  
          {/* Contact */}
  
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h3>
  
            <p>Email: support@shopkart.com</p>
            <p className="mt-2">Phone: +91 9876543210</p>
  
            {/* <div className="mt-6 flex gap-4">
              <Facebook className="cursor-pointer hover:text-orange-500" />
              <Instagram className="cursor-pointer hover:text-orange-500" />
              <Twitter className="cursor-pointer hover:text-orange-500" />
              <Linkedin className="cursor-pointer hover:text-orange-500" />
            </div> */}
          </div>
  
        </div>
  
        <div className="border-t border-gray-700 py-5 text-center text-sm">
          © {new Date().getFullYear()} ShopKart. All Rights Reserved.
        </div>
  
      </footer>
    );
  };
  
  export default Footer;