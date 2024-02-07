import React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Nav.css";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../App";

function Nav() {
  const navigate = useNavigate();

  const { loggedIn } = useContext(UserContext);

  console.log("login", loggedIn);

  // const {loggedIn} = useContext(UserContext)

  const logoutApi = () => {
    axios
      .get("http://localhost:4000/logout")
      .then((res) => {
        console.log(res);
        if (res?.status === 200 && res?.data?.message === "LogoutSuccess") {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // <Box sx={{ flexGrow: 1, backgroundColor: "black" }}>
    //   <AppBar position="static">
    //     <Toolbar>
    //       {!(window.location.pathname === "/home" ||
    //         window.location.pathname === "/") && (
    //         <Button
    //           color="inherit"
    //           onClick={() => {
    //             navigate("/home");
    //           }}
    //         >
    //           Home
    //         </Button>
    //       )}
    //     </Toolbar>
    //   </AppBar>
    // </Box>
    <div>
      {!(window?.location?.pathname === "/login") && (
        <div>
          <header>
            <nav>
              <div className="logo">
                <a href="#">Hi..!! {loggedIn?.username?.toUpperCase()}</a>
              </div>
              <input type="checkbox" id="click" />
              <label htmlFor="click" className="mainicon">
                <div className="menu">
                  <i className="bi bi-list"></i>
                </div>
              </label>
              <ul>
                <li>
                  <a
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      navigate("/addUser");
                    }}
                  >
                    Add
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      navigate("/view");
                    }}
                  >
                    View
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      navigate("/paymentEntry");
                    }}
                  >
                    Recipt
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      logoutApi();
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          </header>
        </div>
      )}
    </div>
  );
}

export default Nav;
