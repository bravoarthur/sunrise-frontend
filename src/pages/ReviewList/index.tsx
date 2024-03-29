import styles from './ReviewList.module.scss'
import useApi from '../../helpers/SunriseAPI'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorType, ListType } from '../../types/types'
import TablePreview from '../../components/TablePreview'



const ReviewList = () => {

    let { id } = useParams()

    const api = useApi

    //const [products, setProducts] = useState([] as ProductsType[])
    const [orderList, setOrderList] = useState([] as ListType[])
    const [list, setList] = useState([] as ListType[])
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState({
        param: '',
        msg: ''
    })


    useEffect(() => {
        const getOrder = async () => {
            if (!id) {
                return
            }
            const order = await api.getOrderItem({}, id)
            if (order.error) {
                setError(order.error[0])
            } else {
                setOrderList(order.listOrder)
                setList(order.listCheck)
            }
        }
        getOrder()
    }, [api, id])


    const handleCloseOrder = async () => {

        setError({ param: '', msg: '' })

        const json = await api.updateCloseOrder(id)

        if (json.error) {
            setError(json.error[0])

        } else {
            setSuccess({ param: 'Order', msg: 'Order Closed Successfully' })
            setTimeout(() => {
                setSuccess({ param: '', msg: '' })
                window.location.href = '/'
            }, 2500)
        }
    }



    return (
        <div className={styles.pageContainer}>

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

            <div className={styles.title}>
                Review Order
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableBox}>
                    <table cellSpacing={0} className={styles.tableInput}>
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

                                    <tr key={item.idProduct} className={(index % 2 === 0) ? item.divergent ? styles.divergentColor : styles.equalColor : item.divergent ? styles.divergentWhite : styles.equalWhite}>
                                        <td>{item.product}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.qtd}</td>
                                    </tr>

                                )}
                        </tbody>
                    </table>
                    <TablePreview list={list} />
                </div>

            </div>


            <div className={styles.buttonsArea}>

                <button className={styles.buttonClose} onClick={handleCloseOrder}>Close Order</button>
            </div>
        </div>

    )

}




export default ReviewList