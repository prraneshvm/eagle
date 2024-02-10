import React, { useEffect } from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { urlEdit } from "../../Common/Common";

function AddUser() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);

  const [loaneeDetailsData, setLoaneeDetailsData] = useState({
    name: "",
    fatherName: "",
    work: "",
    address: "",
    mobile1: "",
    mobile2: "",
    pincode: "",
    photo: "",
  });

  const [guaranteeDetailsData, setGuaranteeDetailsData] = useState({
    name: "",
    fatherName: "",
    work: "",
    address: "",
    mobile1: "",
    mobile2: "",
    pincode: "",
    photo: "",
  });

  const [vehicleDetailsData, setVehicleDetailsData] = useState({
    vehicleType: "",
    model: "",
    vehicleNumber: "",
    engineNumber: "",
    chasisNumber: "",
    variant: "",
    photo: "",
  });

  const [loanDetailsData, setLoanDetailsData] = useState({
    totalAmount: "",
    interestRate: "",
    installments: "",
    date: "",
    loanNumber: "",
    principlePerMo: "",
    interestAmountPerMo: ""
  });

  const [installmentsData, setInstallmentsData] = useState();

  const [calLoan, setCalLoan] = useState({
    calOriginal: "",
    calInterestAmount: "",
    calTotalAmount: "",
  });

  const handleLoaneeDetailsData = (event) => {
    if (event.target.type === "file") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLoaneeDetailsData({
            ...loaneeDetailsData,
            photo: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setLoaneeDetailsData({
        ...loaneeDetailsData,
        [event?.target?.name]: event?.target?.value,
      });
    }
  };

  const handleGuaranteeDetailsData = (event) => {
    if (event.target.type === "file") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGuaranteeDetailsData({
            ...guaranteeDetailsData,
            photo: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setGuaranteeDetailsData({
        ...guaranteeDetailsData,
        [event?.target?.name]: event?.target?.value,
      });
    }
  };

  const handleVehicleDetailsData = (event) => {
    if (event.target.type === "file") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setVehicleDetailsData({
            ...vehicleDetailsData,
            photo: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setVehicleDetailsData({
        ...vehicleDetailsData,
        [event?.target?.name]: event?.target?.value,
      });
    }
  };

  useEffect(() => {
    let original, intrestamt, total;
    if (
      loanDetailsData?.installments !== "" &&
      loanDetailsData?.interestRate !== "" &&
      loanDetailsData?.totalAmount !== "" &&
      loanDetailsData?.date !== ""
    ) {
      const interest = parseFloat(loanDetailsData?.interestRate) / 100;
      intrestamt = parseInt(loanDetailsData?.totalAmount) * interest;

      original =
        parseInt(loanDetailsData?.totalAmount) /
        parseInt(loanDetailsData?.installments);

      total = original + intrestamt;

      setCalLoan({
        calOriginal: Math.ceil(original),
        calInterestAmount: Math.ceil(intrestamt),
        calTotalAmount: Math.ceil(total),
      });
      setLoanDetailsData({
        ...loanDetailsData,
        principlePerMo: JSON.stringify(Math.ceil(original)),
        interestAmountPerMo: JSON.stringify(Math.ceil(intrestamt))
      });
    }

    const data = [];

    for (let i = 1; i <= loanDetailsData?.installments; i++) {
      const date = new Date(loanDetailsData?.date);
      date.setMonth(date.getMonth() + i);

      const obj = {
        installment: i,
        dueDate: date,
        paidDate: "",
        reciptNo: "",
        originalAmount: "",
        interestAmount: "",
        totalAmount: "",
        overDueAmount: "",
        overDueAmountPaid: "",
        overDueAmountBalance: "",
        originalBalance: "",
      };
      data.push(obj);
    }
    setInstallmentsData(data);

    
  }, [loanDetailsData?.installments, loanDetailsData?.interestRate, loanDetailsData?.totalAmount, loanDetailsData?.date]);

  const handleLoanDetailsData = (event) => {
    setLoanDetailsData({
      ...loanDetailsData,
      [event?.target?.name]: event?.target?.value,
    });
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    "Loan Details",
    "Loanee Details",
    "Guarantee Details",
    "Vehicle Details",
  ];

  ///////////snack

  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  //////////////////snack

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePost = () => {
    if (
      loaneeDetailsData?.name !== "" &&
      loaneeDetailsData?.fatherName !== "" &&
      loaneeDetailsData?.work !== "" &&
      loaneeDetailsData?.address !== "" &&
      loaneeDetailsData?.mobile1 !== "" &&
      guaranteeDetailsData?.name !== "" &&
      guaranteeDetailsData?.fatherName !== "" &&
      guaranteeDetailsData?.work !== "" &&
      guaranteeDetailsData?.address !== "" &&
      guaranteeDetailsData?.mobile1 !== "" &&
      vehicleDetailsData?.vehicleType &&
      vehicleDetailsData?.model !== "" &&
      vehicleDetailsData?.variant !== "" &&
      vehicleDetailsData?.vehicleNumber !== "" &&
      vehicleDetailsData?.engineNumber !== "" &&
      vehicleDetailsData?.chasisNumber !== "" &&
      loanDetailsData?.loanNumber !== "" &&
      loanDetailsData?.installments !== "" &&
      loanDetailsData?.interestRate !== "" &&
      loanDetailsData?.date !== "" &&
      loanDetailsData?.totalAmount !== ""
    ) {
      setLoader(true)
      const url = urlEdit()
      axios
        .post(`${url}/send`, {
          id: loanDetailsData?.loanNumber,
          loaneeDetailsData,
          guaranteeDetailsData,
          vehicleDetailsData,
          loanDetailsData,
          installmentsData,
        })
        .then((res) => {
          console.log(res);
          setLoader(false);
          navigate("/home");
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
      handleClose();
    } else {
      handleClose();
      handleClickSnack();
    }
  };

  return (
    <>
    { loader && <Loader />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnack}
        onClose={handleCloseSnack}
        autoHideDuration={5000}
        key={"top" + "center"}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          Fill all mandatory feilds
        </Alert>
      </Snackbar>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            <ArrowCircleLeftIcon />
          </Button>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Button disabled={activeStep === 3} onClick={handleNext}>
            <ArrowCircleRightIcon />
          </Button>
        </Box>
      </Box>

      <div>
        {activeStep === 0 && (
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="loanNumber"
                    name="loanNumber"
                    label="Loan Number"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loanDetailsData?.loanNumber}
                    onChange={handleLoanDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="date"
                    name="date"
                    // label="Interest rate (%)"
                    //fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="date"
                    value={loanDetailsData?.date}
                    onChange={handleLoanDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="totalAmount"
                    name="totalAmount"
                    label="Total Amount"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loanDetailsData?.totalAmount}
                    onChange={handleLoanDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="installments"
                    name="installments"
                    label="Installments (Months)"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loanDetailsData?.installments}
                    onChange={handleLoanDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="interestRate"
                    name="interestRate"
                    label="Interest rate (%)"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loanDetailsData?.interestRate}
                    onChange={handleLoanDetailsData}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 650 }}
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Principle (p.m)</TableCell>
                          <TableCell>Interest Amount (p.m)</TableCell>
                          <TableCell>Total Amount (p.m)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            {calLoan?.calOriginal ? calLoan?.calOriginal : "-"}
                          </TableCell>
                          <TableCell>
                            {calLoan?.calInterestAmount
                              ? calLoan?.calInterestAmount
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {calLoan?.calTotalAmount
                              ? calLoan?.calTotalAmount
                              : "-"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {activeStep === 2 && (
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
                Guarantee Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label="Name"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={guaranteeDetailsData?.name}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="fatherName"
                    name="fatherName"
                    label="Father Name"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={guaranteeDetailsData?.fatherName}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="work"
                    name="work"
                    label="Work"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={guaranteeDetailsData?.work}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="address"
                    name="address"
                    label="Address"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={guaranteeDetailsData?.address}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="mobile1"
                    name="mobile1"
                    label="Mobile Number 1"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={guaranteeDetailsData?.mobile1}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="mobile2"
                    name="mobile2"
                    label="Mobile Number 2"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={guaranteeDetailsData?.mobile2}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="pincode"
                    name="pincode"
                    label="Pincode"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={guaranteeDetailsData?.pincode}
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="photo"
                    name="photo"
                    label="Photo"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="file"
                    onChange={handleGuaranteeDetailsData}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {activeStep === 3 && (
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
                Vehicle Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="vehicleType"
                    name="vehicleType"
                    label="Vehicle Type"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={vehicleDetailsData?.vehicleType}
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="model"
                    name="model"
                    label="Model (Yr)"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={vehicleDetailsData?.model}
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="vehicleNumber"
                    name="vehicleNumber"
                    label="Vehicle Number"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={vehicleDetailsData?.vehicleNumber}
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="variant"
                    name="variant"
                    label="Variant"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={vehicleDetailsData?.variant}
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="engineNumber"
                    name="engineNumber"
                    label="Engine Number"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={vehicleDetailsData?.engineNumber}
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="chasisNumber"
                    name="chasisNumber"
                    label="Chasis Number"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={vehicleDetailsData?.chasisNumber}
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="photo"
                    name="photo"
                    label="Photo"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="file"
                    onChange={handleVehicleDetailsData}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {activeStep === 1 && (
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
                Loanee Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label="Name"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={loaneeDetailsData?.name}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="fatherName"
                    name="fatherName"
                    label="Father Name"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={loaneeDetailsData?.fatherName}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="work"
                    name="work"
                    label="Work"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={loaneeDetailsData?.work}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="address"
                    name="address"
                    label="Address"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={loaneeDetailsData?.address}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    id="mobile1"
                    name="mobile1"
                    label="Mobile Number 1"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loaneeDetailsData?.mobile1}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="mobile2"
                    name="mobile2"
                    label="Mobile Number 2"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loaneeDetailsData?.mobile2}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="pincode"
                    name="pincode"
                    label="Pincode"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="number"
                    value={loaneeDetailsData?.pincode}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="photo"
                    name="photo"
                    label="Photo"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    type="file"
                    //value={loaneeDetailsData?.photo}
                    onChange={handleLoaneeDetailsData}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {activeStep === 3 && (
          <Button
            variant="contained"
            // onClick={() => {
            //   handlePost();
            // }}
            onClick={handleClickOpen}
          >
            {" "}
            post
          </Button>
        )}

        <React.Fragment>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            {/* <DialogTitle id="responsive-dialog-title">
              {"Use Google's location service?"}
            </DialogTitle> */}
            <DialogContent>
              <DialogContentText>Are you sure want to add</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => {
                  handlePost();
                }}
              >
                OK
              </Button>
              <Button onClick={handleClose} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </div>
    </>
  );
}

export default AddUser;
