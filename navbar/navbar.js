// components/Navbar.js

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="links">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/viewData">User Data</Link>
            </li>
            <li>
              <Link href="/viewBusinessDetails">Business</Link>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .navbar {
          background-color: yellow;
          color: #fff;
        }
        .container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 20px;
        }

        .logo a {
          font-size: 1.5rem;
          color: #fff;
          text-decoration: none;
        }
        .links ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .links ul li {
          display: inline;
          margin-right: 20px;
        }
        .links ul li a {
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
        }
        .links ul li a:hover {
          color: #ccc;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
