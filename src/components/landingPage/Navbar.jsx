import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        flex items-center justify-between
        px-8 py-4
        bg-white/30 backdrop-blur-lg
        border-b border-white/20
        shadow-sm
      "
    >
      <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer">
        <a href="#herosection">
        Custofy CRM
        </a>
      </h1>

      <ul className="hidden md:flex gap-6 text-gray-800 font-medium">
        <li>
          <a href="#features" className="hover:text-indigo-600 transition">
            Features
          </a>
        </li>
        <li>
          <a href="#pricing" className="hover:text-indigo-600 transition">
            Pricing
          </a>
        </li>
        <li>
          <a href="#customers" className="hover:text-indigo-600 transition">
            Customers
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:text-indigo-600 transition">
            Contact
          </a>
        </li>
      </ul>
      <Link to="/login">
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer">
        Get Started
      </button>
      </Link>
    </nav>
  );
}
