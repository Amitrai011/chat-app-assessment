import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default App;
