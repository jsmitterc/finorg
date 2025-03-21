"use client"
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useParams, usePathname, useRouter  } from 'next/navigation';
import { PageContainer } from '@toolpad/core';
import DynamicForm from '@/app/components/DynamicForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();
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
  const [formSchema, setFormSchema] = React.useState<any[]>([]);

  const [breadcrumbs, setBreadcrumbs] = React.useState([
          { title: 'Dashboard', path: '/dashboard' },
          { title: 'Accounts', path: '/accounts' },
          { title: `Account ${id}`, path: `/accounts/${id}/transactions` },
          { title: `Transaction ${transaction_id}`, path: `/accounts/${id}/transactions/${transaction_id}` },
      ]);
    
      const handleFormSubmit = async (data: any) => {
        const response = await fetch(`/api/accounts/${id}/transactions/${transaction_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          console.log(response.status);
          if (response.status == 200){
            toast.success("Transaction updated successfully!");
            router.back();
          }else{
            toast.error(result.error);
          }
      };


    // Fetch accounts data from the API when the component mounts
    React.useEffect(() => {
        const fetchAccounts = fetch(`/api/accounts`)
        .then((res) => res.json())
        .catch((error) => console.error('Error fetching accounts:', error));

        const fetchTransaction = fetch(`/api/${pathname}`)
        .then((res) => res.json())
        .catch((error) => console.error('Error fetching accounts:', error));

        const fetchCategories = fetch(`/api/categories`)
        .then((res) => res.json())
        .catch((error) => console.error('Error fetching accounts:', error));

        Promise.all([fetchAccounts,fetchTransaction, fetchCategories])
        .then(([accounts, transaction, categories]) => {
            const formattedAccounts = accounts.map((item: any) => ({ key: item.id, label: item.alias }));
            const cats = categories.map((item: any) => ({ key: item.id, label: item.name }));
            setAccounts(formattedAccounts);
            setTransactionDetails(transaction);


            // Update form schema once data is available
            setFormSchema([
                { name: "debit_account_id", label: "Debit Account", type: "select", options: formattedAccounts, required: true, defaultValue: transaction.debit_account_id },
                { name: "credit_account_id", label: "Credit Account", type: "select", options: formattedAccounts, required: true, defaultValue: transaction.credit_account_id },
                { name: "debit", label: "Debit", type: "text", required: true, defaultValue: transaction.debit || null, readOnly: true },
                { name: "credit", label: "Credit", type: "text", required: true, defaultValue: transaction.credit || null, readOnly: true },
                { name: "description", label: "Description", type: "text", required: true, defaultValue: transaction.description || null },
                { name: "date_transaction", label: "Transaction Date", type: "date", required: true, defaultValue: transaction.date_transaction || null },
                { name: "category_id", label: "Category", type: "select", options: cats, required: true, defaultValue: transaction.category_id }
            ]);

        })

    }, []);

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
        <DynamicForm schema={formSchema} onSubmit={handleFormSubmit}/> 
        <ToastContainer />  
    </PageContainer>

  );
}
