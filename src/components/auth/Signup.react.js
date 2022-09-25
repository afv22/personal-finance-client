import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Select, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { gql, useMutation } from "@apollo/client";
import StateNames from "./utils/StateNames";

const REGISTER_USER = gql`
  mutation REGISTER_USER(
    $firstName: String!
    $lastName: String!
    $email: String!
    $state: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      firstName: $firstName
      lastName: $lastName
      email: $email
      state: $state
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
    }
  }
`;

const theme = createTheme();

export default ({ toggleForm }) => {
  const [registerUser, _] = useMutation(REGISTER_USER);
  const [passwordsMismatch, setPasswordsMismatch] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    state: "",
    password1: "",
    password2: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    var newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
    setPasswordsMismatch(newFormData.password1 !== newFormData.password2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await registerUser({
      variables: formData,
    });

    if (response.errors) {
      console.error(response.errors);
      return;
    }

    toggleForm();
  };

  useEffect(() => {
    setSubmitDisabled(
      Object.values(formData).includes("") || passwordsMismatch
    );
  }, [formData]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  required
                  name="state"
                  id="state"
                  label="Home State"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {StateNames.map((state) => (
                    <MenuItem
                      value={state.abbreviation}
                      key={state.abbreviation}
                    >
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  focused={passwordsMismatch}
                  name="password2"
                  label="Re-enter Password"
                  type="password"
                  id="password2"
                  color={passwordsMismatch ? "error" : "info"}
                  onChange={handleChange}
                />
              </Grid>
              {passwordsMismatch ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    Passwords do not match
                  </Typography>
                </Grid>
              ) : null}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={submitDisabled}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={toggleForm} style={{ textTransform: "none" }}>
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
