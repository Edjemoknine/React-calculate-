import { useReducer } from "react";
import "./App.css";
import DigitButton from "./components/DigitButton";
import OperButton from "./components/OperButton";

export const ACTIONS = {
  AddDigit: "AddDigit",
  AddOperation: "AddOperation",
  Clear: "Clear",
  RemovDigit: "RemovDigit",
  Evaluate: "Evaluate",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.AddDigit:
      if (state.evaluated === true)
        return { ...state, evaluated: false, currentOperand: payload.digit };
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.AddOperation:
      if (state.currentOperand == null && state.prvOperand == null)
        return state;

      if (state.prvOperand == null) {
        return {
          ...state,
          currentOperand: null,
          prvOperand: state.currentOperand,
          operation: payload.operation,
        };
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        currentOperand: null,
        prvOperand: Evaluate(state),
        operation: payload.operation,
      };
    case ACTIONS.Clear:
      return {
        ...state,
        currentOperand: null,
        prvOperand: null,
        operation: null,
      };

    case ACTIONS.Evaluate:
      if (
        state.currentOperand == null ||
        state.prvOperand == null ||
        state.operation == null
      )
        return state;
      return {
        ...state,
        prvOperand: null,
        currentOperand: Evaluate(state),
        operation: null,
        evaluated: true,
      };

    case ACTIONS.RemovDigit:
      if (state.evaluated)
        return { ...state, evaluated: false, currentOperand: null };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
};

const Evaluate = ({ prvOperand, currentOperand, operation }) => {
  const prev = parseFloat(prvOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let Total = "";
  switch (operation) {
    case "+":
      Total = prev + current;

      break;

    case "-":
      Total = prev - current;
      break;
    case "*":
      Total = prev * current;
      break;
    case "/":
      Total = prev / current;
      break;
  }
  return Total.toString();
};

const Formatter = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 });
const Foramtation = (oparand) => {
  if (oparand == null) return;
  const [integer, decimal] = oparand.split(".");
  if (decimal == null) return Formatter.format(integer);
  return `${Formatter.format(integer)}.${decimal}`;
};

function App() {
  const [{ currentOperand, operation, prvOperand }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <main
      style={{ minHeight: "100vh", display: "grid", placeContent: "center" }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(6rem,1fr))",
          gridTemplateRows: "minmax(7rem,auto) repeat(5,6rem)",
        }}
      >
        <div
          style={{
            background: "#089",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            padding: "1rem",
            color: "white",
            gridColumn: "-1/1",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "1rem" }}>
            {Foramtation(prvOperand)} {operation}
          </div>
          <div style={{ fontSize: "2rem" }}>{Foramtation(currentOperand)}</div>
        </div>

        <button
          style={{ gridColumn: "span 2" }}
          onClick={() => dispatch({ type: ACTIONS.Clear })}
        >
          {" "}
          AC
        </button>

        <button onClick={() => dispatch({ type: ACTIONS.RemovDigit })}>
          DEL
        </button>
        <OperButton operation={"/"} dispatch={dispatch} />

        <DigitButton digit={"1"} dispatch={dispatch} />
        <DigitButton digit={"2"} dispatch={dispatch} />
        <DigitButton digit={"3"} dispatch={dispatch} />

        <OperButton operation={"*"} dispatch={dispatch} />
        <DigitButton digit={"4"} dispatch={dispatch} />
        <DigitButton digit={"5"} dispatch={dispatch} />
        <DigitButton digit={"6"} dispatch={dispatch} />
        <OperButton operation={"+"} dispatch={dispatch} />
        <DigitButton digit={"7"} dispatch={dispatch} />
        <DigitButton digit={"8"} dispatch={dispatch} />
        <DigitButton digit={"9"} dispatch={dispatch} />

        <OperButton operation={"-"} dispatch={dispatch} />
        <DigitButton digit={"."} dispatch={dispatch} />
        <DigitButton digit={"0"} dispatch={dispatch} />

        <button
          style={{ gridColumn: "span 2" }}
          onClick={() => dispatch({ type: ACTIONS.Evaluate })}
        >
          =
        </button>
      </div>
    </main>
  );
}

export default App;
