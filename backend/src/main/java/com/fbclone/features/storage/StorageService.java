package com.fbclone.features.storage;

import java.util.Map;

public interface StorageService {
    Map<String, String> createUploadUrl(String fileName, String contentType);
    UploadResponse uploadFile(String fileName, byte[] data, String mimeType);
    void deleteFile(String fileName);
}
