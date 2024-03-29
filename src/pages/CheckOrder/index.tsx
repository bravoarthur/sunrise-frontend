import styles from './CheckOrder.module.scss'
import useApi from '../../helpers/SunriseAPI'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorType, ListType } from '../../types/types'
import TablePreview from '../../components/TablePreview'


const CheckOrder = () => {

    let { id } = useParams()

    const api = useApi

    //const [products, setProducts] = useState([] as ProductsType[])
    const [orderList, setOrderList] = useState([] as ListType[])
    const [list, setList] = useState([] as ListType[])
    const [user, setUser] = useState('')
    const [description, setDescription] = useState('')
    const [divergent, setDivergent] = useState([] as number[])
    const [confirmClass, setConfirmClass] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState({
        param: '',
        msg: ''
    })


    useEffect(() => {
        const getOrder = async () => {
            if (!id) {
                setError({ param: 'List Error', msg: 'It Wasnt Possible to Load the List, back Home and Try Again' })
                return
            }

            const order = await api.getOrderItem({}, id)
            if (order.error) {
                setError(order.error[0])
                setBlocked(false)
            } else {
                setOrderList(order.listOrder)
            }
        }

        getOrder()
    }, [api, id])

    console.log(list)

    const qtdHandler = (item: ListType, value: number) => {

        const verifier = list.findIndex(it => item.idProduct === it.idProduct)
        if (verifier > -1) {
            const newList = list.map(item => item)

            if (value === 0) {
                newList.splice(verifier, 1)
                newList.sort((a, b) => {
                    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
                });
                setList(newList)
            } else {
                newList[verifier].qtd = value
                newList.sort((a, b) => {
                    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
                });
                setList(newList)
            }

        } else {

            if (value === 0) {
                return
            } else {
                const newItem: ListType = {
                    idProduct: item.idProduct,
                    product: item.product,
                    unit: item.unit,
                    qtd: value,
                    image: item.image,
                    divergent: item.divergent
                }
                const newList = list.map(item => item)
                newList.push(newItem)
                newList.sort((a, b) => {
                    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
                });
                setList(newList)
            }
        }
    }

    const handleSendOrder = async () => {

        setError({} as ErrorType)
        setBlocked(true)

        if (!user) {
            setError({ param: 'User', msg: 'Please add your Name' })
            setBlocked(false)
            return
        }

        if (list.length === 0) {
            setError({ param: 'Order', msg: 'The List is Empty - Select at Least one item' })
            setBlocked(false)
            return
        }

        const divergences: number[] = []

        if (list.length === orderList.length) {
            orderList.forEach((item, index) => {
                if (item.qtd === list[index].qtd) {
                    return
                } else {
                    divergences.push(index)
                }
            })
        } else {

            orderList.forEach((item, index) => {

                const check = list.filter((it, ind) => it.idProduct === item.idProduct && it.qtd === item.qtd)
                if (check.length === 0) {
                    divergences.push(index)
                }

            })

        }
        console.log(divergences)

        if (divergences.length === 0) {

            const json = await api.orderCheck(list, user, id, "CLOSE", description)

            if (json.error) {
                setError(json.error)
                setBlocked(false)
            } else {
                setSuccess({ param: 'Order', msg: 'Order Created Successfully' })
                setTimeout(() => {
                    setBlocked(false)
                    setSuccess({ param: '', msg: '' })
                    window.location.href = '/'
                }, 3000)
            }
        } else {

            setConfirmClass(true)
            setDivergent(divergences)

        }

    }

    const handleEditAgain = () => {
        setBlocked(false)
        setConfirmClass(false)
    }

    const handleConfirm = async () => {

        const json = await api.orderCheck(list, user, id, "DIVERGENT", description, divergent)

        if (json.error) {
            setError(json.error)
            setBlocked(false)
        } else {
            setSuccess({ param: 'Order', msg: 'Order Created Successfully' })
            setTimeout(() => {
                setSuccess({ param: '', msg: '' })
                setBlocked(false)
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

            <div className={styles.topInputs}>
                <label className={styles.inputArea}>
                    <div>User:</div>
                    <div>
                        <input type="text" data-testid='inputNameCheckList' disabled={blocked} placeholder='Type your name...' value={user} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUser(event.target.value)} />
                    </div>
                </label>
                <label className={styles.inputArea}>
                    <div>Note: </div>
                    <div>
                        <input type="text" disabled={blocked} placeholder='Type a note...' value={description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)} />
                    </div>
                </label>
            </div>

            <div className={styles.tableContainer}>
                <div className={confirmClass ? styles.confirmClass : styles.tableBox}>
                    <table cellSpacing={0} className={styles.tableInput}>
                        <thead>
                            <tr>
                                <th className={styles.thProduct}></th>
                                <th className={styles.thProduct}>Product</th>
                                <th className={styles.thUnit}>Unit</th>
                                <th className={styles.thQtd}>Qtd</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                orderList.map((item, index) =>

                                    <tr key={item.idProduct} className={(index % 2 === 0) ? styles.trColor : styles.trWhite}>
                                        <td><img width={50} height={50} src={item.image} alt="" className={styles.image} /></td>
                                        <td>{item.product}</td>
                                        <td>{item.unit}</td>
                                        <td><input disabled={blocked} type="number" min={0} data-testid={`inputQTDCheck${index}`} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { qtdHandler(item, Number(event.target.value)) }} /></td>
                                    </tr>

                                )}
                        </tbody>
                    </table>
                </div>

                <div className={!confirmClass ? styles.confirmClass : styles.tableDivergence}>

                    <div className={styles.divergence}>
                        <p>The List below is different from the Original Order....</p>

                    </div>
                    <div className={styles.buttons}>
                        <button onClick={handleEditAgain}>Edit Again</button>
                        <button onClick={handleConfirm}>Confirm </button>

                    </div>
                    <TablePreview list={list} />


                </div>

            </div>
            <div className={styles.buttonsArea}>

                <button disabled={blocked} className={confirmClass ? styles.confirmClass : styles.buttonSend} onClick={handleSendOrder}>Send List</button>
            </div>
        </div>

    )

}




export default CheckOrder