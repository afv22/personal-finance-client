import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { IconButton, MenuItem, Select } from "@mui/material";
import { ArrowBack, Person } from "@mui/icons-material";
import Container from "@mui/material/Container";
import { gql, useMutation, useQuery } from "@apollo/client";
import Loading from "components/applet/Loading.react";
import { useNavigate } from "react-router-dom";
import StateNames from "./utils/StateNames";

const UPDATE_USER = gql`
  mutation UpdateUser(
    $firstName: String!
    $lastName: String!
    $state: String!
  ) {
    updateUser(
      data: { firstName: $firstName, lastName: $lastName, state: $state }
    ) {
      success
    }
  }
`;

const FETCH_USER_DATA = gql`
  query FetchUserData {
    whoami {
      firstName
      lastName
      state
    }
  }
`;

const styles = {
  avatar: { m: 1, bgcolor: "secondary.main" },
  backButton: { top: 20, left: 20 },
  formBox: { mt: 3 },
  profileBox: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submitButton: { mt: 3, mb: 2 },
};

const Profile = () => {
  const navigate = useNavigate();
  const updateUser = useMutation(UPDATE_USER)[0];
  const FetchUserDataResponse = useQuery(FETCH_USER_DATA);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    var newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUser({
      variables: formData,
    });
  };

  useEffect(() => {
    if (FetchUserDataResponse.data) {
      setFormData(FetchUserDataResponse.data.whoami);
    }
  }, [FetchUserDataResponse]);

  if (FetchUserDataResponse.loading) {
    return <Loading />;
  } else if (FetchUserDataResponse.error) {
    return <p>Error!</p>;
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={() => navigate("/")}
        size="large"
        sx={styles.backButton}
      >
        <ArrowBack />
      </IconButton>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={styles.profileBox}>
          <Avatar sx={styles.avatar}>
            <Person />
          </Avatar>
          <Box sx={styles.formBox}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
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
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  required
                  name="state"
                  id="state"
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.submitButton}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Profile;
