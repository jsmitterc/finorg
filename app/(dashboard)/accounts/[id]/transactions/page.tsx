"use client"
import * as React from 'react';
import { DataGrid, GridColDef, GridSortDirection, GridSortModel } from '@mui/x-data-grid';
import { Account } from '@/types/account';
import { IconButton, Tooltip, Button  } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useActivePage } from '@toolpad/core/useActivePage';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Warning, CheckCircle, ArrowForwardIos } from '@mui/icons-material';


const paginationModel = { page: 0, pageSize: 100 };
const sortModel: GridSortModel = [{ field: 'date_transaction', sort: 'desc' as GridSortDirection}]

export default function AccountPage() {

    const { id } = useParams();
    const [accounts, setAccounts] = React.useState([]);
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = React.useState([
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Accounts', path: '/accounts' },
        ...(id ? [{ title: `Account ${id}`, path: `/accounts/${id}` }] : []),
    ]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'description', headerName: 'Description', width: 240 },
        { field: 'debit', headerName: 'Debit', width: 120, type: 'number' },
        { field: 'credit', headerName: 'Credit', width: 120, type: 'number' },
        { field: 'date_transaction', headerName: 'Created At', width: 240 },
        { field: 'category_name', headerName: 'Category', width: 240 },
        {
            field: 'status',
            headerName: '',
            width: 150,
            renderCell: (params) => {   


                console.log(params.row.debit_account_id)
                console.log(params.row.credit_account_id)
            
                const isReconciled = params.row.debit_account_id != null && params.row.credit_account_id != null;

            return (
                <Tooltip title={isReconciled ? 'Reconciled' : 'Non-Reconciled'} arrow>
                    <>
                        <IconButton
                        color="primary"
                        >
                        {isReconciled ? (
                            <CheckCircle color="success" /> // Green check-circle for reconciled
                        ) : (
                            <Warning color="warning" /> // Yellow warning for non-reconciled
                        )}
                        </IconButton> 

                        <IconButton
                        color="primary"
                        onClick={() => handleNavigateToTransactionDetails(params.row.id)}
                        >
                            <ArrowForwardIos color="info" />
                        </IconButton>                       
                    </>           
                </Tooltip>

            );
            },
        }
      ];


      const handleNavigateToTransactionDetails = (transaction_id: number) => {
        // Navigate to the transaction details page for this account using Next.js router
        router.push(`/accounts/${id}/transactions/${transaction_id}`,); // Adjust the path as needed
      };

    
    // Fetch accounts data from the API when the component mounts
    React.useEffect(() => {
        fetch(`/api/accounts/${id}/transactions`)
        .then((res) => res.json())
        .then((data) => setAccounts(data))
        .catch((error) => console.error('Error fetching accounts:', error));
        
    }, []);

  return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <Button variant="contained">Default</Button>
            <DataGrid
                rows={accounts}
                columns={columns}
                initialState={{ pagination: { paginationModel }, sorting: { sortModel: sortModel} }}
                checkboxSelection
                sx={{ 
                    border: 0,
                    '.MuiDataGrid-cell:focus': {
                        outline: 'none', // Removes focus outline
                    },
                    '.MuiDataGrid-cell:focus-within': {
                    outline: 'none', // Prevents focus highlight within cells
                    }
                }}
                pageSizeOptions={[20]}
                disableRowSelectionOnClick={true}
            />            
        </PageContainer>

  );
}