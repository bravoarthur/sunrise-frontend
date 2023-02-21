import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import AddProducts from ".";
import SunriseAPI from "../../helpers/SunriseAPI";


const mockedCategoryList = {categoryList: [{_id: 'f2d1fd2f0d',
name: 'Cat1',
slug: 'Cat1'}, {_id: 'f2d1dffd2f0d',
name: 'Cat2',
slug: 'Cat2'},{_id: 'f2dfgfd2f0d',
name: 'Cat3',
slug: 'Cat3'}]} 



jest.mock("../../helpers/SunriseAPI", () => {
    const SunriseAPI = jest.requireActual("../../helpers/SunriseAPI")
    SunriseAPI.default.addProduct = jest.fn(() => {return {status: 'successfully'}})
    console.log(SunriseAPI)
    return SunriseAPI
       
});


describe("Add Product...", () => {    

    afterEach(() => nock.cleanAll())
    
    it("Call the API when press Button", async () => {    
        
        nock('http://localhost:4000')        
        .intercept('/category/list', 'OPTIONS' )
        .query({})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/category/list')
        .query({})
        .reply(200, {categoryList: mockedCategoryList.categoryList})                          
        
        render(<AddProducts/>, {wrapper: BrowserRouter})


        const buttonAdd =  screen.getByText('ADD ITEM')
        const inputName = screen.getByTestId('nameProductInput')
        const selectUnit = screen.getByTestId('unitProductSelect')
        const selectCategory = screen.getByTestId('categoryProductSelect')
        
        fireEvent.change(inputName, { target: { value: "New Product"}})
        fireEvent.change(selectUnit, { target: { value: "TESTE"}} )        
        const options = await screen.findAllByTestId('catProductOptions')
        fireEvent.change(selectCategory, { target: { value: options[1]}}  )
       
        console.log(options)

        fireEvent.click(buttonAdd)
                          
       //await waitFor(() =>expect(mockedAddProduct).toBeCalledTimes(1))
       //expect(await screen.findByText('test store', {exact: false})).toBeTruthy()
       expect( await screen.findByText('Product Added Successfully')).toBeTruthy()


    })
    /*
    it("Show Success Message", async () => {    
        mockedAddProduct.mockImplementation(async (name: string) => {
            return {status: 'New Suplier Added'}
        })   

        nock('http://localhost:4000')        
        .intercept('/category/list', 'OPTIONS' )
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .post('/category/list')        
        .reply(200, {
            body: {status: 'New Suplier Added'}
        })
                
        
        render(<AddSuplier/>, {wrapper: BrowserRouter})

        const buttonAdd =  screen.getByText('ADD SUPPLIER')
        const categoryField = screen.getByTestId('inputAddSuplier')
                  
        fireEvent.change(categoryField, { target: { value: "New Suplier"}})
        fireEvent.click(buttonAdd)
                                  
       expect( await screen.findByText('Suplier Added Successfully')).toBeTruthy()

    })   
    it("Show Error Message when API fails", async () => {    
        mockedAddProduct.mockImplementation(async (name: string) => {
            return {error: [{param: 'Server', msg: "Server is not Available"}]}
        })   

        nock('http://localhost:4000')        
        .intercept('/category/list', 'OPTIONS' )
        .reply(400)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .post('/category/list')        
        .reply(400, {
            body: {error: [{param: 'Server', msg: "Server is not Available"}]}
        })                
        
        render(<AddSuplier/>, {wrapper: BrowserRouter})

        const buttonAdd =  screen.getByText('ADD SUPPLIER')
        const categoryField = screen.getByTestId('inputAddSuplier')
                  
        fireEvent.change(categoryField, { target: { value: "New Suplier"}})
        fireEvent.click(buttonAdd)
                                  
       expect( await screen.findByText('Server is not Available', {exact: false})).toBeTruthy()

    })  */
    
});







