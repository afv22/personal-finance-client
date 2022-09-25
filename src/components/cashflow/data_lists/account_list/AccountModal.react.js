import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal from "components/cashflow/data_lists/Modal.react";

const CREATE_NODE = gql`
  mutation CreateAccount($name: String!) {
    createAccount(data: { name: $name }) {
      account {
        id
      }
    }
  }
`;

export default ({ open, setOpen, getDataQuery }) => {
  const defaultFormData = {
    name: "",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [createNode, _] = useMutation(CREATE_NODE, {
    refetchQueries: [{ query: getDataQuery }, "GetData"],
  });

  const closeModal = () => {
    setFormData(defaultFormData);
    setOpen(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    var newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
  };

  const handleSubmit = () => {
    if (formData.name === "") {
      return;
    }
    createNode({
      variables: {
        name: formData.name,
      },
    });
    closeModal();
  };

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      title="Add Account"
    >
      <Grid item>
        <TextField
          id="create-node-name-input"
          label="Name"
          variant="outlined"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
      </Grid>
    </Modal>
  );
};
