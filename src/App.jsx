import React from "react";
import Routes from "./Routes";
import { WalletProvider } from "./contexts/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Routes />
    </WalletProvider>
  );
}

export default App;
