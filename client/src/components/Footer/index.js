import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        {location.pathname !== '/' && (
          <button
            className="btn btn-dark mb-3"
            onClick={() => navigate(-1)}
          >
            &larr; Go Back
          </button>
        )}
        <h4>
          Contact us
        </h4>
        <h5>
          Email: cscreche@gmail.com
        </h5>
        <h5>
          Facebook: <Link to='https://www.facebook.com/cscreche?mibextid=2JQ9oc'>Light of the World Christmas Experience</Link>
        </h5>
        <h5>
          Share: Download Creche Invitation
        </h5>
      </div>
    </footer>
  );
};

export default Footer;
