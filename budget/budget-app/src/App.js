import React, { useEffect, useState } from 'react';
import './index.css';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import uuid from 'react-uuid';

//const initialExpenses = [
 // {id:uuid(),charge:"food", amount:100},
//{id:uuid(),charge:"transport", amount:50},
 // {id:uuid(),charge:"rent", amount:500}
//];
const initialExpenses = localStorage.getItem('expenses')?JSON.parse(
  localStorage.getItem('expenses')) :[]

function App() {
  // ***************** state values ******************
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses)
  // single expense
  const [charge, setCharge] = useState('');
  // single amount
  const [amount, setAmount] = useState('');
  //alert
  const [alert, setAlert] = useState({show:false})
  // edit
  const [edit, setEdit] = useState(false)
  // edit item
  const [id, setId] = useState(0)
  // ********************use effect *******************
  useEffect(() => {
    console.log('use me');
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  // ***************** functionality *****************
// handle charge
const handleCharge = e => {
  setCharge(e.target.value);
}
// handle amount
const handleAmount = e => {
  setAmount(e.target.value);
}

//handle alert
const handleAlert = ({type, text}) => {
  setAlert({show: true, type, text });
  setTimeout(()=> {
    setAlert({show: false})
  }, 1000);
}

// handle submit
const handleSubmit = e => {
  e.preventDefault();
  if(charge !== '' && amount > 0){
    if (edit) {
      let tempExpenses = expenses.map(item => {
        return item.id === id ? {...item, charge, amount} : item;
      });
      setExpenses(tempExpenses);
      setEdit(false);
      handleAlert({type: 'success', text: 'item edited'});
    }
    else {
      const singleExpense = {id:uuid(), charge, amount};
    setExpenses([...expenses, singleExpense]);
    handleAlert({type: 'success', text: 'item added'});
    }
  
    setCharge('');
    setAmount('');
}
else {
//alert called
handleAlert({type: 'danger',
 text: `charge and amount can't be empty`})
}
}

// clear all items
const clearItems = () => {
  setExpenses([]);
  handleAlert({type:'danger', text: 'all items deleted'});
}
// handle edit
const handleEdit = id => {
let expense = expenses.find(item => item.id === id);
let {charge, amount} = expense
setCharge(charge);
setAmount(amount);
setEdit(true);
setId(id);
}
// handle delete
const handleDelete = id => {
  let tempExpenses = expenses.filter(item => item.id !== id);
  setExpenses(tempExpenses);
  handleAlert({type:'danger', text: 'item deleted'});
}


  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text} />}
    <Alert />
    <h1>Budget Calculator</h1>
    <main className='App'>
    <ExpenseForm
    charge={charge} amount={amount} handleAmount={handleAmount}
     handleCharge={handleCharge} handleSubmit={handleSubmit}
     edit={edit}
    />
    <ExpenseList expenses={expenses}
    clearItems={clearItems} handleEdit={handleEdit} handleDelete={handleDelete} />
    </main>
    <h1>Total Spending: <span className='total'>$ {expenses.reduce((acc, curr)=>{
      return (acc += parseInt(curr.amount))
    },0)}</span></h1>
    </>
  );
}

export default App;
