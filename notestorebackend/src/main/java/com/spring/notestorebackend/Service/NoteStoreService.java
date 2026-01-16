package com.spring.notestorebackend.Service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface NoteStoreService {
	String saveText(String title, String fullNote, MultipartFile image);

	String deleteNote(Long id);

	Map<String, Object> fetchNote(int page, int size);
}
