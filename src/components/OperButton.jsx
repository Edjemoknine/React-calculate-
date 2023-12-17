import { ACTIONS } from "../App";

const OperButton = ({ operation, dispatch }) => {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.AddOperation, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};

export default OperButton;
