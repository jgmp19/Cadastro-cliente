package com.example.demo.Controller;

import java.util.List;
import java.util.Optional;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;

@RestController
public class ClienteController {

	@Autowired
	ClienteRepository repository;
	
	@GetMapping("/cliente")
	public List<Cliente> getAllUsuarios(){
		return repository.findAll();
	}
	
	@GetMapping("/cliente/{id}")
	public Optional<Cliente> getAllUsuariosByID(@PathVariable(name = "id", required = true) Long id){
		return repository.findById(id);
	}
	
	@PostMapping("/cliente")
	public Cliente saveCliente(@RequestBody Cliente cliente) {
		System.out.println("\n AQUI ESTOU \n"+cliente.toString());
		return repository.save(cliente);
	}
	
	@DeleteMapping("/cliente/{id}")
	public void deleteCliente(@PathVariable(name = "id", required = true) Long id) {
		repository.deleteById(id);
	}
	
	@PutMapping(value="/cliente/{id}")
	public ResponseEntity update(@PathVariable("id") long id,
	                                      @RequestBody Cliente cliente) {
	   return repository.findById(id)
	           .map(record -> {
	               record.setNome(cliente.getNome());
	               record.setEmail(cliente.getEmail());
	               record.setCpf(cliente.getCpf());
	               record.setTelefone(cliente.getTelefone());
	               record.setEndereco(cliente.getEndereco());
	               Cliente updated = repository.save(record);
	               return ResponseEntity.ok().body(updated);
	           }).orElse(ResponseEntity.notFound().build());
	}
	
}
