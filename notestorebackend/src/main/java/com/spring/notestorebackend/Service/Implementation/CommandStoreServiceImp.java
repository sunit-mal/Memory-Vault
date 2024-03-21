package com.spring.notestorebackend.Service.Implementation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.notestorebackend.DTO.CommadDto;
import com.spring.notestorebackend.Entity.CommandStrore;
import com.spring.notestorebackend.Helper.ExceptionStore;
import com.spring.notestorebackend.Repository.CommandStoreRepo;
import com.spring.notestorebackend.Service.CommandStoreService;

@Service
public class CommandStoreServiceImp implements CommandStoreService {
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private CommandStoreRepo commandStoreRepo;
	@Autowired
	private ExceptionStore exceptionStore;

	@Override
	public Map<String, Object> fetchAllCommad(int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CommandStrore> commandList = commandStoreRepo.findAllByOrderByInsertDateDesc(pageable);
			if (commandList.isEmpty()) {
				exceptionStore.storeFile(CommandStoreServiceImp.class, "fetchAllCommad", "No command found");
				return new HashMap<>();
			} else {
				List<CommadDto> commandDtoList = commandList.stream()
						.map(command -> modelMapper.map(command, CommadDto.class)).toList();
				Map<String, Object> response = new HashMap<>();
				Map<String, Object> pagination = new HashMap<>();
				pagination.put("totalPages", commandList.getTotalPages());
				pagination.put("pageIndex", commandList.getNumber());
				pagination.put("totalElements", commandList.getTotalElements());
				response.put("pagination", pagination);
				response.put("Content", commandDtoList);
				return response;
			}
		} catch (Exception e) {
			exceptionStore.storeFile(CommandStoreServiceImp.class, "fetchAllCommad", e.getMessage());
			return null;
		}
	}

	@Override
	public Map<String, Object> fetchAllByLanguage(String language, int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CommandStrore> commandList = commandStoreRepo.findAllByLanguageOrderByInsertDateDesc(pageable,
					language);
			if (commandList.isEmpty()) {
				exceptionStore.storeFile(CommandStoreServiceImp.class, "fetchAllCommad", "No command found");
				return new HashMap<>();
			} else {
				List<CommadDto> commandDtoList = commandList.stream()
						.map(command -> modelMapper.map(command, CommadDto.class)).toList();

				Map<String, Object> response = new HashMap<>();
				Map<String, Object> pagination = new HashMap<>();
				pagination.put("totalPages", commandList.getTotalPages());
				pagination.put("pageIndex", commandList.getNumber());
				pagination.put("totalElements", commandList.getTotalElements());
				response.put("pagination", pagination);
				response.put("Content", commandDtoList);
				return response;
			}
		} catch (Exception e) {
			exceptionStore.storeFile(CommandStoreServiceImp.class, "fetchAllCommad", e.getMessage());
			return null;
		}
	}

	@Override
	public String storeCommad(CommadDto requestdto) {
		try {
			CommandStrore commandStrore = new CommandStrore();
			commandStrore.setCommand(requestdto.getCommand());
			commandStrore.setLanguage(requestdto.getLanguage());
			commandStoreRepo.save(commandStrore);
			return "Success";
		} catch (Exception e) {
			exceptionStore.storeFile(CommandStoreServiceImp.class, "storeCommad", e.getMessage());
			return null;
		}
	}

	@Override
	public String editCommand(CommadDto requesDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String delete(long id) {
		try {
			CommandStrore commandStrore = commandStoreRepo.findById(id).get();
			if (commandStrore == null) {
				return "Not Found";
			} else {
				commandStoreRepo.delete(commandStrore);
				return "Success";
			}
		} catch (Exception e) {
			exceptionStore.storeFile(CommandStoreServiceImp.class, "delete", e.getMessage());
			return null;
		}
	}
	
	@Override
	public Set<String> fetAllLanguage() {
		Set<String> languageList = commandStoreRepo.findAll().stream().map(command -> command.getLanguage())
				.collect(Collectors.toSet());
		return languageList;
	}

}
