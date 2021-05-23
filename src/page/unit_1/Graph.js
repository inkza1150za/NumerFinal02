import { React, useEffect, useState } from "react";
import Desmos from "desmos";
export default function Graph(props) {
  const { latex } = props;
  useEffect(() => {
    var elt = document.getElementById("calculator");
    var calculator = Desmos.GraphingCalculator(elt, {
      keypad: false,
      expressions: false,
    });
    calculator.setExpression({ id: "graph1", latex: `${latex}` });
    return () => {
      calculator.destroy();
    };
  }, [latex]);
  return <div id="calculator" style={{ width: 600, height: 400 }} />;
}