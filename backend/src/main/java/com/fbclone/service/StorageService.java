package com.fbclone.service;

import com.fbclone.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService {

    private final WebClient supabaseWebClient;

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    private static final String BUCKET = "images";

    /**
     * Tạo presigned URL để upload file trực tiếp lên Supabase Storage.
     * FE sẽ dùng presigned URL này để PUT file lên.
     *
     * @param fileName    tên file gốc
     * @param contentType MIME type của file
     * @return map chứa uploadUrl và publicUrl
     */
    public Map<String, String> createUploadUrl(String fileName, String contentType) {
        String uniqueName = generateFileName(fileName);

        // Gọi Supabase Storage API để tạo signed upload URL
        Map<String, Object> response = supabaseWebClient.post()
                .uri("/storage/v1/object/upload/sign/{bucket}/{path}", BUCKET, uniqueName)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("expiration", 3600)) // 1 giờ
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String token = response != null && response.containsKey("url")
                ? response.get("url").toString()
                : null;

        if (token == null) {
            throw new RuntimeException("Failed to create presigned URL");
        }

        String uploadUrl = supabaseUrl + "/storage/v1" + token;
        String publicUrl = supabaseUrl + "/storage/v1/object/public/" + BUCKET + "/" + uniqueName;

        return Map.of(
                "uploadUrl", uploadUrl,
                "publicUrl", publicUrl,
                "fileName", uniqueName
        );
    }

    /**
     * Upload file trực tiếp từ bytes lên Supabase.
     * Dùng cho avatar, cover photo (file nhỏ).
     *
     * @param fileName tên file gốc
     * @param data     nội dung file (bytes)
     * @param mimeType MIME type
     * @return UploadResponse chứa URL công khai
     */
    public UploadResponse uploadFile(String fileName, byte[] data, String mimeType) {
        String uniqueName = generateFileName(fileName);

        // Upload trực tiếp lên Supabase Storage
        supabaseWebClient.put()
                .uri("/storage/v1/object/{bucket}/{path}", BUCKET, uniqueName)
                .contentType(MediaType.parseMediaType(mimeType))
                .header("x-upsert", "true") // Ghi đè nếu đã tồn tại
                .bodyValue(data)
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        String publicUrl = supabaseUrl + "/storage/v1/object/public/" + BUCKET + "/" + uniqueName;

        return UploadResponse.builder()
                .url(publicUrl)
                .publicUrl(publicUrl)
                .bucket(BUCKET)
                .fileName(uniqueName)
                .mimeType(mimeType)
                .build();
    }

    /**
     * Xóa file khỏi Supabase Storage.
     *
     * @param fileName tên file trên storage
     */
    public void deleteFile(String fileName) {
        try {
            supabaseWebClient.delete()
                    .uri("/storage/v1/object/{bucket}/{path}", BUCKET, fileName)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception e) {
            log.warn("Failed to delete file {}: {}", fileName, e.getMessage());
        }
    }

    private String generateFileName(String originalName) {
        String ext = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex > 0) {
            ext = originalName.substring(dotIndex);
        }
        return Instant.now().getEpochSecond() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
    }
}
