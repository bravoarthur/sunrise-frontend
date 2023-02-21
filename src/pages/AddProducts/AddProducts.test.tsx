import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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


const mockedfn = jest.fn()
jest.mock("../../helpers/SunriseAPI", () => {
    const SunriseAPI = jest.requireActual("../../helpers/SunriseAPI")
    SunriseAPI.default.addProduct = () => mockedfn()
    
    return SunriseAPI
       
});


describe("Add Product...", () => {    

    afterEach(() => nock.cleanAll())
    
    it("Call the API when press Button", async () => {   
        
        mockedfn.mockImplementation(async (name: string) => {
            return {status: 'success'}
        })                

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
        const selectUnit = await screen.findByTestId('unitProductSelect')
        const selectCategory = await screen.findByTestId('categoryProductSelect')
        fireEvent.change(inputName, { target: { value: "New Product"}})        
        const option = await screen.findByText('Cat1')

        userEvent.selectOptions(selectUnit, ["Kg"])        
        userEvent.selectOptions(selectCategory, ['Cat1'])                      

        fireEvent.click(buttonAdd)
                     
        await waitFor(() =>expect(mockedfn).toBeCalledTimes(1))
        expect(await screen.findByText('Product Added Successfully')).toBeTruthy()
       
    })
    it("Show Error Message when Server responds problem", async () => {   
        
        mockedfn.mockImplementation(async (name: string) => {
            return {error: [{param: 'Server', msg: "Server is not Available"}]}
        })                

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
        const selectUnit = await screen.findByTestId('unitProductSelect')
        const selectCategory = await screen.findByTestId('categoryProductSelect')
        fireEvent.change(inputName, { target: { value: "New Product"}})        
        const option = await screen.findByText('Cat1')

        userEvent.selectOptions(selectUnit, ["Kg"])        
        userEvent.selectOptions(selectCategory, ['Cat1'])                      

        fireEvent.click(buttonAdd)
                     
        await waitFor(() =>expect(mockedfn).toBeCalledTimes(1))
        expect(await screen.findByText('Server is not Available', {exact: false})).toBeTruthy()
       
    })    
});







