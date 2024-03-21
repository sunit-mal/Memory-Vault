package com.spring.notestorebackend.Service;

import java.util.Map;
import java.util.Set;

import com.spring.notestorebackend.DTO.CommadDto;

public interface CommandStoreService {
	Map<String, Object> fetchAllCommad(int page, int size);
	Map<String, Object> fetchAllByLanguage(String language, int page, int size);
	String storeCommad(CommadDto requestdto);
	String editCommand(CommadDto requesDto);
	String delete(long id);
	Set<String> fetAllLanguage();
}
