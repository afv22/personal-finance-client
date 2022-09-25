const processRowUpdate = async (newRow, updateNode) => {
  const response = await updateNode({
    variables: newRow,
  });
  return response.data.updateNode;
};

const onProcessRowUpdateError = (error) => {
  console.error(error);
};

export { processRowUpdate, onProcessRowUpdateError };
