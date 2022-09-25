import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal from "components/cashflow/data_lists/Modal.react";

const CREATE_INCOME = gql`
  mutation CreateIncome($name: String!, $value: Float!) {
    createIncome(data: { name: $name, value: $value }) {
      income {
        id
      }
    }
  }
`;

export default ({ open, setOpen, getDataQuery }) => {
  const defaultFormData = {
    name: "",
    value: "",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [createNode, _] = useMutation(CREATE_INCOME, {
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
    if (formData.name === "" || formData.value === "") {
      return;
    }
    createNode({
      variables: {
        name: formData.name,
        value: parseFloat(formData.value !== "" ? formData.value : 0),
      },
    });
    closeModal();
  };

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      title="Add Income"
    >
      <Grid item>
        <TextField
          name="name"
          id="create-node-name-input"
          label="Name"
          variant="outlined"
          onChange={handleChange}
          value={formData.name}
        />
      </Grid>
      <Grid item>
        <TextField
          name="value"
          id="create-node-name-input"
          label="Value"
          variant="outlined"
          onChange={handleChange}
          value={formData.value}
        />
      </Grid>
    </Modal>
  );
};
