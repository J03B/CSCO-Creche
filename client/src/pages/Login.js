import React, { useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { Card, CardContent } from "@mui/material";

import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Login = (props) => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: "",
      password: "",
    });
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <Card>
          <h4 className="card-header bg-dark text-light p-2">Login</h4>
          <CardContent>
            {data ? (
              <p>
                Success! You may now head{" "}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <Box component="form" onSubmit={handleFormSubmit}>
                <Stack
                  sx={{
                    bgcolor: "background.paper",
                    opacity: "85%",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <TextField
                    variant="outlined"
                    sx={{ m: 1, opacity: "100%" }}
                    placeholder="Your email"
                    name="email"
                    label="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                  <TextField
                    variant="outlined"
                    sx={{ m: 1, opacity: "100%" }}
                    placeholder="********"
                    name="password"
                    label="Password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </Stack>
                <Button sx={{ m: 1 }} type="submit" variant="contained">
                  Submit
                </Button>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ m: 1 }}>
                {error.message}
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Login;
