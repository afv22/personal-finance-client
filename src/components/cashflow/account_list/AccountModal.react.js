import { Grid, TextField, Divider } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal, { ModalButton } from "components/cashflow/Modal.react";

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
  const [name, setName] = useState("");
  const [createNode, _] = useMutation(CREATE_NODE, {
    refetchQueries: [{ query: getDataQuery }, "GetData"],
  });

  const closeModal = () => {
    setName("");
    setOpen(false);
  };

  const handleSubmit = () => {
    if (name === "") {
      return;
    }
    createNode({
      variables: {
        name: name,
      },
    });
    closeModal();
  };

  return (
    <Modal open={open} closeModal={closeModal} title="Add Account">
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <TextField
            id="create-node-name-input"
            label="Name"
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
            value={name}
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
