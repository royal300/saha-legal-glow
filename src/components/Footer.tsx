import { Link } from "react-router-dom";
import { Scale, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="h-8 w-8 text-golden" />
              <div className="flex flex-col">
                <span className="text-golden font-playfair font-bold text-xl">
                  Advocate
                </span>
                <span className="text-white font-playfair text-sm -mt-1">
                  Rajkumar Saha
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Expert Legal Solutions with Trust & Integrity. Specializing in Criminal Law, Civil Law, Family Disputes, and Corporate Law.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-golden font-playfair font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-golden transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/book-appointment"
                  className="text-gray-300 hover:text-golden transition-colors text-sm"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-golden transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-golden font-playfair font-semibold text-lg mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-golden mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Barasat Court, Kolkata
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-golden flex-shrink-0" />
                <a
                  href="tel:+916290226200"
                  className="text-gray-300 hover:text-golden transition-colors text-sm"
                >
                  +91 6290226200
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-golden flex-shrink-0" />
                <a
                  href="mailto:karamit819@gmail.com"
                  className="text-gray-300 hover:text-golden transition-colors text-sm"
                >
                  karamit819@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-gray-300 hover:text-golden transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-golden transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-golden transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-golden transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-golden/20 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Advocate Rajkumar Saha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
