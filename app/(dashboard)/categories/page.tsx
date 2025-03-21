"use client"
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Account } from '@/types/account';
import { IconButton, Fab, Box, Tooltip } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';

const paginationModel = { page: 0, pageSize: 100 };

export default function AccountPage() {

    const [categories, setCategories] = React.useState<Account[]>([]);
    const router = useRouter();

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Alias', width: 240 },
        {
                    field: '',
                    headerName: '',
                    width: 150,
                    renderCell: (params) => {   
      
                    return (
                        <Tooltip title={"delete"} arrow>
                          <IconButton color="primary" onClick={() => deleteCategory(params.row.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>                      
                        </Tooltip>
        
                    );
                    },
                }
      ];

    const deleteCategory = async (categoryId: number) => {
        const response = await fetch('/api/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"id": categoryId})
        })


        if (response.status == 200){
            
            setCategories((prev) => prev.filter(item => item.id == categoryId))
            toast.success("Transaction updated successfully!");
        }else{
            const result = await response.json();
            toast.error(result.error);
        }
      };

      
    
    // Fetch accounts data from the API when the component mounts
    React.useEffect(() => {
        fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error('Error fetching accounts:', error));
    }, []);

  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab color="primary" aria-label="add" onClick={() => router.push("/categories/add")}>
            <AddIcon />
        </Fab>
        <DataGrid
            rows={categories}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            checkboxSelection
            sx={{ border: 0 }}
            pageSizeOptions={[20]}
        />
    </Box>

  );
}