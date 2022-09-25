import { Grid, TextField, Divider } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal, { ModalButton } from "components/cashflow/Modal.react";

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
  const [formData, setFormData] = useState({
    name: "",
    value: "",
  });
  const [createNode, _] = useMutation(CREATE_INCOME, {
    refetchQueries: [{ query: getDataQuery }, "GetData"],
  });

  const closeModal = () => {
    setFormData({
      name: "",
      value: "",
    });
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
    <Modal open={open} closeModal={closeModal} title="Add Income">
      <Grid container direction="column" alignItems="center" spacing={2}>
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
        <Grid item>
          <Divider />
        </Grid>
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item>
            <ModalButton onClick={closeModal} title="Cancel" />
          </Grid>
          <Grid item>
            <ModalButton onClick={handleSubmit} title="Save" />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};
