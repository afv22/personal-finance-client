import React, { createContext } from "react";
import SankeyDiagram from "./diagram/SankeyDiagram.react";
import AccountList from "./account_list/AccountList.react";
import { gql, useQuery } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import EdgeList from "./edge_list/EdgeList.react";
import Loading from "components/applet/Loading.react";
import AccountModalReact from "./account_list/AccountModal.react";
import IncomeModalReact from "./IncomeModal.react";

const GET_DATA = gql`
  query GetData {
    incomes {
      id
      name
      value
    }
    accounts {
      id
      name
      value
      netValue
    }
    edges {
      id
      sourceId
      targetId
      value
      taxes
      isTaxable
      sourceAmount
      sourcePercentage
      sourceRemainingBalance
    }
  }
`;

const UPDATE_INCOME = gql`
  mutation UpdateIncome($id: ID!, $name: String!, $value: Float!) {
    updateIncome(id: $id, data: { name: $name, value: $value }) {
      income {
        id
      }
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: ID!, $name: String!) {
    updateAccount(id: $id, data: { name: $name }) {
      account {
        id
      }
    }
  }
`;

const DataQueryContext = createContext();

const CashFlow = () => {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <p>Error!</p>;
  }

  return (
    <DataQueryContext.Provider value={GET_DATA}>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={8}
        paddingBottom={20}
      >
        <Typography variant="h2" marginTop={15}>
          Cash Flow
        </Typography>
        <SankeyDiagram data={data} />
        <Grid item>
          <AccountList
            nodes={data.incomes}
            Modal={IncomeModalReact}
            nodeName="Income Source"
            updateMutation={UPDATE_INCOME}
          />
        </Grid>
        <Grid item>
          <AccountList
            nodes={data.accounts}
            Modal={AccountModalReact}
            nodeName="Bank Account"
            updateMutation={UPDATE_ACCOUNT}
          />
        </Grid>
        <Grid item>
          <EdgeList data={data} />
        </Grid>
      </Grid>
    </DataQueryContext.Provider>
  );
};

export default CashFlow;

export { GET_DATA };
