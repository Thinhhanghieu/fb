package com.fbclone.controller;

import com.fbclone.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    /**
     * Tạo presigned URL để FE upload trực tiếp.
     */
    @GetMapping("/presign")
    public ResponseEntity<Map<String, String>> getPresignedUrl(
            @RequestParam String fileName,
            @RequestParam String contentType,
            Authentication authentication) {

        Map<String, String> result = storageService.createUploadUrl(fileName, contentType);

        return ResponseEntity.ok(result);
    }

    /**
     * Upload file trực tiếp qua backend.
     * Dùng cho avatar, cover photo nhỏ.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is required"));
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
        }

        try {
            var response = storageService.uploadFile(
                    file.getOriginalFilename(),
                    file.getBytes(),
                    contentType
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Xóa file.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteFile(
            @RequestParam String fileName,
            Authentication authentication) {

        storageService.deleteFile(fileName);
        return ResponseEntity.ok().build();
    }


}
