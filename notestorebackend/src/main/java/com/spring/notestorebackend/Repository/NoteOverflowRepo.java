package com.spring.notestorebackend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring.notestorebackend.Entity.NoteOverFlow;
import com.spring.notestorebackend.Entity.NoteStore;

@Repository
public interface NoteOverflowRepo extends JpaRepository<NoteOverFlow, Long> {
	List<NoteOverFlow> findByNoteStore(NoteStore noteStore);
	Boolean existsByNoteStore(NoteStore noteStore);
	void deleteAllByNoteStore(NoteStore noteStore);
}
