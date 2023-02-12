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
    checkDate?: Date,
    userChecker?: string,
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

        <>
            {
                logged &&  

                <div className={styles.pageContainer}>
                    
                    <div className={styles.buttonContainer}>
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

                </div>         
            }

            <div className={styles.pageContainer}>
                <h3>{logged? 'Orders to Review' : 'Open Orders'}</h3>
                <div className={styles.orderContainer}>

                    {orderList.map((item,index) => {

                       return <Link key={index} className={styles.item} to={logged? `/review/${item.id}` : `/checkitem/${item.id}`}>
                       
                                        
                                    <h4>Suplier: {item.suplier}</h4>
                                    <p>Order Date: {item.orderDate.substr(0,10)}</p> 
                                    <p>Total itens: {item.listOrder.length}</p>   
                                    <p>NOTE: {item.admDesc}</p>                

                                        
                              </Link>
                    })}                  



                </div>

            </div>          
           
        
        </>


    );
}

export default Home;