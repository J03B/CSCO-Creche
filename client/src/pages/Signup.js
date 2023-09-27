import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { Card, CardContent } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handlePhoneChange = (val) => {
    setFormState({
      ...formState,
      phoneNumber: val,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <Card>
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
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
                    placeholder="Your First Name"
                    name="firstName"
                    label="First Name"
                    type="text"
                    value={formState.firstName}
                    onChange={handleChange}
                  />
                  <TextField
                    variant="outlined"
                    sx={{ m: 1, opacity: "100%" }}
                    placeholder="Your Last Name"
                    name="lastName"
                    label="Last Name"
                    type="text"
                    value={formState.lastName}
                    onChange={handleChange}
                  />
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
                  <MuiTelInput
                    variant="outlined"
                    sx={{ m: 1, opacity: "100%" }}
                    name="phoneNumber"
                    defaultCountry="US"
                    label="Phone Number"
                    value={formState.phoneNumber}
                    onChange={handlePhoneChange}
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

export default Signup;
