import { useState } from "react";
import Screen from "./components/Screen";
import Button from "./components/Button";
import { calculatorBtns } from "./mock/data";
import "./App.css";

function App() {
  const [currentValue, setCurrentValue] = useState("");
  const [result, setResult] = useState("");
  const [isResultShown, setIsResultShown] = useState(false);

  const handleGetValue = (e) => {
    const value = e.target.textContent;

    if (isResultShown && !isNaN(value)) {
      setCurrentValue(value);
      setResult(value);
      setIsResultShown(false);
      return;
    }

    if (!isNaN(value) || value === ".") {
      setCurrentValue((prev) => prev + value);
      setResult((prev) => prev + value);
      setIsResultShown(false);
    } else if (["+", "-", "*", "/"].includes(value)) {
      if (currentValue === "" && result !== "") {
        setCurrentValue(result);
        setResult(result + value);
        setIsResultShown(false);
      } else if (currentValue === "") {
        return;
      } else {
        setCurrentValue("");
        setResult((prev) => prev + value);
      }
    } else {
      switch (value) {
        case "=":
          if (currentValue === "") return;
          calculate();
          setIsResultShown(true);
          break;

        case "C":
          setCurrentValue("");
          setResult("");
          setIsResultShown(false);
          break;

        case "CE":
          setCurrentValue("");
          setResult(result.slice(0, -currentValue.length));
          break;

        default:
          break;
      }
    }
  };

  const precedence = (op) => {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
  };

  const infixToPostfix = (expression) => {
    const stack = [];
    const postfix = [];
    const tokens = expression.match(/(\d+|\+|\-|\*|\/|\(|\))/g);

    tokens.forEach((token) => {
      if (!isNaN(token)) {
        postfix.push(token);
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        while (stack.length > 0 && stack[stack.length - 1] !== "(") {
          postfix.push(stack.pop());
        }
        stack.pop();
      } else {
        while (
          stack.length > 0 &&
          precedence(stack[stack.length - 1]) >= precedence(token)
        ) {
          postfix.push(stack.pop());
        }
        stack.push(token);
      }
    });

    while (stack.length > 0) {
      postfix.push(stack.pop());
    }

    return postfix;
  };

  const evaluatePostfix = (postfix) => {
    const stack = [];

    postfix.forEach((token) => {
      if (!isNaN(token)) {
        stack.push(parseFloat(token));
      } else {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
          default:
            break;
        }
      }
    });

    return stack[0];
  };

  const calculate = () => {
    const expression = result;
    const postfix = infixToPostfix(expression);
    const computation = evaluatePostfix(postfix);
    setResult(computation.toString());
    setCurrentValue("");
  };

  return (
    <div className="container">
      <div className="main">
        <div className="calculator">
          <Screen value={result || "0"} />
          <div className="calc__position">
            {calculatorBtns.map((btn) => (
              <Button
                key={btn.id}
                value={btn.value}
                handleGetValue={handleGetValue}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
