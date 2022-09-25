import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

/**
 * Translate Nodes and Edges to a format readable by the Plotly diagram
 */
const translate = (accounts, incomes, edges) => {
  var idToIndex = {};
  var labels = ["Total Income", "Taxes"];
  var sources = [];
  var targets = [];
  var values = [];

  incomes.forEach((node, index) => {
    labels.push(node.name);
    idToIndex[node.id] = index + 2;
    sources.push(0);
    targets.push(index + 2);
    values.push(node.value);
  });

  accounts.forEach((node, index) => {
    labels.push(node.name);
    idToIndex[node.id] = index + 2 + incomes.length;
  });

  edges.forEach((edge) => {
    sources.push(idToIndex[edge.sourceId]);
    targets.push(idToIndex[edge.targetId]);
    if (edge.isTaxable) {
      values.push(edge.value);
      sources.push(idToIndex[edge.sourceId]);
      targets.push(1);
      values.push(edge.taxes);
    } else {
      values.push(edge.value);
    }
  });

  console.log(labels, sources, targets);

  return [labels, sources, targets, values];
};

export default ({ data }) => {
  const [labels, setLabels] = useState([]);
  const [sources, setSources] = useState([]);
  const [targets, setTargets] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const [newLabels, newSources, newTargets, newValues] = translate(
      data.accounts,
      data.incomes,
      data.edges
    );
    setLabels(newLabels);
    setSources(newSources);
    setTargets(newTargets);
    setValues(newValues);
  }, [data]);

  return (
    <Plot
      data={[
        {
          type: "sankey",
          orientation: "h",
          node: {
            pad: 15,
            thickness: 30,
            line: {
              color: "black",
              width: 0.5,
            },
            label: labels,
          },

          link: {
            source: sources,
            target: targets,
            value: values,
          },
        },
      ]}
      layout={{ width: 1200, height: 600 }}
    />
  );
};
