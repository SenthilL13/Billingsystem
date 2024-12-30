import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const foundInvoice = storedInvoices.find(inv => inv.id === id);
    if (foundInvoice) {
      setInvoice(foundInvoice);
    } else {
      navigate('/'); // Redirect to dashboard if invoice not found
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = (quantity * rate).toFixed(2);
    }
    setInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { itemName: '', quantity: '', rate: '', amount: '0.00' }]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    if (!invoice) return { totalAmount: 0, cgst: 0, sgst: 0, grandTotal: 0 };
    const totalAmount = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const cgst = totalAmount * 0.025;
    const sgst = totalAmount * 0.025;
    const grandTotal = totalAmount + cgst + sgst;
    return { totalAmount, cgst, sgst, grandTotal };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { totalAmount, cgst, sgst, grandTotal } = calculateTotals();
    const updatedInvoice = {
      ...invoice,
      totalAmount,
      cgst,
      sgst,
      grandTotal
    };
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const updatedInvoices = storedInvoices.map(inv => inv.id === id ? updatedInvoice : inv);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    navigate('/');
  };

  if (!invoice) return <Typography>Loading...</Typography>;

  const { totalAmount, cgst, sgst, grandTotal } = calculateTotals();

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Edit Invoice - SHRI MAYAVAN TRADERS
        </Typography>
        <Typography>4/197, Bommaikuttaimedu, Namakkal - 637019</Typography>
        <Typography>Cell: 94431 89907, 80725 64095</Typography>
        <Typography>GSTIN: 33CNBPA5519C1ZQ</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography><strong>Invoice No.: {invoice.id}</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              name="date"
              value={invoice.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={invoice.customerName}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Customer Address"
              name="customerAddress"
              value={invoice.customerAddress}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Party GSTIN"
              name="partyGstin"
              value={invoice.partyGstin}
              onChange={handleInputChange}
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
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                      fullWidth
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      fullWidth
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      fullWidth
                      required
                    />
                  </TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Button onClick={() => removeItem(index)} color="secondary">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={addItem} style={{ marginTop: '10px' }}>
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
          name="notes"
          value={invoice.notes}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={3}
          style={{ marginTop: '20px' }}
        />
        <Box textAlign="right" mt={4}>
          <Typography>For SHRI MAYAVAN TRADERS</Typography>
          <Box mt={4}>
            <Typography>Authorized Signatory</Typography>
          </Box>
        </Box>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Update Invoice
        </Button>
      </form>
    </Container>
  );
};

export default EditInvoice;

