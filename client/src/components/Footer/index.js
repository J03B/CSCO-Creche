import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="w-100 mt-auto bg-secondary">
      <div className="text-center">
        {location.pathname !== "/" && (
          <Button
            variant="outlined"
            sx={{ mb: 5, bgcolor: "text.secondary", color: "black" }}
            onClick={() => navigate(-1)}
          >
            &larr; Go Back
          </Button>
        )}
        <Box
          sx={{
            p: 2,
            '&:hover': {
              backgroundColor: 'black',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          <Typography variant="h4">Contact us</Typography>
          <Typography variant="h6">
            <EmailIcon /> Email:{" "}
            <a href="mailto:cscreche@gmail.com">cscreche@gmail.com</a>
          </Typography>
          <Typography variant="h6">
            <FacebookIcon /> Facebook:{" "}
            <a rel="noreferrer" target="_blank" href="https://www.facebook.com/cscreche?mibextid=2JQ9oc">
              Light of the World Christmas Experience
            </a>
          </Typography>
          <Typography variant="h6">
            <ShareIcon /> Share:{" "}
            <a
              href={require("./christmasExperienceInvitation-2022.jpg")}
              download
            >
              Download Creche Invitation
            </a>
          </Typography>
          <Typography variant="h6">
            <LocationOnIcon /> Event Location:{" "}
            <a rel="noreferrer" target="_blank" href={"https://maps.app.goo.gl/mbuHCrEh8C4BMDGc9"}>
              {" "}
              The Church of Jesus Christ of Latter-day Saints: 8710 Lexington
              Drive, Colorado Springs{" "}
            </a>
          </Typography>
        </Box>
      </div>
    </footer>
  );
};

export default Footer;
