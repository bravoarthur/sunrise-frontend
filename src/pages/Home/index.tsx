import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { isLogged } from '../../helpers/authHandler';
import useApi from '../../helpers/SunriseAPI'
import { ErrorType, OrderListType } from '../../types/types';
import styles from './Home.module.scss'


function Home() {

    const api = useApi

    const logged = isLogged()
        
    //const [categories, setCategories] = useState([] as CategoriesType[])
    const [orderList, setOrderList] = useState([] as OrderListType[])
    const [error, setError] = useState({} as ErrorType)

    useEffect(() => {
        const getOrder = async () => {
            const olist = await  api.getOrder({status: logged ? "DIVERGENT": "OPEN" }) 
            if(olist.error) {                
                setError(olist.error[0])
            } else {                
                setOrderList(olist)
            } 
        }
        getOrder()
    }, [api, logged])    


    return (

        <div className={styles.pageContainer}>
            {error.param && 
                <div className={styles.errorMessage}>
                     {`${error.param} error - ${error.msg}`}
                </div>
                }
            {
                logged &&  

                <div className={styles.butContainer}>                    
                    
                    <Link className={styles.buttons} data-testid='loggedButtons' to={`/addcategory`}>        
                        Add Category
                    </Link>     
                    <Link className={styles.buttons} data-testid='loggedButtons' to={`/addsuplier`}>        
                        Add suplier
                    </Link>
                    <Link className={styles.buttons} data-testid='loggedButtons' to={`/addproducts`}>        
                        Add product
                    </Link>                              

                </div>         
            }

            <h1 className={styles.pageTitle}>{logged? 'Orders to Review' : 'Open Orders'}</h1>
            <div className={styles.ordersContainer}>
                <div className={styles.orderCard}>

                    {orderList.map((item,index) => {

                       return <Link key={index} data-testid="orderCard" className={styles.item} to={logged? `/review/${item.id}` : `/checkitem/${item.id}`}>
                       
                                        
                                    <h4>Suplier: {item.suplier}</h4>
                                    <p><strong>Order Date:</strong> {item.orderDate.substr(0,10)}</p>
                                    {logged && 
                                        <div>
                                            <div>
                                                <p><strong>Date Received:</strong> {item.checkDate? item.checkDate.substring(0,10) : ''}</p>        
                                            </div>
                                            <div>
                                                <p><strong>Checked by:</strong> {item.userchecker? item.userchecker : ''}</p>        
                                            </div>
                                        </div>
                                    
                                    } 
                                    <p><strong>Total itens:</strong> {item.listOrder.length}</p>   
                                    <p><strong>NOTE: </strong>{logged? item.checkerDesc : item.admDesc}</p>                

                                        
                              </Link>
                    })}                  



                </div>

            </div>          
           
        
        </div>


    );
}

export default Home;