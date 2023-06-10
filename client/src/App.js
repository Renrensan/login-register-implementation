import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RegisterForm } from "./components/forms/register-form";

function App() {
  return (
    <div className="App">
      <RegisterForm />
    </div>
  );
}

export default App;
