import React, { useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Card, CardContent } from "@mui/material";

import { useMutation } from "@apollo/client";
import { LOGIN_USER, RESET_PASSWORD } from "../utils/mutations";

import Auth from "../utils/auth";

const Login = (props) => {
  const [formState, setFormState] = useState({ email: "", password: "", resetEmail: "" });
  const [openReset, setOpenReset] = useState(false);
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [resetPassword, { error: resetError, data: resetData }] =
    useMutation(RESET_PASSWORD);

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
    // console.log(formState);
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

  // EMAIL RESET FUNCTIONS
  const handleResetButton = async (e) => {
    setOpenReset(!openReset);
  };

  const submitResetRequest = async (e) => {
    e.preventDefault();
    const { data } = resetPassword({ variables: { email: formState.resetEmail } });
    console.log("Unable to reset password.");
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
                <Button
                  sx={{ m: 1 }}
                  type="submit"
                  variant="contained"
                  onClick={resetPassword}
                >
                  Submit
                </Button>
                <Button sx={{ pl: 2 }} onClick={handleResetButton}>
                  Reset Password
                </Button>
                <Dialog open={openReset} onClose={handleResetButton}>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To reset your password to this website, please enter your
                      email address here. We will email you a temporary code to
                      reset your password.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      name="resetEmail"
                      label="Email Address"
                      type="email"
                      fullWidth
                      variant="standard"
                      onChange={handleChange}
                      value={formState.resetEmail}
                    />
                    {resetError ? (
                      <Alert severity="error">Invalid Email Address</Alert>
                    ) : (
                      <>{resetData ? <Alert severity="warning">This feature is currently unavailable. Sorry for the inconvenience{/* {resetData.resetPassword.userName} at {resetData.resetPassword.email} */}.</Alert> : <></>}</>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleResetButton}>Cancel</Button>
                    <Button type="submit" variant="contained" onClick={submitResetRequest}>
                      Reset Password
                    </Button>
                  </DialogActions>
                </Dialog>
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
