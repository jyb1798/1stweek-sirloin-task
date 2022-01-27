import GlobalStyle from "./Style/GlobalStyle";
import MDOption from "./Component/MDOption";
// import Nav from "./Component/Nav";
import ProductSalesperiod from "./Component/ProductSalesperiod";
import { useState } from "react";
import ProductInfo from "Component/ProductInfo";

function App() {
  const [optionSetList, optionSetter] = useState([]);
  const [productInfoList, PISetter] = useState([]);

  return (
    <div className="App">
      <GlobalStyle />
      {/* <Nav /> */}
      <ProductSalesperiod />
      <ProductInfo productInfoList={productInfoList} PISetter={PISetter} />
      <MDOption optionSetter={optionSetter} optionSetList={optionSetList} />
    </div>
  );
}

export default App;
