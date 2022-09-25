import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Modal from "../Modal.react";
import Loading from "components/applet/Loading.react";

const CREATE_EDGE_FORM_GET_ACCOUNT_NAMES = gql`
  query CreateEdgeFromGetAccountNames {
    accounts {
      id
      name
    }
    incomes {
      id
      name
    }
  }
`;

const CREATE_EDGE_FORM_CREATE_EDGE = gql`
  mutation CreateEdgeFormCreateEdge(
    $sourceID: ID!
    $targetID: ID!
    $isTaxable: Boolean!
    $sourcePercentage: Float!
    $sourceAmount: Float!
    $sourceRemainingBalance: Boolean!
  ) {
    createEdge(
      data: {
        sourceId: $sourceID
        targetId: $targetID
        isTaxable: $isTaxable
        sourcePercentage: $sourcePercentage
        sourceAmount: $sourceAmount
        sourceRemainingBalance: $sourceRemainingBalance
      }
    ) {
      edge {
        id
      }
    }
  }
`;

const inputStyle = {
  width: 160,
};

const edgeTypesMenu = ["Percentage", "Amount", "Remaining Balance"].map(
  (type, index) => (
    <MenuItem value={index} key={index}>
      {type}
    </MenuItem>
  )
);

export default ({ open, setOpen, getDataQuery }) => {
  const defaultFormData = {
    source: "",
    target: "",
    edgeType: 0,
    edgeValue: "",
    isTaxable: false,
  };
  const [formData, setFormData] = useState(defaultFormData);

  const getNodeNamesResponse = useQuery(CREATE_EDGE_FORM_GET_ACCOUNT_NAMES);
  const [createEdge, _] = useMutation(CREATE_EDGE_FORM_CREATE_EDGE, {
    refetchQueries: [{ query: getDataQuery }, "GetData"],
  });

  const closeModal = () => {
    setFormData(defaultFormData);
    setOpen(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    var newFormData = { ...formData };
    if (event.target.name === "isTaxable") {
      newFormData[event.target.name] = !newFormData[event.target.name];
    } else {
      newFormData[event.target.name] = event.target.value;
    }
    if (event.target.name === "edgeType") {
      newFormData["edgeValue"] = "";
    }
    setFormData(newFormData);
  };

  const handleSubmit = () => {
    if (formData.source === "" || formData.target === "") {
      return;
    }
    createEdge({
      variables: {
        sourceID: formData.source,
        targetID: formData.target,
        isTaxable: formData.isTaxable,
        sourcePercentage:
          formData.edgeType === 0 ? parseFloat(formData.edgeValue) : 0,
        sourceAmount:
          formData.edgeType === 1 ? parseFloat(formData.edgeValue) : 0,
        sourceRemainingBalance: formData.edgeType === 2,
      },
    });
    closeModal();
  };

  if (getNodeNamesResponse.loading) {
    return <Loading />;
  }

  const accountsMenu = getNodeNamesResponse.data.accounts
    .concat(getNodeNamesResponse.data.incomes)
    .map((num) => (
      <MenuItem value={num.id} key={num.id}>
        {num.name}
      </MenuItem>
    ));

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      title="Add Edge"
    >
      <Grid container direction="row" spacing={3} justifyContent="center">
        <Grid item>
          <Select
            name="source"
            style={inputStyle}
            value={formData.source}
            onChange={handleChange}
          >
            {accountsMenu}
          </Select>
        </Grid>
        <Grid item>
          <Select
            name="target"
            style={inputStyle}
            value={formData.target}
            onChange={handleChange}
          >
            {accountsMenu}
          </Select>
        </Grid>
        <Grid item>
          <Select
            name="edgeType"
            style={inputStyle}
            value={formData.edgeType}
            label="Type"
            onChange={handleChange}
          >
            {edgeTypesMenu}
          </Select>
        </Grid>
        <Grid item>
          <TextField
            name="edgeValue"
            disabled={formData.edgeType === 2}
            style={inputStyle}
            label={["%", "$", ""][formData.edgeType]}
            variant="outlined"
            onChange={handleChange}
            value={formData.edgeValue}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        sx={{ marginTop: 2 }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isTaxable}
              onClick={handleChange}
              name="isTaxable"
            />
          }
          label="Is Taxable"
        />
      </Grid>
    </Modal>
  );
};
