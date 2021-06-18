import './styles.css';
import StoreContext from '../Store/Context';
import {Link} from 'react-router-dom';
import React, { useContext } from 'react';

export default function Header(){
    const { setToken } = useContext(StoreContext);
    return(
        <header>
            <Link className="logo" to="/tabela" >Dados</Link>
            <Link className="favoritos" onClick={() => setToken(null)} >Sair</Link>
        </header>
    )
}