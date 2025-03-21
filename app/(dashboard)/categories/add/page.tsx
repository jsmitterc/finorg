"use client"
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useParams, usePathname  } from 'next/navigation';
import { PageContainer } from '@toolpad/core';
import DynamicForm from '@/app/components/DynamicForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function HomePage() {
  const pathname = usePathname();
  const {id, transaction_id} = useParams();
  const [accounts, setAccounts] = React.useState([]);
  const [transactionDetails, setTransactionDetails] = React.useState({
    debit_account_id : null,
    credit_account_id: null,
    debit: null,
    credit: null,
    description: null,
    date_transaction: null
  })
  const [formSchema, setFormSchema] = React.useState<any[]>([
    { name: "name", label: "Category Name", type: "text", required: true, defaultValue: "" }
]);

    
    const handleFormSubmit = async (data: any) => {
    const response = await fetch(`/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (response.status == 200){
    
            toast.success("Transaction updated successfully!");
        }else{
            const result = await response.json();
            toast.error(result.error);
        }
    };


  return (
    <PageContainer>
        <DynamicForm schema={formSchema} onSubmit={handleFormSubmit}/>   
    </PageContainer>

  );
}