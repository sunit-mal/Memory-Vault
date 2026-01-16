package com.spring.notestorebackend.Service.Implementation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.web.multipart.MultipartFile;
import com.spring.notestorebackend.DTO.NoteDTO;
import com.spring.notestorebackend.Entity.NoteOverFlow;
import com.spring.notestorebackend.Entity.NoteStore;
import com.spring.notestorebackend.Helper.ExceptionStore;
import com.spring.notestorebackend.Repository.NoteOverflowRepo;
import com.spring.notestorebackend.Repository.NoteStoreRepo;
import com.spring.notestorebackend.Service.NoteStoreService;
import org.springframework.util.StringUtils;

@Service
public class NoteStoreServiceImp implements NoteStoreService {
	@Autowired
	private NoteStoreRepo noteStoreRepo;
	@Autowired
	private NoteOverflowRepo noteOverflowRepo;
	@Autowired
	private ExceptionStore exceptionStore;

	private final String UPLOAD_DIR = "./media";

	@Override
	public String saveText(String title, String fullNote, MultipartFile image) {
		try {
			NoteStore initialEntity = new NoteStore();
			initialEntity.setTitle(title);
			if (image != null && !image.isEmpty()) {
				String fileName = System.nanoTime() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
				Path uploadPath = Paths.get(UPLOAD_DIR);
				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}
				Path filePath = uploadPath.resolve(fileName);
				Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
				initialEntity.setImage("/media/" + fileName);
			}
			int noteLength = fullNote.length();
			if (noteLength <= 255) {
				initialEntity.setInitialNote(fullNote);
				noteStoreRepo.save(initialEntity);
			} else {
				initialEntity.setInitialNote(fullNote.substring(0, 255));
				initialEntity = noteStoreRepo.save(initialEntity);
				String overflowNote = fullNote.substring(255);
				while (overflowNote.length() > 0) {
					NoteOverFlow overflowEntity = new NoteOverFlow();
					if (overflowNote.length() >= 255) {
						overflowEntity.setOverflowNote(overflowNote.substring(0, 255));
						overflowEntity.setNoteStore(initialEntity);
						noteOverflowRepo.save(overflowEntity);
						overflowNote = overflowNote.substring(255);
					} else {
						overflowEntity.setOverflowNote(overflowNote);
						overflowEntity.setNoteStore(initialEntity);
						noteOverflowRepo.save(overflowEntity);
						break;
					}
				}
			}
			return "Success";
		} catch (Exception e) {
			exceptionStore.storeFile(NoteStoreServiceImp.class, "saveText", e.getMessage());
			return null;
		}

	}

	@Override
	public Map<String, Object> fetchNote(int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<NoteStore> noteStorePage = noteStoreRepo.findAllByOrderByInsertDateDesc(pageable);
			List<NoteDTO> noteDTOList = noteStorePage.map(noteStore -> {
				NoteDTO noteDTO = new NoteDTO();
				noteDTO.setId(noteStore.getId());
				noteDTO.setTitle(noteStore.getTitle());
				if (noteStore.getImage() != null) {
					noteDTO.setImage(noteStore.getImage());
				}
				if (noteOverflowRepo.existsByNoteStore(noteStore)) {
					String initialNote = fetchSequentialText(noteStore.getId());
					noteDTO.setFullNote(initialNote);
				} else {
					noteDTO.setFullNote(fetchSequentialText(noteStore.getId()));
				}
				return noteDTO;
			}).getContent();
			if (noteDTOList.isEmpty()) {
				exceptionStore.storeFile(NoteStoreServiceImp.class, "fetchNote", "No Data Found");
				return new HashMap<>();
			}
			Map<String, Object> response = new HashMap<>();
			Map<String, Object> pagination = new HashMap<>();
			pagination.put("totalPages", noteStorePage.getTotalPages());
			pagination.put("pageIndex", noteStorePage.getNumber());
			pagination.put("totalElements", noteStorePage.getTotalElements());
			response.put("pagination", pagination);
			response.put("Content", noteDTOList);
			return response;
		} catch (Exception e) {
			exceptionStore.storeFile(NoteStoreServiceImp.class, "fetchNote", e.getMessage());
			return null;
		}
	}

	private String fetchSequentialText(Long id) {
		try {
			NoteStore initialEntity = noteStoreRepo.findById(id).get();
			StringBuilder stringBuilder = new StringBuilder();
			stringBuilder.append(initialEntity.getInitialNote());
			List<NoteOverFlow> overflowEntities = noteOverflowRepo.findByNoteStore(initialEntity);
			for (NoteOverFlow overflowEntity : overflowEntities) {
				stringBuilder.append(overflowEntity.getOverflowNote());
			}
			return stringBuilder.toString();
		} catch (Exception e) {
			exceptionStore.storeFile(NoteStoreServiceImp.class, "fetchSequentialText", e.getMessage());
			return null;
		}

	}

	@Override
	public String deleteNote(Long id) {
		try {
			java.util.Optional<NoteStore> noteStoreOpt = noteStoreRepo.findById(id);
			if (noteStoreOpt.isEmpty()) {
				exceptionStore.storeFile(NoteStoreServiceImp.class, "deleteNote", "No Data Found");
				return "No Data Found";
			}
			NoteStore noteStore = noteStoreOpt.get();
			noteOverflowRepo.deleteAllByNoteStore(noteStore);
			noteStoreRepo.delete(noteStore);
			return "Success";
		} catch (Exception e) {
			exceptionStore.storeFile(NoteStoreServiceImp.class, "deleteNote", e.getMessage());
			return null;
		}
	}
}
