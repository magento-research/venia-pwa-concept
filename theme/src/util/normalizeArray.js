const normalizeArray = (array, getKey) =>
    array.reduce((r, v, i) => ({ ...r, [getKey(v, i)]: v }), {});

export default normalizeArray;
