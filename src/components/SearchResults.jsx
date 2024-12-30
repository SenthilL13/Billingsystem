import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get('q');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch search results from API
    // For now, we'll use dummy data
    setResults([
      { id: 1, customerName: 'John Doe', date: '2023-05-01', totalAmount: 1000, status: 'pending' },
      { id: 2, customerName: 'Jane Smith', date: '2023-05-02', totalAmount: 1500, status: 'paid' },
    ]);
  }, [searchTerm]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results for "{searchTerm}"
      </Typography>
      {results.length > 0 ? (
        <List>
          {results.map((invoice) => (
            <ListItem key={invoice.id} divider>
              <ListItemText
                primary={`Invoice #${invoice.id} - ${invoice.customerName}`}
                secondary={`Date: ${invoice.date} | Amount: ₹${invoice.totalAmount.toFixed(2)} | Status: ${invoice.status}`}
              />
              <Button component={Link} to={`/invoice/${invoice.id}`} color="primary">
                View
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No results found for "{searchTerm}"</Typography>
      )}
      <Button component={Link} to="/" variant="contained" color="primary" style={{ marginTop: '2rem' }}>
        Back to Dashboard
      </Button>
    </Container>
  );
}

export default SearchResults;

