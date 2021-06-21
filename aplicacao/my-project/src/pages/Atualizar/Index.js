import { MenuItem, TextField, Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

var cont = 0;

export default function Atualizar() {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState({
        cep: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
        complemento: ""
    });
    const [telefones, setTelefones] = useState([]);
    const [emails, setEmails] = useState([]);
    let history = useHistory();
    const regEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const regNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\s]+$/
    const regNumero = /^\d+$/

    async function handleEnviar() {
        let erroEmail = 0
        let erroTelefone = 0

        const data = {
            id: id,
            nome: nome,
            cpf: cpf,
            endereco: endereco,
            telefone: telefones,
            email: emails
        };
        if (!(regNome.exec(nome))) return toast.error("Nome invalido!")
        if (!(regNumero.exec(cpf))) return toast.error("Cpf invalido!")
        if (!(regNumero.exec(endereco.cep))) return toast.error("Cep invalido!")
        for(var i=0; i< emails.length; i++){
            if (!(regEmail.exec(emails[i].texto))){
                erroEmail++
                return toast.error("Email invalido!")}
        }
        for(var i=0; i< telefones.length; i++){
            if (!((telefones[i].numero.length >= 8 && ((telefones[i].tipo === 'Residencial')||(telefones[i].tipo === 'Celular')||(telefones[i].tipo === 'Trabalho'))))){
                erroTelefone++
                return toast.error("Preencha o campo telefone certamente!")}
        }
        if ((erroEmail === 0 ) && (erroTelefone === 0 ) &&(nome.length > 3) && (nome.length <= 100) && (cpf.length === 11) && (endereco.cep.length > 0) && (endereco.logradouro.length > 0) && (endereco.bairro.length > 0) && (endereco.cidade.length > 0) && (endereco.uf.length > 0) && (telefones.length > 0) && (emails.length > 0)) {

            console.log(data)
            await api.put(`cliente/${id}`, data)
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })

            history.push('/tabela');
        }
        else {
            return toast.error("Preencha os campos certamente!")
        }
    }


    function updateField(event) {
        const end = { ...endereco }
        end[event.target.name] = event.target.value
        if (!(regNumero.exec(end.cep))) return toast.error("Somente numeros!")
        setEndereco(end)
    }

    function updateTelefoneTipo(e, index) {
        telefones[index].tipo = e.target.value;
        setTelefones([...telefones])
    }

    function updateTelefoneNumero(e, index) {
        telefones[index].numero = e.target.value;
        if (!(regNumero.exec(telefones[index].numero))) return toast.error("Somente numeros!")
        setTelefones([...telefones])
    }

    function handleAddTelefone(e) {
        e.preventDefault();
        setTelefones([...telefones, { tipo: "", numero: "" }]);
    }

    function updateEmail(e, index) {
        emails[index].texto = e.target.value;
        setEmails([...emails])
    }
    function handleAddEmail(e) {
        e.preventDefault();
        setEmails([...emails, { texto: "" }]);
    }

    function updateCpf(e) {
        let cpff = e.target.value;
        if(!(regNumero.exec(cpff))) return toast.error("Somente numeros!")
        setCpf(cpff)
    }

    function attCep() {
        if (endereco.cep.length < 8) {
            return;
        }
        else if(cont === 0){
            cont++;
            axios.get(`https://viacep.com.br/ws/${endereco.cep}/json/`)
            .then((res) => {
                setEndereco(prevState => {
                    return { ...prevState, 
                        logradouro: res.data.logradouro,
                        bairro: res.data.bairro,
                        cidade: res.data.localidade,
                        uf: res.data.uf
                    }
                });
                console.log(res.data)
            })
            console.log(endereco)
            
        }
    }

    /* function handleRemoveTel(post){
        setTelefones([telefones.filter((_,index) => index !== post)])
    }

    function handleRemoveEmail(post){
        setEmails([emails.filter((_,index) => index !== post)])
    } */


    useEffect(() => {

        async function attCliente() {
            const idCliente = sessionStorage.getItem('idCliente');
            api.get(`cliente/${idCliente}`).then((res) => {
                setId(res.data.id)
                setNome(res.data.nome)
                setCpf(res.data.cpf)
                setEndereco(res.data.endereco)
                setTelefones(res.data.telefone)
                setEmails(res.data.email)
            });
        }

        attCliente();
    }, []);


    return (
        <div>
            <div className="container" >
                <h1>Cadastro Cliente</h1>
                <TextField inputProps={{ maxLength: 100 }} placeholder="Nome" variant="outlined" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                <TextField inputProps={{ maxLength: 11 }} placeholder="CPF" variant="outlined" type="text" value={cpf} onChange={(e) => updateCpf(e)} />
                <h2>Endereço</h2>
                <TextField inputProps={{ maxLength: 8 }} onKeypress={attCep()} placeholder="CEP" variant="outlined" type="text" value={endereco.cep} name="cep" onChange={(e) => updateField(e)} />
                <TextField placeholder="Logradouro" variant="outlined" type="text" name="logradouro" value={endereco.logradouro} onChange={(e) => updateField(e)} />
                <TextField placeholder="Bairro" variant="outlined" type="text" value={endereco.bairro} name="bairro" onChange={(e) => updateField(e)} />
                <TextField placeholder="Cidade" variant="outlined" type="text" value={endereco.cidade} name="cidade" onChange={(e) => updateField(e)} />
                <TextField placeholder="UF" variant="outlined" type="text" value={endereco.uf} name="uf" onChange={(e) => updateField(e)} />
                <TextField placeholder="Complemento" variant="outlined" type="text" value={endereco.complemento} name="complemento" onChange={(e) => updateField(e)} />
                <h2>Telefone(s)</h2>
                {telefones.map((telefone, index) =>
                    <div style={{ flexDirection: 'column', display: 'flex' }} key={index}>
                        <>
                            <TextField select variant="outlined" value={telefone.tipo} name="tipo" onChange={((e) => updateTelefoneTipo(e, index))} >
                                <MenuItem value={"Residencial"}>Residencial</MenuItem>
                                <MenuItem value={"Celular"}>Celular</MenuItem>
                                <MenuItem value={"Trabalho"}>Trabalho</MenuItem>
                            </TextField>
                            <TextField inputProps={{ maxLength: 9 }} placeholder="Numero" name="numero" id="numero" value={telefone.numero} type="text" variant="outlined" onChange={(e) => updateTelefoneNumero(e, index)} /></>
                        {/*                             <Button color="danger" onClick={()=>{handleRemoveTel(index)}}>Excluir</Button>
 */}                        </div>)}
                <Button variant="contained" color="primary" onClick={handleAddTelefone}>Adicionar Telefone</Button>
                <h2>Email(s)</h2>
                {emails.map((email, index) =>
                    <div style={{ flexDirection: 'column', display: 'flex' }} key={index}>
                        <TextField placeholder="Email" name="email" id="email" value={email.texto} type="text" variant="outlined" onChange={(e) => updateEmail(e, index)} />
                        {/*                             <Button color="danger" onClick={()=>{handleRemoveEmail(index)}}>Excluir</Button>
 */}                        </div>)}
                <Button variant="contained" color="primary" onClick={handleAddEmail}>Adicionar Email</Button>
                <Button style={{ marginTop: '2%', backgroundColor: '#2E8B57' }} variant="contained" onClick={handleEnviar}>Enviar</Button>
            </div>
            {}
        </div>
    )
}
