import React from "react";
import DeleteRowButton from "../../DeleteRowButton.react";
import { gql } from "@apollo/client";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: ID!) {
    deleteAccount(id: $id) {
      success
    }
  }
`;

const getRows = (nodes) => {
  return nodes.map((node) => {
    return {
      id: node.id,
      name: node.name,
      value: node.netValue ? node.netValue : node.value,
    };
  });
};

const getColumns = () => {
  return [
    { field: "id", width: 90, hide: true },
    { field: "name", headerName: "Bank Account", width: 180, editable: true },
    {
      field: "value",
      headerName: "Net Value",
      width: 120,
      editable: true,
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        return formatter.format(params.value);
      },
    },
    {
      field: "delete",
      type: "actions",
      width: 60,
      getActions: (params) => [
        <DeleteRowButton params={params} mutation={DELETE_ACCOUNT} />,
      ],
    },
  ];
};

export { getRows, getColumns };
