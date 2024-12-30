import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
} from '@mui/material';

const NewInvoice = () => {
  const navigate = useNavigate();
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [items, setItems] = useState([{ itemName: '', quantity: '', rate: '', amount: '0.00' }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const nextInvoiceNo = storedInvoices.length + 1;
    setInvoiceNo(nextInvoiceNo.toString().padStart(5));
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: '', rate: '', amount: '0.00' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = (quantity * rate).toFixed(2);
    }
    setItems(newItems);
  };

  const calculateTotals = () => {
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const cgst = totalAmount * 0.025;
    const sgst = totalAmount * 0.025;
    const grandTotal = totalAmount + cgst + sgst;
    return { totalAmount, cgst, sgst, grandTotal };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { totalAmount, cgst, sgst, grandTotal } = calculateTotals();
    const newInvoice = {
      id: invoiceNo,
      date,
      customerName,
      customerAddress,
      partyGstin,
      items,
      notes,
      totalAmount,
      cgst,
      sgst,
      grandTotal
    };
    const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    existingInvoices.push(newInvoice);
    localStorage.setItem('invoices', JSON.stringify(existingInvoices));
    navigate('/');
  };

  const { totalAmount, cgst, sgst, grandTotal } = calculateTotals();

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          SHRI MAYAVAN TRADERS
        </Typography>
        <Typography>4/197, Bommaikuttaimedu, Namakkal - 637019</Typography>
        <Typography>Cell: 94431 89907, 80725 64095</Typography>
        <Typography>GSTIN: 33CNBPA5519C1ZQ</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography><strong>Invoice No.: {invoiceNo}</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Customer Address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              fullWidth
              required
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Party GSTIN"
              value={partyGstin}
              onChange={(e) => setPartyGstin(e.target.value)}
              fullWidth
              required
            />
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={item.itemName}
                      onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                      fullWidth
                      required
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      fullWidth
                      required
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', e.target.value)}
                      fullWidth
                      required
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{parseFloat(item.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => removeItem(index)} 
                      color="error"
                      size="small"
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button 
          onClick={addItem} 
          variant="outlined" 
          size="small"
          sx={{ mt: 2, mb: 2 }}
        >
          Add Item
        </Button>

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
              <Typography>Total: {totalAmount.toFixed(2)}</Typography>
              <Typography>CGST 2.5%: {cgst.toFixed(2)}</Typography>
              <Typography>SGST 2.5%: {sgst.toFixed(2)}</Typography>
              <Typography><strong>Grand Total: {grandTotal.toFixed(2)}</strong></Typography>
            </Paper>
          </Grid>
        </Grid>

        <TextField
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mt: 3, mb: 3 }}
        />

        <Box textAlign="right" mt={4}>
          <Typography>For SHRI MAYAVAN TRADERS</Typography>
          <Box mt={4}>
            <Typography>Authorized Signatory</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 3 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Generate Invoice
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewInvoice;
