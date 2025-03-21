"use client"
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Account } from '@/types/account';
import { IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';


const paginationModel = { page: 0, pageSize: 100 };

export default function AccountPage() {

    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const router = useRouter();

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'alias', headerName: 'Alias', width: 240 },
        { field: 'balance', headerName: 'Balance', width: 240, type: 'number' },
        { field: 'date_created', headerName: 'Created At', width: 240 },
        {
          field: 'transactionDetails',
          headerName: 'Transaction Details',
          width: 150,
          renderCell: (params) => {
            // Here you can customize the icon and its functionality
            return (
              <IconButton
                color="primary"
                onClick={() => handleNavigateToTransactionDetails(params.row.id)} // Navigate to the transaction details page
              >
                <Visibility /> {/* Displaying an eye icon for visibility */}
              </IconButton>
            );
          },
        }
      ];

    const handleNavigateToTransactionDetails = (accountId: number) => {
        // Navigate to the transaction details page for this account using Next.js router
        router.push(`/accounts/${accountId}/transactions`,); // Adjust the path as needed
      };

      
    
    // Fetch accounts data from the API when the component mounts
    React.useEffect(() => {
        fetch('/api/accounts')
        .then((res) => res.json())
        .then((data) => setAccounts(data))
        .catch((error) => console.error('Error fetching accounts:', error));
    }, []);

  return (
      <DataGrid
        rows={accounts}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        checkboxSelection
        sx={{ border: 0 }}
        pageSizeOptions={[20]}
      />
  );
}