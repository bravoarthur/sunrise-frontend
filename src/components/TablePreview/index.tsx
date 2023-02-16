import { ListType } from '../../types/types'
import styles from './TablePreview.module.scss'

interface listProps {
    list: ListType[]
}

const TablePreview = ({list}: listProps) => {   
    

    return (     

        <table className={styles.tablePreview}>
            <thead>
                <tr>
                    <th className={styles.thProduct}>Product</th>
                    <th className={styles.thUnit}>Unit</th>
                    <th className={styles.thQtd}>Qtd</th>
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
    )
}

export default TablePreview