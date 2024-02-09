import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Paper, Typography, Grid, TextField, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { overDueCalculator, formatDateddmmyyyy } from "../../Common/Common";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

function PaymentEntry() {
  const navigate = useNavigate();
  const [loanNumber, setLoanNumber] = useState();
  const [loanNumberData, setLoanNumberData] = useState();
  const [loader, setLoader] = useState(false);
  const [dataPresent, setDataPresent] = useState(false);
  const [currentInstallment, setCurrentInstallment] = useState();
  const [principleBalanceTotal, setPrincipleBalanceTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [paymentDetailsData, setPaymentDetailsData] = useState({
    date: "",
    reciptNumber: "",
    principleAmount: "",
    interestAmount: "",
    overDueAmount: "",
    totalAmount: "",
    originalBalance: "",
  });

  const handlePaymentDetailsData = (event) => {
    setPaymentDetailsData({
      ...paymentDetailsData,
      [event?.target?.name]: event?.target?.value,
    });
  };

  const handleLoanNumber = (event) => {
    setErrorMessage("");
    setLoanNumber(event.target.value);
  };

  const fetchLoanNumberData = () => {
    setLoader(true)
    axios
      .get("http://localhost:4000/fetch/" + loanNumber)
      .then((res) => {
        if (typeof res?.data === "object") {
          setLoanNumberData(res?.data);
          setDataPresent(true);
          setLoader(false)
          handleClickOpen();
        }
      })
      .catch((err) => {
        setErrorMessage("No matching user found.");
        setLoader(false)
        console.log(err);
      });
  };

  useEffect(() => {
    let sort = [];
    loanNumberData?.installmentsData?.forEach((item) => {
      if (item?.originalAmount !== "") {
        setPrincipleBalanceTotal(
          principleBalanceTotal + parseInt(item?.originalAmount)
        );
      }
      if (item?.paidDate === "") {
        sort.push(item);
      }
    });
    if (sort?.[0]) {
      setCurrentInstallment(sort?.[0]);
    }
  }, [loanNumberData, loanNumber]);

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

  const handleClose = () => {
    setPaymentDetailsData({
      date: "",
      reciptNumber: "",
      principleAmount: "",
      interestAmount: "",
      overDueAmount: "",
      totalAmount: "",
      originalBalance: "",
    });
    setOpen(false);
    setLoanNumberData();
    setDataPresent(false);
    setLoanNumber();
  };

  console.log('@@@!! loader', loader)

  const updateLoanNumberData = () => {
    if (
      paymentDetailsData?.date !== "" &&
      paymentDetailsData?.reciptNumber !== "" &&
      paymentDetailsData?.principleAmount !== "" &&
      paymentDetailsData?.interestAmount !== "" &&
      paymentDetailsData?.overDueAmount !== ""
    ) {

      setOpen(false);
      setLoader(true)
      console.log('@@!! 2')
      const balance =
        parseInt(loanNumberData?.loanDetailsData?.totalAmount) -
        (parseInt(principleBalanceTotal) +
          parseInt(paymentDetailsData?.principleAmount));

      let newInstallment10 = {
        installment: currentInstallment?.installment,
        dueDate: currentInstallment?.dueDate,
        paidDate: paymentDetailsData?.date,
        reciptNo: paymentDetailsData?.reciptNumber,
        originalAmount: paymentDetailsData?.principleAmount,
        interestAmount: paymentDetailsData?.interestAmount,
        totalAmount: JSON.stringify(
          parseInt(paymentDetailsData?.principleAmount) +
            parseInt(paymentDetailsData?.interestAmount) +
            parseInt(paymentDetailsData?.overDueAmount)
        ),
        overDueAmount: JSON.stringify(
          overDueCalculator(
            paymentDetailsData?.date,
            currentInstallment?.dueDate,
            loanNumberData?.loanDetailsData?.principlePerMo,
            loanNumberData?.loanDetailsData?.interestAmountPerMo
          )
        ),
        overDueAmountPaid: paymentDetailsData?.overDueAmount,
        overDueAmountBalance:
          currentInstallment?.installment === "1"
            ? "0"
            : currentInstallment?.overDueAmountBalance,
        originalBalance: JSON.stringify(balance),
      };

      let indexOfInstallment10 = loanNumberData?.installmentsData.findIndex(
        (item) => item.installment === currentInstallment?.installment
      );

      if (indexOfInstallment10 !== -1) {
        loanNumberData?.installmentsData?.splice(
          indexOfInstallment10,
          1,
          newInstallment10
        );
      }
      if (
        indexOfInstallment10 !== -1 &&
        indexOfInstallment10 < loanNumberData.installmentsData.length - 1
      ) {
        let nextIndex = indexOfInstallment10 + 1;
        const bal =
          newInstallment10?.overDueAmount +
          newInstallment10?.overDueAmountBalance -
          newInstallment10?.overDueAmountPaid;
        loanNumberData.installmentsData[nextIndex].overDueAmountBalance =
          JSON.stringify(bal);
      }

      const newLoanNumberData = { ...loanNumberData };
      newLoanNumberData.installmentsData = [
        ...loanNumberData?.installmentsData,
      ];
      
      axios
        .put(
          "http://localhost:4000/update/" + loanNumberData?.id,
          newLoanNumberData
        )
        .then((res) => {
          setLoader(false)
          handleClose();
          setLoader(false)
          navigate("/home");
        })
        .catch((err) => {
          setLoader(false)
          console.log(err);
        });
    } else {
      handleClickSnack();
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {loader && <Loader />}
      <div>
        {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
      </div>
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
        <React.Fragment>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>HP Number : {loanNumberData?.id} </DialogTitle>
            <DialogTitle>
              Installment Number : {currentInstallment?.installment}{" "}
            </DialogTitle>
            <DialogTitle>
              Due Date : {formatDateddmmyyyy(currentInstallment?.dueDate)}{" "}
            </DialogTitle>

            <DialogContent>
              <TextField
                required
                margin="dense"
                id="date"
                name="date"
                ///label="Email Address"
                type="date"
                fullWidth
                variant="standard"
                value={paymentDetailsData?.date}
                onChange={handlePaymentDetailsData}
              />
              <TextField
                required
                margin="dense"
                id="reciptNumber"
                name="reciptNumber"
                label="Recipt Number"
                type="text"
                fullWidth
                variant="standard"
                value={paymentDetailsData?.reciptNumber}
                onChange={handlePaymentDetailsData}
                disabled={paymentDetailsData?.date === "" ? true : false}
              />
              <TextField
                required
                margin="dense"
                id="principleAmount"
                name="principleAmount"
                label={
                  loanNumberData?.installmentsData?.length ===
                  currentInstallment?.installment
                    ? `Principle Amount : ${
                        loanNumberData?.installmentsData?.[
                          loanNumberData?.installmentsData?.length - 2
                        ]?.originalBalance
                      }`
                    : `Principle Amount : ${loanNumberData?.loanDetailsData?.principlePerMo}`
                }
                type="text"
                fullWidth
                variant="standard"
                value={paymentDetailsData?.principleAmount}
                onChange={handlePaymentDetailsData}
                disabled={paymentDetailsData?.date === "" ? true : false}
              />
              <TextField
                required
                margin="dense"
                id="interestAmount"
                name="interestAmount"
                label={`Interest Amount : ${loanNumberData?.loanDetailsData?.interestAmountPerMo}`}
                type="text"
                fullWidth
                variant="standard"
                value={paymentDetailsData?.interestAmount}
                onChange={handlePaymentDetailsData}
                disabled={paymentDetailsData?.date === "" ? true : false}
              />
              <TextField
                required
                margin="dense"
                id="overDueAmount"
                name="overDueAmount"
                label={
                  currentInstallment?.overDueAmountBalance !== "0" ||
                  currentInstallment?.overDueAmountBalance !== ""
                    ? `Over Due Amount : ${
                        currentInstallment?.overDueAmountBalance
                      } + ${overDueCalculator(
                        paymentDetailsData?.date,
                        currentInstallment?.dueDate,
                        loanNumberData?.loanDetailsData?.principlePerMo,
                        loanNumberData?.loanDetailsData?.interestAmountPerMo
                      )} = ${
                        parseInt(currentInstallment?.overDueAmountBalance) +
                        overDueCalculator(
                          paymentDetailsData?.date,
                          currentInstallment?.dueDate,
                          loanNumberData?.loanDetailsData?.principlePerMo,
                          loanNumberData?.loanDetailsData?.interestAmountPerMo
                        )
                      }`
                    : `Over Due Amount : ${overDueCalculator(
                        paymentDetailsData?.date,
                        currentInstallment?.dueDate,
                        loanNumberData?.loanDetailsData?.principlePerMo,
                        loanNumberData?.loanDetailsData?.interestAmountPerMo
                      )}`
                }
                type="text"
                fullWidth
                variant="standard"
                value={paymentDetailsData?.overDueAmount}
                onChange={handlePaymentDetailsData}
                disabled={paymentDetailsData?.date === "" ? true : false}
              />
              <Typography>
                Total Amount :{" "}
                {parseInt(paymentDetailsData?.principleAmount) +
                  parseInt(paymentDetailsData?.interestAmount) +
                  parseInt(paymentDetailsData?.overDueAmount)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={updateLoanNumberData}>OK</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </div>
  );
}

export default PaymentEntry;
