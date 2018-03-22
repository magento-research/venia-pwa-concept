const normalizeArray = (array = [], getKey = (v, i) => i) =>
    array.reduce((r, v, i) => ({ ...r, [getKey(v, i)]: v }), {});

export default normalizeArray;
