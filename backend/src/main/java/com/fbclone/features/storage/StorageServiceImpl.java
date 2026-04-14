package com.fbclone.features.storage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    private final WebClient supabaseWebClient;

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    private static final String BUCKET = "images";

    @Override
    public Map<String, String> createUploadUrl(String fileName, String contentType) {
        String uniqueName = generateFileName(fileName);

        Map<String, Object> response = supabaseWebClient.post()
                .uri("/storage/v1/object/upload/sign/{bucket}/{path}", BUCKET, uniqueName)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("expiration", 3600))
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

    @Override
    public UploadResponse uploadFile(String fileName, byte[] data, String mimeType) {
        String uniqueName = generateFileName(fileName);

        supabaseWebClient.put()
                .uri("/storage/v1/object/{bucket}/{path}", BUCKET, uniqueName)
                .contentType(MediaType.parseMediaType(mimeType))
                .header("x-upsert", "true")
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

    @Override
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
