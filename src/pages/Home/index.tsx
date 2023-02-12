import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { isLogged } from '../../helpers/authHandler';
import useApi from '../../helpers/SunriseAPI'
import styles from './Home.module.scss'

type ListType = {
    idProduct: string,
    product: string,
    qtd: number,
    image: string
}

type OrderType = {
    id: string,
    suplier: string,
    orderDate: string,
    checkDate?: string,
    userchecker?: string,
    listOrder: ListType[],
    listCheck: ListType[],
    admDesc?: string,
    checkerDesc?: string,
}


/*
type CategoriesType = {
    img: string,
    name: string,
    slug: string,
    _id: string
}*/

function Home() {

    const api = useApi

    const logged = isLogged()

    
    //const [categories, setCategories] = useState([] as CategoriesType[])
    const [orderList, setOrderList] = useState([] as OrderType[])

    useEffect(() => {
        const getOrder = async () => {
            const olist: OrderType[] = await  api.getOrder({status: logged ? "DIVERGENT": "OPEN" })            
            setOrderList(olist)
        }
        getOrder()
    }, [api, logged])    


    return (

        <div className={styles.pageContainer}>
            {
                logged &&  

                <div className={styles.butContainer}>                    
                    
                    <Link className={styles.buttons} to={`/addcategory`}>        
                        Add Category
                    </Link>     
                    <Link className={styles.buttons} to={`/addsuplier`}>        
                        Add suplier
                    </Link>
                    <Link className={styles.buttons} to={`/addproducts`}>        
                        Add product
                    </Link>                              

                </div>         
            }

            <h1 className={styles.pageTitle}>{logged? 'Orders to Review' : 'Open Orders'}</h1>
            <div className={styles.ordersContainer}>
                <div className={styles.orderCard}>

                    {orderList.map((item,index) => {

                       return <Link key={index} className={styles.item} to={logged? `/review/${item.id}` : `/checkitem/${item.id}`}>
                       
                                        
                                    <h4>Suplier: {item.suplier}</h4>
                                    <p>Order Date: {item.orderDate.substr(0,10)}</p>
                                    {logged && 
                                        <div>
                                            <div>
                                                <p>Date Received: {item.checkDate? item.checkDate.substring(0,10) : ''}</p>        
                                            </div>
                                            <div>
                                                <p>Checked by: {item.userchecker? item.userchecker : ''}</p>        
                                            </div>
                                        </div>
                                    
                                    } 
                                    <p>Total itens: {item.listOrder.length}</p>   
                                    <p>NOTE: {logged? item.checkerDesc : item.admDesc}</p>                

                                        
                              </Link>
                    })}                  



                </div>

            </div>          
           
        
        </div>


    );
}

export default Home;