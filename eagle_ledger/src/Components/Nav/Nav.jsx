import React from "react";
import { useNavigate } from "react-router-dom";
import "./Nav.css";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import Loader from "../Loader/Loader";
import { urlEdit } from "../../Common/Common";

function Nav() {
  const navigate = useNavigate();

  const { loggedIn } = useContext(UserContext);
  const [loader, setLoader] = useState(false);

  const logoutApi = () => {
    setLoader(true);
    const url = urlEdit()
    axios
      .get(`${url}/logout`)
      .then((res) => {
        console.log(res);
        if (res?.status === 200 && res?.data?.message === "LogoutSuccess") {
          setLoader(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
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
      { loader && <Loader />}
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
                    Receipt
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
