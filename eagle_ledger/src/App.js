import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Components/Nav/Nav";
import AddUser from "./Components/AddUser/AddUser";
import { Route, Routes, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PaymentEntry from "./Components/PaymentEntry/PaymentEntry";
import View from "./Components/View/View";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import LogoutTimer from "./Components/LogoutTimer/LogoutTimer";

export const UserContext = React.createContext();

function App() {
  const snackbar = sessionStorage.getItem("snackbar");

  const [open, setOpen] = React.useState(false);

  const [loggedIn, setLoggedIn] = useState();

  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (snackbar) {
      setOpen(true);
      setTimeout(() => {
        sessionStorage.removeItem("snackbar");
        setOpen(false);
      }, "6000");
    }
  }, [snackbar, open]);

  const handleLogout = () => {
    // Implement your logout logic here (e.g., redirect, clear session, etc.)
    axios
      .get("http://localhost:4000/logout")
      .then((res) => {
        console.log(res);
        if (res?.status === 200 && res?.data?.message === "LogoutSuccess") {
          setLoggedIn();
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("User logged out due to inactivity");
  };

  return (
    <div>
      <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
        {open && (
          <div>
            <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbar}
              </Alert>
            </Snackbar>
          </div>
        )}
        <Nav />
        <LogoutTimer logoutCallback={handleLogout} timeoutInMinutes={1} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {loggedIn?.username !== '' && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/paymentEntry" element={<PaymentEntry />} />
              <Route path="/view" element={<View />} />
            </>
          )}
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
