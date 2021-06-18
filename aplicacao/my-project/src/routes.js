import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Tabela from './pages/Tabela';
import Error from './pages/Error';
import StoreProvider from './components/Store/Provider';
import RoutesPrivate from './components/Routes/Private/Private';
import CadastroCliente from './pages/CadastroCliente/Index';
import Atualizar from './pages/Atualizar/Index';


const Routes = () =>{
    return(
        <BrowserRouter>
            <StoreProvider>
                <Header/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <RoutesPrivate exact path="/tabela" component={Tabela}/>
                    <RoutesPrivate exact path="/cadastro" component={CadastroCliente}/>
                    <RoutesPrivate exact path="/atualizar" component={Atualizar}/>
                    <Route path="*" component={Error}/>
                </Switch>
            </StoreProvider>
        </BrowserRouter>
    )
}

export default Routes;