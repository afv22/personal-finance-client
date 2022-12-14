import React from "react";
import { useMutation } from "@apollo/client";
import { getRows, getColumns } from "./utils/processIncomes";
import { processRowUpdate, onProcessRowUpdateError } from "./utils/rowUpdate";
import DataList from "../DataList.react";
import { GET_DATA } from "components/cashflow/CashFlow.react";

const IncomeList = ({ nodes, Modal, nodeName, updateMutation }) => {
  const [updateNode, _] = useMutation(updateMutation, {
    refetchQueries: [{ query: GET_DATA }, "GetData"],
  });
  return (
    <DataList
      rows={getRows(nodes)}
      columns={getColumns()}
      processRowUpdate={(newRow) => processRowUpdate(newRow, updateNode)}
      onProcessRowUpdateError={onProcessRowUpdateError}
      buttonTitle={"Add " + nodeName}
      Modal={Modal}
    />
  );
};

export default IncomeList;
