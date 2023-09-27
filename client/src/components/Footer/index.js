import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";

import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        {location.pathname !== '/' && (
          <Button
          variant='outlined'
          sx={{ mb: 5, bgcolor: 'text.secondary', color: 'black' }}
            onClick={() => navigate(-1)}
          >
            &larr; Go Back
          </Button>
        )}
        <h4>
          Contact us
        </h4>
        <h5>
          <EmailIcon /> Email: <a href="mailto:cscreche@gmail.com">cscreche@gmail.com</a>
        </h5>
        <h5>
          <FacebookIcon /> Facebook: <Link to='https://www.facebook.com/cscreche?mibextid=2JQ9oc'>Light of the World Christmas Experience</Link>
        </h5>
        <h5>
          <ShareIcon /> Share: <a href={require("./christmasExperienceInvitation-2022.jpg")} download>Download Creche Invitation</a>
        </h5>
        <h5>
          <LocationOnIcon /> Event Location: <Link to={"https://maps.app.goo.gl/mbuHCrEh8C4BMDGc9"}> The Church of Jesus Christ of Latter-day Saints: 
   8710 Lexington Drive, Colorado Springs  </Link>
        </h5>
      </div>
    </footer>
  );
};

export default Footer;
