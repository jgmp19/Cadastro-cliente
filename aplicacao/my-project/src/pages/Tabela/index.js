import './styles.css';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});


export default function Tabela() {
    const classes = useStyles();

    const tokenUsuario = localStorage.getItem('token');
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadCliente() {
            await api.get(`cliente`)
                .then((res) => { setClientes(res.data) })
                .catch((err) => { console.error(err) })

            setLoading(false);
        }

        loadCliente();
    }, []);

    function deleteRow(id, e) {
        api.delete(`cliente/${id}`).then((res) => {
            console.log(res.data);
            api.get(`cliente`)
                .then((res) => { setClientes(res.data) })
                .catch((err) => { console.error(err) })
        })
    }

    if (loading) {
        return (
            <div className="tabela-info">
                <h1>Carregando informações do Cliente ... </h1>
            </div>
        )
    }
    return (
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell align="center">CPF</TableCell>
                            <TableCell align="center">Telefone</TableCell>
                            <TableCell align="center">Endereço</TableCell>
                            <TableCell align="center">Email</TableCell>
                            {tokenUsuario === `"1234"` ? <TableCell align="center">Ações</TableCell>:''}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.nome}
                                </TableCell>
                                <TableCell align="right" component="th" scope="row">{row.cpf}</TableCell>
                                <TableCell align="center" >
                                    {row.telefone.map((tel) => (
                                        <div>
                                            {`Telefone:${tel.numero} Tipo:${tel.tipo}`}
                                        </div>
                                    ))}</TableCell>

                                <TableCell align="center">{`CEP:${row.endereco.cep} Logradouro:${row.endereco.logradouro} Bairro:${row.endereco.bairro} Cidade:${row.endereco.cidade} UF:${row.endereco.uf}`}</TableCell>
                                <TableCell align="center">{row.email.map((e) => (
                                    <div>
                                        {e.texto}
                                    </div>
                                ))}</TableCell>

                                { tokenUsuario === `"1234"` ? <TableCell align="center"><Button variant="contained" color="secondary" onClick={(e) => deleteRow(row.id, e)}>Delete</Button> <Button variant="contained" color="default">{sessionStorage.setItem("idCliente", row.id)}<Link to="/atualizar">Atualizar</Link></Button></TableCell> : ''}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {tokenUsuario === `"1234"` ? <Button style={{ marginTop: '2%', backgroundColor: '#2E8B57' }} variant="contained"> <Link style={{ textDecoration: 'none', color: 'white' }} to="/cadastro">Cadastrar Cliente</Link></Button> : ''}
        </div>
    )
}