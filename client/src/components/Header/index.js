import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
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
        const ismobile = window.innerWidth < 900;
        if (ismobile !== isMobile) setIsMobile(ismobile);
      },
      false
    );
  }, [isMobile]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        {" "}
        <Toolbar sx={{justifyContent: "space-around", p: 2}}>
          {isMobile ? (
            <Stack>
              <Typography sx={{ mt: 2 }} variant="h5">
                <Link
                  className="text-light"
                  to="/"
                  style={{ textDecoration: "none" }}
                >
                  Light of the World Christmas Experience
                </Link>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
              Colorado Springs Creche
              </Typography>
            </Stack>
          ) : (
            <Stack>
              <Typography variant="h2" sx={{ flexGrow: 1 }}>
                <Link
                  className="text-light"
                  to="/"
                  style={{ textDecoration: "none" }}
                >
                  Light of the World Christmas Experience
                </Link>
              </Typography>
              <Typography variant="h4" gutterBottom>
              Colorado Springs Creche
              </Typography>
            </Stack>
          )}

          {Auth.loggedIn() ? (
            <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
              <Link className="text-dark" to="/me">
                {isMobile ? (
                  <Avatar sx={{ bgcolor: "#90CAF9", opacity: 0.75 }}>
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
              <Button variant="outlined" size="large" onClick={logout} sx={{ lineHeight: 1.5 }}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
              <Link className="text-dark" to="/login">
                <Button variant="contained" size="large" sx={{ lineHeight: 1.5 }}>
                  Login
                </Button>
              </Link>
              <Link className="text-light" to="/signup">
                <Button variant="outlined" size="large" sx={{ lineHeight: 1.5 }}>
                  Signup
                </Button>
              </Link>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
