import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Paper, Typography, Grid, TextField, Button } from "@mui/material";
import TableRender from "../TableRender/TableRender";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { formatDateddmmyyyy, urlEdit } from "../../Common/Common";
import Loader from "../Loader/Loader";

function View() {
  const [loanNumber, setLoanNumber] = useState();
  const [loanNumberData, setLoanNumberData] = useState();

  const [dataPresent, setDataPresent] = useState(false);
  const [currentInstallment, setCurrentInstallment] = useState();

  const [fieldsRequiredAlert, setFieldsRequiredAlert] = useState(false);

  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [paymentDetailsData, setPaymentDetailsData] = useState({
    date: "",
    reciptNumber: "",
    principleAmount: "",
    interestAmount: "",
    overDueAmount: "",
    totalAmount: "",
  });

  const url = urlEdit()

  const handleLoanNumber = (event) => {
    setErrorMessage("");
    setLoanNumber(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoanNumberData();
    setDataPresent(false);
    setLoanNumber();
  };

  useEffect(() => {
    let sort = [];
    loanNumberData?.installmentsData?.forEach((item) => {
      if (item?.paidDate === "") {
        sort.push(item);
      }
    });
    if (sort?.[0]) {
      setCurrentInstallment(sort?.[0]);
    }
  }, [loanNumberData]);

  const [file, setFile] = useState(null);

  

  

  

  const [base64String1, setBase64String1] = useState("");

  

  /////////////////////////////////////

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchLoanNumberData = () => {
    setLoader(true);
    axios
      .get(`${url}/fetch/` + loanNumber)
      .then((res) => {
        console.log(res?.data);
        if (typeof res?.data === "object") {
          setLoanNumberData(res?.data);
          setDataPresent(true);
          setLoader(false);
          handleClickOpen();
        }
      })
      .catch((err) => {
        setErrorMessage("No matching user found.");
        setLoader(false);
      });
  };

  return (
    <div>
      {loader && <Loader />}

      <div>
        {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
      </div>
      {!dataPresent && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
            },
          }}
        >
          <Paper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Loan Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  autoFocus
                  required
                  id="loanNumber"
                  name="loanNumber"
                  label="Loan Number"
                  fullWidth
                  autoComplete="off"
                  variant="standard"
                  value={loanNumber}
                  onChange={handleLoanNumber}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button
                  onClick={() => {
                    fetchLoanNumberData();
                  }}
                >
                  Get Details
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}

      {dataPresent && (
        <>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Loan Details" {...a11yProps(0)} />
                <Tab label="Loanee Details" {...a11yProps(1)} />
                <Tab label="Guarantee Details" {...a11yProps(2)} />
                <Tab label="Vehicle Details" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={1}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Typography>
                      Name : {loanNumberData?.loaneeDetailsData?.name}
                    </Typography>
                    <Typography>
                      Father Name :{" "}
                      {loanNumberData?.loaneeDetailsData?.fatherName}
                    </Typography>
                    <Typography>
                      Work : {loanNumberData?.loaneeDetailsData?.work}
                    </Typography>
                    <Typography>
                      Mobile 1 : {loanNumberData?.loaneeDetailsData?.mobile1}
                    </Typography>
                    <Typography>
                      Mobile 2 : {loanNumberData?.loaneeDetailsData?.mobile2}
                    </Typography>
                    <Typography>
                      Pincode : {loanNumberData?.loaneeDetailsData?.pincode}
                    </Typography>
                    <Typography>
                      Address : {loanNumberData?.loaneeDetailsData?.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <img
                      style={{ height: "120px", width: "100px" }}
                      src={loanNumberData?.loaneeDetailsData?.photo}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Typography>
                      Name : {loanNumberData?.guaranteeDetailsData?.name}
                    </Typography>
                    <Typography>
                      Father Name :{" "}
                      {loanNumberData?.guaranteeDetailsData?.fatherName}
                    </Typography>
                    <Typography>
                      Work : {loanNumberData?.guaranteeDetailsData?.work}
                    </Typography>
                    <Typography>
                      Mobile 1 : {loanNumberData?.guaranteeDetailsData?.mobile1}
                    </Typography>
                    <Typography>
                      Mobile 2 : {loanNumberData?.guaranteeDetailsData?.mobile2}
                    </Typography>
                    <Typography>
                      Pincode : {loanNumberData?.guaranteeDetailsData?.pincode}
                    </Typography>
                    <Typography>
                      Address : {loanNumberData?.guaranteeDetailsData?.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <img
                      style={{ height: "120px", width: "100px" }}
                      src={loanNumberData?.guaranteeDetailsData?.photo}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={0}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>
                      Loan Number :{" "}
                      {loanNumberData?.loanDetailsData?.loanNumber}
                    </Typography>
                    <Typography>
                      Date :{" "}
                      {formatDateddmmyyyy(
                        loanNumberData?.loanDetailsData?.date
                      )}
                    </Typography>
                    <Typography>
                      Principle Amount :{" "}
                      {loanNumberData?.loanDetailsData?.totalAmount}
                    </Typography>
                    <Typography>
                      Interest Rate :{" "}
                      {loanNumberData?.loanDetailsData?.interestRate}
                    </Typography>
                    <Typography>
                      Installments :{" "}
                      {loanNumberData?.loanDetailsData?.installments}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography>
                      Vehicle Number :{" "}
                      {loanNumberData?.vehicleDetailsData?.vehicleNumber}
                    </Typography>
                    <Typography>
                      Vehicle Type :{" "}
                      {loanNumberData?.vehicleDetailsData?.vehicleType}
                    </Typography>
                    <Typography>
                      Model (Yr) : {loanNumberData?.vehicleDetailsData?.model}
                    </Typography>
                    <Typography>
                      Variant : {loanNumberData?.vehicleDetailsData?.variant}
                    </Typography>
                    <Typography>
                      Engine No :{" "}
                      {loanNumberData?.vehicleDetailsData?.engineNumber}
                    </Typography>
                    <Typography>
                      Chassis No :{" "}
                      {loanNumberData?.vehicleDetailsData?.chasisNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <img
                      style={{ height: "138px", width: "110px" }}
                      src={loanNumberData?.vehicleDetailsData?.photo}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CustomTabPanel>
          </Box>

          <TableRender data={loanNumberData} />
        </>
      )}
    </div>
  );
}

export default View;
