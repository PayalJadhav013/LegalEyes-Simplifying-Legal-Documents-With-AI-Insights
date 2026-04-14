package com.legaleyes.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Email
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    // ✅ Username
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    // ✅ Password (hashed)
    @Column(nullable = false)
    private String passwordHash;

    // ✅ Full Name
    @Column(nullable = false, length = 100)
    private String fullName;

    // ✅ Profession (dropdown values)
    @Column(nullable = false, length = 100)
    private String profession;

    // ❌ REMOVED purpose

    // ✅ Active status
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    // ✅ Created timestamp
    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}