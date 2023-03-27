import {Navigate, RouteProps} from 'react-router-dom';
import { isLogged } from './authHandler';
  
function PrivateRouteHandler({ children }: RouteProps) {

    const logged = isLogged()

    return (
        <>
            {logged
              ? children
              : <Navigate to="/signin"/>
            }
        </>
    );
}

export default PrivateRouteHandler