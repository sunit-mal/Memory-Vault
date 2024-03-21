package com.spring.notestorebackend.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring.notestorebackend.Entity.NoteStore;

@Repository
public interface NoteStoreRepo extends JpaRepository<NoteStore, Long> {
	List<NoteStore> findAllByOrderByInsertDateDesc();
	Page<NoteStore> findAllByOrderByInsertDateDesc(Pageable page);
	NoteStore findByTitle(String title);
}
