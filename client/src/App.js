import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RegisterForm } from "./components/forms/register-form";
import { LoginForm } from "./components/forms/login-form";

function App() {
  return (
    <div className="App">
      <LoginForm/>
      <RegisterForm />
    </div>
  );
}

export default App;
