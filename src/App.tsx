import "./style.scss";

import { Outlet } from "react-router-dom";
import { Footer, Header } from "./components";

function App() {
  return (
    <div className="app">
      <Header />

      <main className="content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
