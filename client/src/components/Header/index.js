import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import Auth from "../../utils/auth";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const ismobile = window.innerWidth < 800;
        if (ismobile !== isMobile) setIsMobile(ismobile);
      },
      false
    );
  }, [isMobile]);

  return (
    <header className="bg-primary text-light flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          {isMobile ? (
            <>
              <Typography sx={{ mt: 2 }} variant="h5">
                <Link
                  className="text-light"
                  to="/"
                  style={{ textDecoration: "none" }}
                >
                  Colorado Springs Creche
                </Link>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Light of the World Christmas Experience
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h2">
                <Link
                  className="text-light"
                  to="/"
                  style={{ textDecoration: "none" }}
                >
                  Colorado Springs Creche
                </Link>
              </Typography>
              <Typography variant="h4" gutterBottom>
                Light of the World Christmas Experience
              </Typography>
            </>
          )}
        </div>
        <div>
          {Auth.loggedIn() ? (
            <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
              <Link className="text-dark" to="/me">
                {isMobile ? (
                  <Avatar
                    sx={{ bgcolor: '#90CAF9', opacity: 0.75 }}>
                    {Auth.getProfile().data.userName[0]}
                  </Avatar>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {Auth.getProfile().data.userName}'s profile
                  </Button>
                )}
              </Link>
              <Button variant="outlined" size="large" onClick={logout}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
              <Button variant="contained" size="large">
                <Link className="text-dark" to="/login">
                  Login
                </Link>
              </Button>
              <Button variant="outlined" size="large">
                <Link className="text-light" to="/signup">
                  Signup
                </Link>
              </Button>
            </Stack>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
