import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import { UserContext } from "../../App";
import Loader from "../Loader/Loader";
import { urlEdit } from "../../Common/Common";

function Login() {
  const navigate = useNavigate();

  const { setLoggedIn } = useContext(UserContext);

  const [loginData, setLoginData] = useState({
    username: "prranesh",
    password: "123",
  });

  const [invalidCred, setInvaildCred] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChangeLogin = (event) => {
    setInvaildCred("");
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const submitLogin = () => {
    setLoader(true);
    const url = urlEdit();
    axios
      .post(`${url}/login`, loginData)
      .then((res) => {
        console.log("res", res);
        if (res?.status === 200 && res?.data?.message === "LoginSuccess") {
          setLoggedIn(res?.data?.existingUser);
          setLoader(false);
          navigate("/home");
        } else {
          setInvaildCred("Invalid username or password");
          setLoader(false);
          setLoginData({
            username: "",
            password: "",
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
        alert("Internal Server Error");
      });
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Eagle Ledger
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const defaultTheme = createTheme();

  const forgetPwdDialog = () => {
    setInvaildCred(
      "Forgot your password? Please contact your system administrator for assistance."
    );
  };

  return (
    <div>
      {loader && <Loader />}
      <div>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="off"
                  autoFocus
                  value={loginData?.username}
                  onChange={handleChangeLogin}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="off"
                  value={loginData?.password}
                  onChange={handleChangeLogin}
                />
                <Button
                  onClick={submitLogin}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link onClick={forgetPwdDialog} variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                <Grid style={{ marginTop: "10px", height: "20px" }}>
                  {invalidCred !== "" && (
                    <Alert severity="error">{invalidCred}</Alert>
                  )}
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default Login;
