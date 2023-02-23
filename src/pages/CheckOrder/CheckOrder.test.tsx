import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import CheckOrder from ".";



const mockedOrderItem = {
    order: {
        _id: 'MOCKEDID',
        idSuplier: 'IDSUPLIER',
        suplierName: 'Mocked Suplier',
        idAdm: 'ADMINMOCKED',
        userchequer: 'USERCHECKERMOCKED',
        orderDate: '25/02/2000',
        checkDate: '25/02/2000',
        status: 'DIVERGENT',
        listOrder: [
            {
                idProduct: "63e79c028e95fc308b0f192a",
                product: "Coke",
                unit: "Unit",
                qtd: 5,
                image: "http://192.168.0.3:4000/media/default.jpg",
                divergent: false
            },
            {
                idProduct: "63e49a8768fcc3653eda82cc",
                product: "Farinha",
                unit: "Kg",
                qtd: 5,
                image: "http://192.168.0.3:4000/media/default.jpg",
                divergent: true
            },
            {
                idProduct: "63e3548c6c2ded2868cbc167",
                product: "Ovo",
                unit: "Unit",
                qtd: 5,
                image: "http://192.168.0.3:4000/media/default.jpg",
                divergent: true
            }
        ],
        listCheck: [],
        admDesc: 'DescriptionADM',
        checkerDesc: 'Description User'
    }
}

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
    useParams: () => ({ id: "MOCKEDID" })
}));


const mockedfn = jest.fn()
jest.mock("../../helpers/SunriseAPI", () => {
    const SunriseAPI = jest.requireActual("../../helpers/SunriseAPI")
    SunriseAPI.default.orderCheck = () => mockedfn()
    
    return SunriseAPI       
});


describe("Review List...", () => {    

    afterEach(() => nock.cleanAll())
    
    it("Call the API to close the order when Qtd matches", async () => {                  
        
        mockedfn.mockImplementation(async (id: string) => {
            return {status: 'success'}
        })                

        nock('http://192.168.0.3:4000')        
        .intercept('/order/item/MOCKEDID', 'OPTIONS' )
        .query({})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/order/item/MOCKEDID')
        .query({})
        .reply(200, {order: mockedOrderItem.order })
                       
        render(<CheckOrder/>, {wrapper: BrowserRouter})

        const buttonCloseOrder =  screen.getByText('Send List')    
        const item1 = await screen.findByTestId('inputQTDCheck0')
        const item2 = await screen.findByTestId('inputQTDCheck1')
        const item3 = await screen.findByTestId('inputQTDCheck2')
        const name = await screen.findByTestId('inputNameCheckList')
        
        fireEvent.change(item1, {target: {value: 5}})
        fireEvent.change(item2, {target: {value: 5}})
        fireEvent.change(item3, {target: {value: 5}})
        fireEvent.change(name, {target: {value: 'UserName'}})        

        fireEvent.click(buttonCloseOrder)
                     
        await waitFor(() =>expect(mockedfn).toBeCalledTimes(1))
        expect(await screen.findByText('Order Created Successfully')).toBeTruthy()
       
    })
    it("Dont Call API when QTD is different and show msg", async () => {                  
        
        mockedfn.mockImplementation(async (id: string) => {
            return {status: 'success'}
        })                

        nock('http://192.168.0.3:4000')        
        .intercept('/order/item/MOCKEDID', 'OPTIONS' )
        .query({})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/order/item/MOCKEDID')
        .query({})
        .reply(200, {order: mockedOrderItem.order })
                       
        render(<CheckOrder/>, {wrapper: BrowserRouter})

        const buttonCloseOrder =  screen.getByText('Send List')    
        const item1 = await screen.findByTestId('inputQTDCheck0')
        const item2 = await screen.findByTestId('inputQTDCheck1')
        const item3 = await screen.findByTestId('inputQTDCheck2')
        const name = await screen.findByTestId('inputNameCheckList')
        
        fireEvent.change(item1, {target: {value: 4}})
        fireEvent.change(item2, {target: {value: 5}})
        fireEvent.change(item3, {target: {value: 5}})
        fireEvent.change(name, {target: {value: 'UserName'}})
        
        fireEvent.click(buttonCloseOrder)
                     
        await waitFor(() =>expect(mockedfn).toBeCalledTimes(0))
        expect(await screen.findByText('The List below is different from the Original Order....')).toBeTruthy()
       
    })

});








