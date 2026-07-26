import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Logo */}
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              Shop<span className="text-orange-500">Kart</span>
            </h2>

            <div className="mt-2 h-1 w-16 rounded-full bg-orange-500"></div>

            <p className="mt-6 leading-7 text-gray-400">
              Discover premium products at unbeatable prices with fast and
              secure delivery. We bring you quality products with a seamless
              shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-2 h-1 w-12 rounded-full bg-orange-500"></div>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/"
                  className="transition-all duration-300 hover:pl-2 hover:text-orange-500"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="transition-all duration-300 hover:pl-2 hover:text-orange-500"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition-all duration-300 hover:pl-2 hover:text-orange-500"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition-all duration-300 hover:pl-2 hover:text-orange-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white">
              Contact
            </h3>

            <div className="mt-2 h-1 w-12 rounded-full bg-orange-500"></div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition hover:border-orange-500">
                <Mail className="text-orange-500" size={20} />
                <a
                  href="mailto:support@shopkart.com"
                  className="hover:text-orange-500"
                >
                  support@shopkart.com
                </a>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition hover:border-orange-500">
                <Phone className="text-orange-500" size={20} />
                <a
                  href="tel:+919876543210"
                  className="hover:text-orange-500"
                >
                  +91 9876543210
                </a>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition hover:border-orange-500">
                <MapPin className="text-orange-500" size={20} />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">ShopKart</span>. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;