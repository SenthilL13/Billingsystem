import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function GeneratePDF() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Simulated API call to fetch invoice data
    const fetchInvoice = async () => {
      // In a real application, you would fetch this data from your API
      const mockInvoice = {
        id: id,
        date: '2023-05-15',
        customer_name: 'John Doe',
        party_gstin: 'GSTIN123456',
        items: [
          { item_name: 'Item 1', quantity: 2, rate: 100, amount: 200 },
          { item_name: 'Item 2', quantity: 1, rate: 150, amount: 150 },
        ],
        total_amount: 350,
        cgst: 8.75,
        sgst: 8.75,
        grand_total: 367.50,
        grand_total_words: 'Three Hundred Sixty Seven Rupees and Fifty Paise Only',
        notes: 'Thank you for your business!',
      };
      setInvoice(mockInvoice);
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" style={{ padding: '40px 0' }}>
      <div style={{ border: '2px solid #000', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <Typography variant="h4">SHRI MAYAVAN TRADERS</Typography>
        <Typography>4/197, Bommaikuttaimedu, Namakkal - 637019</Typography>
        <Typography>Cell: 94431 89907, 80725 64095</Typography>
        <Typography>GSTIN: 33CNBPA5519C1ZQ</Typography>
      </div>

      <div>
        <Typography><strong>Invoice No.: {invoice.id}</strong></Typography>
        <Typography><strong>Date: {invoice.date}</strong></Typography>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Typography><strong>Customer Name:</strong> {invoice.customer_name}</Typography>
        <Typography><strong>Party GSTIN:</strong> {invoice.party_gstin}</Typography>
      </div>

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
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.rate.toFixed(2)}</TableCell>
                <TableCell>{item.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ margin: '20px 0' }}>
        <Typography variant="h6">Bank Details:</Typography>
        <Typography>Name: Indian Bank</Typography>
        <Typography>A/c No.: 7728950252</Typography>
        <Typography>IFSC Code: IDIB000B176</Typography>
        <Typography>Branch: Bommaikuttimedu</Typography>
      </div>

      <div style={{ border: '1px solid #000', padding: '10px', margin: '20px 0' }}>
        <Typography><strong>Total:</strong> {invoice.total_amount.toFixed(2)}</Typography>
        <Typography><strong>CGST 2.5%:</strong> {invoice.cgst.toFixed(2)}</Typography>
        <Typography><strong>SGST 2.5%:</strong> {invoice.sgst.toFixed(2)}</Typography>
        <Typography><strong>Grand Total:</strong> {invoice.grand_total.toFixed(2)}</Typography>
      </div>

      <div>
        <Typography><strong>Amount in Rupees:</strong> {invoice.grand_total_words}</Typography>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Typography><strong>Notes:</strong> {invoice.notes}</Typography>
      </div>

      <div style={{ textAlign: 'right', marginTop: '40px' }}>
        <Typography>For SHRI MAYAVAN TRADERS</Typography>
        <br /><br />
        <Typography>Authorized Signatory</Typography>
      </div>
    </Container>
  );
}

export default GeneratePDF;

