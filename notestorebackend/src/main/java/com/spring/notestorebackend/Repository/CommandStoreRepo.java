package com.spring.notestorebackend.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring.notestorebackend.Entity.CommandStrore;

@Repository
public interface CommandStoreRepo extends JpaRepository<CommandStrore, Long> {
	List<CommandStrore> findAllByLanguageOrderByInsertDateDesc(String language);
	Page<CommandStrore> findAllByLanguageOrderByInsertDateDesc(Pageable page, String language);
	List<CommandStrore> findAllByOrderByInsertDateDesc();
	Page<CommandStrore> findAllByOrderByInsertDateDesc(Pageable page);
}
