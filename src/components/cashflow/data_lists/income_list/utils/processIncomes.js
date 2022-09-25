import React from "react";
import DeleteRowButton from "../../DeleteRowButton.react";
import { gql } from "@apollo/client";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DELETE_NODE = gql`
  mutation DeleteNode($id: ID!) {
    deleteNode(id: $id) {
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
    { field: "name", headerName: "Income Source", width: 180, editable: true },
    {
      field: "value",
      headerName: "Gross Value",
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
        <DeleteRowButton params={params} mutation={DELETE_NODE} />,
      ],
    },
  ];
};

export { getRows, getColumns };
