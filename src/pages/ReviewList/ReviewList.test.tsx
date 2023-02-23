import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import ReviewList from ".";


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
        listCheck: [
            {
                idProduct: "63e79c028e95fc308b0f192a",
                product: "Coke",
                unit: "Unit",
                qtd: 5,
                image: "http://192.168.0.3:4000/media/default.jpg"
            },
            {
                idProduct: "63e49a8768fcc3653eda82cc",
                product: "Farinha",
                unit: "Kg",
                qtd: 8,
                image: "http://192.168.0.3:4000/media/default.jpg"
            },
            {
                idProduct: "63e3548c6c2ded2868cbc167",
                product: "Ovo",
                unit: "Unit",
                qtd: 8,
                image: "http://192.168.0.3:4000/media/default.jpg"
            }
        ],
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
    SunriseAPI.default.updateCloseOrder = () => mockedfn()
    
    return SunriseAPI
       
});


describe("Review List...", () => {    

    afterEach(() => nock.cleanAll())
    
    it("Call the API to close the order", async () => {                  
        
        mockedfn.mockImplementation(async (id: string) => {
            return {status: 'success'}
        })                

        nock('http://localhost:4000')        
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
                       
        render(<ReviewList/>, {wrapper: BrowserRouter})

        const buttonCloseOrder =  screen.getByText('Close Order')          

        fireEvent.click(buttonCloseOrder)
                     
        await waitFor(() =>expect(mockedfn).toBeCalledTimes(1))
        expect(await screen.findByText('Order Closed Successfully')).toBeTruthy()
       
    })

    it("Show Error message when server doesnt reply", async () => {                  
        
        mockedfn.mockImplementation(async (id: string) => {
            return {error: [{param: 'Server', msg: "Server is not Available"}]}
        })                

        nock('http://localhost:4000')        
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
        .reply(400, {
            body: {error: [{param: 'Server', msg: "Server is not Available"}]}
        })
                       
        render(<ReviewList/>, {wrapper: BrowserRouter})

        const buttonCloseOrder =  screen.getByText('Close Order')          

        fireEvent.click(buttonCloseOrder)
                     
        await waitFor(() =>expect(mockedfn).toBeCalledTimes(1))
        expect(await screen.findByText('Server is not Available', {exact: false})).toBeTruthy()
       
    })

});








