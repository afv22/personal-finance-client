import React from "react";
import DeleteRowButton from "../../DeleteRowButton.react";
import { gql } from "@apollo/client";

const edgeTypes = ["Percentage", "Amount", "Balance"];

const DELETE_EDGE = gql`
  mutation DeleteEdge($id: ID!) {
    deleteEdge(id: $id) {
      success
    }
  }
`;

const getColumns = () => {
  return [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "source",
      headerName: "Source",
      width: 180,
      editable: false,
      valueGetter: (params) => params.row.source,
    },
    {
      field: "target",
      headerName: "Target",
      width: 180,
      editable: false,
      valueGetter: (params) => params.row.target,
    },
    {
      field: "type",
      headerName: "Type",
      editable: true,
      width: 120,
      type: "singleSelect",
      valueOptions: edgeTypes,
    },
    {
      field: "value",
      headerName: "Value",
      editable: true,
      width: 60,
      valueGetter: (params) => params.row.value,
    },
    {
      field: "isTaxable",
      headerName: "Is Taxable",
      editable: true,
      type: "boolean",
    },
    {
      field: "delete",
      type: "actions",
      width: 60,
      getActions: (params) => [
        <DeleteRowButton params={params} mutation={DELETE_EDGE} />,
      ],
    },
  ];
};

const getRows = (data) => {
  const accountNames = Object.assign(
    {},
    ...data.accounts
      .concat(data.incomes)
      .map((node) => ({ [node.id]: node.name }))
  );
  return data.edges.map((edge) => {
    var rowData = {
      id: edge.id,
      source: accountNames[edge.sourceId],
      target: accountNames[edge.targetId],
      isTaxable: edge.isTaxable,
    };

    if (edge.sourcePercentage) {
      rowData.type = edgeTypes[0];
      rowData.value = edge.sourcePercentage;
    } else if (edge.sourceAmount) {
      rowData.type = edgeTypes[1];
      rowData.value = edge.sourceAmount;
    } else {
      rowData.type = edgeTypes[2];
      rowData.value = "N/A";
    }

    return rowData;
  });
};

export { getColumns, getRows };
