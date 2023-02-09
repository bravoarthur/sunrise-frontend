import React from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import CheckOrder from './pages/CheckOrder';
import AddProducts from './pages/AddProducts';
import AddCategory from './pages/AddCategory';
import AddSuplier from './pages/AddSuplier';
import NewOrder from './pages/NewOrder';


function App() {

  return (

    <>
		<Header/>
			<Routes>

				<Route path='/' element={<Home/>} />                    
                <Route path='/signin' element={<SignIn/>} />
                <Route path='/signup' element={<SignUp/>}/> 
				        <Route path='/checkitem/:id' element={<CheckOrder/>}/> 
                <Route path='/addproducts' element={<AddProducts/>}/> 
                <Route path='/addcategory' element={<AddCategory/>}/> 
                <Route path='/addsuplier' element={<AddSuplier/>}/> 
                <Route path='/neworder' element={<NewOrder/>}/>
			</Routes>
		<Footer/>
      
    </>

  );
}

export default App;
