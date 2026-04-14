package com.fbclone.features.storage;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UploadResponse {
    private String url;
    private String publicUrl;
    private String bucket;
    private String fileName;
    private String mimeType;
}
