import styles from './ReviewList.module.scss'
import useApi from '../../helpers/SunriseAPI'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type ListType = {
    idProduct: string,
    product: string,
    qtd: number,
    unit: string,
    image: string
}
type OrderListType = {
    idProduct: string,
    product: string,
    qtd: number,
    unit: string,
    image: string,
    divergent: boolean
}

type ErrorType = {
    param: string,
    msg: string
}

type OrderItemType = {
    _id: string,
    idSuplier: string,
    suplierName: string,
    idAdm: string,
    userchecker?: string,
    orderDate: Date,
    checkDate?: Date,
    status: string,
    listOrder: OrderListType[],
    listCheck: ListType[],
    admDesc: string,
    checkerDesc: string,
}
/*
type ProductsType = {
    id: string,
    category: string,
    name: string,
    unit: string,
    image: string
}*/
           

const ReviewList = () => {
    
    let {id} = useParams()
    
    const api = useApi
    
    //const [products, setProducts] = useState([] as ProductsType[])
    const [orderList, setOrderList] = useState([] as OrderListType[])    
    const [list, setList] = useState([] as ListType[]) 
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState({
        param: '',
        msg: ''
    })   
      

    useEffect(() => {
        const getOrder = async () => {
            if(!id) {  
                return
            }           
            const order: OrderItemType = await  api.getOrderItem({}, id) 
            setOrderList(order.listOrder)
            setList(order.listCheck)
        }
        getOrder()
    }, [api, id])          

    
    const handleCloseOrder = async () => {

        setError({param: '', msg: ''})

        const json = await api.updateCloseOrder(id)

            if(json.error) {
                setError(json.error[0])
                
            } else {
                setSuccess({param: 'Order', msg: 'Order Closed Successfully'})
                setTimeout(() => {
                    setSuccess({param: '', msg: ''})                    
                    window.location.href = '/'
                }, 2500)
            } 
    }
    


    return (
        <div> 

            {
                error.param && 
                <div className={styles.errorMessage}>
                    {`${error.param} error - ${error.msg}`}
                </div>
            }

            {
                success.param && 
                <div className={styles.successMessage}>
                    {`${success.msg}`}
                </div>
            }           

            <div className={styles.topInputs}>
                                     

            </div>

            <div className={styles.pageContainer}>
                <div className={styles.tableInput}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Unit</th>
                                <th>Qtd</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                orderList.map((item, index) => 

                            <tr key={item.idProduct} className={item.divergent? styles.divergent : ''}>
                                <td>{item.product}</td>
                                <td>{item.unit}</td>
                                <td>{item.qtd}</td>
                            </tr>                            

                            )}
                        </tbody>                
                    </table>     
                </div>

                <div className={styles.previewContainer}>                    
                    

                    <table className={styles.tablePreview}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Unit</th>
                                <th>Qtd</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                list.map((it, index) => 

                            <tr key={it.idProduct}>
                                <td>{it.product}</td>
                                <td>{it.unit}</td>
                                <td>{it.qtd}</td>
                            </tr>                            

                            )}
                            
                        </tbody>                
                    </table> 
                                               
                </div>

            </div>
            <div className={styles.buttonsArea}>
                
                <button className={styles.buttonClose} onClick={handleCloseOrder}>Close Order</button>
            </div>            
        </div>

    )

}




export default ReviewList