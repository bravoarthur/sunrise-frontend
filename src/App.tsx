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
import ReviewList from './pages/ReviewList';
import PrivateRouteHandler from './helpers/PrivateRouteHandler';


function App() {

  return (

    <div className='container'>
        <Header/>
          <Routes>

            <Route path='/' element={<Home/>} />                    
                    <Route path='/signin' element={<SignIn/>} />
                    <Route path='/signup' element={<SignUp/>}/> 
                    <Route path='/checkitem/:id' element={<CheckOrder/>}/> 
                    <Route path='/review/:id' element={
                        <PrivateRouteHandler>
                            <ReviewList/>
                        </PrivateRouteHandler>
                    }/> 
                    <Route path='/addproducts' element={
                        <PrivateRouteHandler>
                            <AddProducts/>
                        </PrivateRouteHandler>
                    }/> 
                    <Route path='/addcategory' element={
                        <PrivateRouteHandler>
                            <AddCategory/>
                        </PrivateRouteHandler>
                    }/> 
                    <Route path='/addsuplier' element={
                        <PrivateRouteHandler>
                            <AddSuplier/>
                        </PrivateRouteHandler>
                    }/> 
                    <Route path='/neworder' element={
                        <PrivateRouteHandler>
                            <NewOrder/>
                        </PrivateRouteHandler>
                    }/>
          </Routes>
        <Footer/>
      
    </div>

  );
}

export default App;
