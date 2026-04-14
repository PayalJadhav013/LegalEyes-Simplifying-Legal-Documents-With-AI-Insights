package com.legaleyes.repository;

import com.legaleyes.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Document> findByIdAndUserId(String id, String userId);
}
