import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import SignUp from ".";
import { doLogin } from "../../helpers/authHandler";


jest.mock('../../helpers/authHandler')
const mockedDoLogin = jest.mocked(doLogin)

describe("Register...", () => {

    afterEach(() => nock.cleanAll())

    it("Call 'doLogin' when server res ok", async () => {

        nock('http://192.168.0.3:4000')
            .intercept('/user/register', 'OPTIONS')
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/user/register')
            .reply(200, { status: 'ok' })

        render(<SignUp />, { wrapper: BrowserRouter })

        const buttonSendList = await screen.findByTestId('buttonRegister')

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedDoLogin).toBeCalledTimes(1))

    })
    it("Show Message when password and confirmPass are diferent", async () => {

        nock('http://192.168.0.3:4000')
            .intercept('/user/register', 'OPTIONS')
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/user/register')
            .reply(200, { status: 'ok' })

        render(<SignUp />, { wrapper: BrowserRouter })

        const buttonSendList = await screen.findByTestId('buttonRegister')
        const password = await screen.findByTestId('passwordSignup')
        const confirmPassword = await screen.findByTestId('passwordConfirmSignup')
        fireEvent.change(password, { target: { value: 'password' } })
        fireEvent.change(confirmPassword, { target: { value: 'confirmpassword' } })

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedDoLogin).toBeCalledTimes(0))
        expect(await screen.findByText('Password is different of confirmation password', { exact: false })).toBeTruthy()

    })

});








