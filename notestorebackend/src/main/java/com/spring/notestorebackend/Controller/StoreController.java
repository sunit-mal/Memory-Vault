package com.spring.notestorebackend.Controller;

import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.notestorebackend.DTO.CommadDto;
import com.spring.notestorebackend.DTO.NoteDTO;
import com.spring.notestorebackend.Service.CommandStoreService;
import com.spring.notestorebackend.Service.NoteStoreService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/notestore")
public class StoreController {
	@Autowired
	private NoteStoreService noteStoreService;
	@Autowired
	private CommandStoreService commandStoreService;

	@PostMapping("/note/save")
	public ResponseEntity<Object> saveText(@RequestBody NoteDTO requestDTO) {
		String response = noteStoreService.saveText(requestDTO.getTitle(), requestDTO.getFullNote());
		if (response == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (response.equals("Success")) {
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		}
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@GetMapping("/note/fetch/{size}/{pageIndex}")
	public ResponseEntity<Object> fetchNotes(@PathVariable(name = "pageIndex") int pageIndex,
			@PathVariable(name = "size") int size) {
		Map<String, Object> response = noteStoreService.fetchNote(pageIndex, size);
		if (response == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (response.isEmpty()) {
			return new ResponseEntity<>("No notes found", HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@Transactional
	@DeleteMapping("/note/delete/{requestDTO}")
	public ResponseEntity<Object> deleteText(@PathVariable(name = "requestDTO") String requestDTO) {
		String respose = noteStoreService.deleteNote(requestDTO);
		if (respose == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (respose.equals("Success")) {
			return new ResponseEntity<>(respose, HttpStatus.OK);
		}
		return new ResponseEntity<>(respose, HttpStatus.BAD_REQUEST);
	}
	
	@GetMapping("/command/fetch/{size}/{pageIndex}")
	public ResponseEntity<Object> fetchCommands(@PathVariable(name = "pageIndex") int pageIndex,
			@PathVariable(name = "size") int size) {
		Map<String, Object> response = commandStoreService.fetchAllCommad(pageIndex, size);
		if (response == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (response.isEmpty()) {
			return new ResponseEntity<>("No commands found", HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/command/fetch-by-lang/{size}/{pageIndex}/{lang}")
	public ResponseEntity<Object> fetchCommandsByLang(@PathVariable(name = "pageIndex") int pageIndex,
			@PathVariable(name = "size") int size, @PathVariable(name = "lang") String lang) {
		Map<String, Object> response = commandStoreService.fetchAllByLanguage(lang, pageIndex, size);
		if (response == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (response.isEmpty()) {
			return new ResponseEntity<>("No commands found", HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/command/save")
	public ResponseEntity<Object> saveCommand(@RequestBody CommadDto requestDTO) {
		String response = commandStoreService.storeCommad(requestDTO);
		if (response == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (response.equals("Success")) {
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		}
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
	
	@Transactional
	@DeleteMapping("/command/delete/{id}")
	public ResponseEntity<Object> deleteCommand(@PathVariable(name = "id") Long id) {
		String respose = commandStoreService.delete(id);
		if (respose == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (respose.equals("Success")) {
			return new ResponseEntity<>(respose, HttpStatus.OK);
		}
		return new ResponseEntity<>(respose, HttpStatus.BAD_REQUEST);
	}
	
	@GetMapping("/command/get-lang")
	public ResponseEntity<Object> getLang() {
		Set<String> response = commandStoreService.fetAllLanguage();
		if (response == null) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (response.isEmpty()) {
			return new ResponseEntity<>("No languages found", HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
