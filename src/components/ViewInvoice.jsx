import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Box,
} from '@mui/material';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const foundInvoice = storedInvoices.find(inv => inv.id === id);
    if (foundInvoice) {
      setInvoice(foundInvoice);
    }
  }, [id]);

  if (!invoice) {
    return <Typography>Loading...</Typography>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container maxWidth="md" className="print-section">
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          SHRI MAYAVAN TRADERS
        </Typography>
        <Typography>4/197, Bommaikuttaimedu, Namakkal - 637019</Typography>
        <Typography>Cell: 94431 89907, 80725 64095</Typography>
        <Typography>GSTIN: 33CNBPA5519C1ZQ</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography><strong>Invoice No.: {invoice.id}</strong></Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Date: {invoice.date}</strong></Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography><strong>Customer Name:</strong> {invoice.customerName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography><strong>Customer Address:</strong> {invoice.customerAddress}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography><strong>Party GSTIN:</strong> {invoice.partyGstin}</Typography>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Rate Rs Ps</TableCell>
              <TableCell>Amount Rs Ps</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{parseFloat(item.rate).toFixed(2)}</TableCell>
                <TableCell>{parseFloat(item.amount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '10px' }}>
            <Typography variant="h6">Bank Details:</Typography>
            <Typography>Name: Indian Bank</Typography>
            <Typography>A/c No.: 7728950252</Typography>
            <Typography>IFSC Code: IDIB000B176</Typography>
            <Typography>Branch: Bommaikuttimedu</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '10px' }}>
            <Typography>Total: {invoice.totalAmount.toFixed(2)}</Typography>
            <Typography>CGST 2.5%: {invoice.cgst.toFixed(2)}</Typography>
            <Typography>SGST 2.5%: {invoice.sgst.toFixed(2)}</Typography>
            <Typography><strong>Grand Total: {invoice.grandTotal.toFixed(2)}</strong></Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography style={{ marginTop: '20px' }}><strong>Notes:</strong> {invoice.notes}</Typography>
      <Box textAlign="right" mt={4}>
        <Typography>For SHRI MAYAVAN TRADERS</Typography>
        <Box mt={4}>
          <Typography>Authorized Signatory</Typography>
        </Box>
      </Box>
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handlePrint} className="no-print">
        Print Invoice
      </Button>
    </Container>
  );
};

export default ViewInvoice;

