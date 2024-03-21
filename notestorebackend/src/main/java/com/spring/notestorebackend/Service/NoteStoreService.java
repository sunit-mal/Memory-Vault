package com.spring.notestorebackend.Service;

import java.util.Map;


public interface NoteStoreService {
	String saveText(String title, String fullNote);
	String deleteNote(String title);
	Map<String, Object> fetchNote(int page, int size);
}
