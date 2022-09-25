import React from "react";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { GET_DATA } from "components/cashflow/CashFlow.react";

const DeleteIncomeButton = ({ params, mutation }) => {
  const [deleteNode, _] = useMutation(mutation, {
    refetchQueries: [{ query: GET_DATA }, "GetData"],
  });

  const onClick = () => {
    return deleteNode({
      variables: {
        id: params.row.id,
      },
    });
  };

  return (
    <IconButton onClick={onClick}>
      <Delete />
    </IconButton>
  );
};

export default DeleteIncomeButton;
