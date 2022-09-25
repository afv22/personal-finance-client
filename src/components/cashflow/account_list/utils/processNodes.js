import React from "react";
import DeleteNodeButton from "../DeleteNodeButton.react";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "name", headerName: "Account name", width: 180, editable: true },
    {
      field: "value",
      headerName: "Value",
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
      getActions: (params) => [<DeleteNodeButton params={params} />],
    },
  ];
};

export { getRows, getColumns };
