import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDateddmmyyyy } from '../../Common/Common';

export default function DenseTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Installment</TableCell>
            <TableCell align="right">Due Date</TableCell>
            <TableCell align="right">Paid Date</TableCell>
            <TableCell align="right">Recipt No</TableCell>
            <TableCell align="right">Principle</TableCell>
            <TableCell align="right">Interest</TableCell>
            <TableCell align="right">Over Due</TableCell>
            <TableCell align="right">Over Due Balance</TableCell>
            <TableCell align="right">Over Due Paid</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Principle Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props?.data?.installmentsData?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">
                {row.installment}
              </TableCell>
              <TableCell align="right">{formatDateddmmyyyy(row.dueDate)}</TableCell>
              <TableCell align="right">{row.paidDate ? formatDateddmmyyyy(row.paidDate) : '-'}</TableCell>
              <TableCell align="right">{row.reciptNo ? row.reciptNo : '-'}</TableCell>
              <TableCell align="right">{row.paidDate ? row.originalAmount : '-'}</TableCell>
              <TableCell align="right">{row.paidDate ? row.interestAmount : '-'}</TableCell>
              <TableCell align="right">{row.overDueAmount ? row.overDueAmount : '-'}</TableCell>
              <TableCell align="right">{row.overDueAmountBalance ? row.overDueAmountBalance : '-'}</TableCell>
              <TableCell align="right">{row.overDueAmountPaid ? row.overDueAmountPaid : '-'}</TableCell>
              <TableCell align="right">{row.paidDate ? row.totalAmount : '-'}</TableCell>
              <TableCell align="right">{row.originalBalance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}