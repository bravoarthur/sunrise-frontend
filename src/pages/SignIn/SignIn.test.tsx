import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import SignIn from ".";
import { doLogin } from "../../helpers/authHandler";


jest.mock('../../helpers/authHandler')
const mockedDoLogin = jest.mocked(doLogin)

describe("Login...", () => {

    afterEach(() => nock.cleanAll())

    it("Call 'doLogin' when server res ok", async () => {

        nock('http://192.168.0.3:4000')
            .intercept('/user/login', 'OPTIONS')
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/user/login')
            .reply(200, { status: 'ok' })


        render(<SignIn />, { wrapper: BrowserRouter })

        const buttonSendList = await screen.findByTestId('buttonLogin')

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedDoLogin).toBeCalledTimes(1))

    })
    it("Show error messsage and Avoid call 'doLogin", async () => {

        nock('http://192.168.0.3:4000')
            .intercept('/user/login', 'OPTIONS')
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/user/login')
            .reply(401, {
                error: [{ param: 'User Name/Password', msg: "Password or UserName is invalid" }]
            })


        render(<SignIn />, { wrapper: BrowserRouter })

        const buttonSendList = await screen.findByTestId('buttonLogin')

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedDoLogin).toBeCalledTimes(0))
        expect(await screen.findByText('Password or UserName is invalid', { exact: false })).toBeTruthy()

    })

});








