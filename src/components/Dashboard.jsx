import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices);
    setFilteredInvoices(storedInvoices);
  }, []);

  const handleEdit = (id) => {
    navigate(`/invoice/edit/${id}`);
  };

  const handleDelete = (id) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== invoiceToDelete);
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleDateFilter = () => {
    if (startDate && endDate) {
      const filtered = invoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
      });
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.id.toString().includes(term) ||
          invoice.date.toLowerCase().includes(term) ||
          invoice.customerName.toLowerCase().includes(term) ||
          invoice.grandTotal.toString().includes(term)
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredInvoices.map(({ items, notes, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'Invoices.xlsx');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Invoice Dashboard
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Invoice No, Date, Customer Name, or Total"
            variant="outlined"
            style={{ marginRight: '10px', width: '300px' }}
          />
         
        </div>
        <Button component={Link} to="/invoice/new" variant="contained" color="primary">
          Create New Invoice
        </Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
       <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: '10px' }}
          />
          <Button onClick={handleDateFilter} variant="contained" color="primary">
            Filter
          </Button>
          </div>
      <TableContainer component={Paper} style={{ marginBottom: '20px',marginTop:'30px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>₹{invoice.grandTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/invoice/${invoice.id}`}
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: '10px' }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleEdit(invoice.id)}
                    variant="outlined"
                    color="secondary"
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(invoice.id)} variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={exportToExcel} variant="contained" color="secondary" style={{ marginBottom: '20px' }}>
        Export to Excel
      </Button>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this invoice? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
