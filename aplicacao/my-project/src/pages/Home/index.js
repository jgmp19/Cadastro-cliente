import { useContext, useState } from 'react';
import './styles.css'
import { FormGroup  ,FormLabel, Button, Input} from '@material-ui/core';
import StoreContext from '../../components/Store/Context';
import { useHistory } from 'react-router-dom';
import {toast } from 'react-toastify';

function initialState(){
    return {user: '', password:''};
}

function login({user, password}){
    if(user === 'admin' && password === '123456'){
        return { token: '1234'}
    }
    else if(user === 'comum' && password === '123456'){
        return { token: '4321'}
    }
    else return toast.error('Usuario ou senha invalidos!');
    
}

export default function Home() {
    const [values, setValues] = useState(initialState);
    const {setToken} = useContext(StoreContext);
    const history = useHistory();

    function onChange(event) {
        const {value, name} = event.target;
        setValues({
            ...values,
            [name]: value,
        })
    }

    function onSubmit(event) {
        event.preventDefault();

        const { token } = login(values);
        
        if(token){
            setToken(token);
            return history.push('/tabela');
        }

        setValues(initialState);
    }

    return (
        <div>
            <div className="container">   
                <form onSubmit={onSubmit}>
                    <FormGroup size="lg">
                        <FormLabel>Login</FormLabel>
                        <Input name="user" onChange={onChange} value={values.user}/>
                    </FormGroup>
                    <FormGroup size="lg">
                        <FormLabel>Senha</FormLabel>
                        <Input type="password" name="password" onChange={onChange} value={values.password}/>
                    </FormGroup>
                    <Button type="submit">
                        Entrar
                    </Button>
                </form>
            </div> 
        </div>
    )
}