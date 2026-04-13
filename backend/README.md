# FB-Clone Backend Documentation

## 🛠 Centralized Error Handling

The project implements a centralized error handling mechanism to ensure consistent API responses.

### 📁 Package Structure
`com.fbclone.exception`
- `GlobalExceptionHandler`: The central hub for catching exceptions.
- `NotFoundException`: For 404 errors.
- `BadRequestException`: For 400 errors (validation, logic errors).
- `UnauthorizedException`: For 401 errors (auth failures).

### 📝 Response Format
All errors follow the `ErrorResponse` DTO structure:
```json
{
  "message": "Detailed error message",
  "status": 404,
  "timestamp": "2026-04-13T14:30:00",
  "path": "/api/v1/resource"
}
```

### 🚀 Usage Guide
In the **Service layer**, throw the appropriate exception:
```java
public User getUser(UUID id) {
    return userRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("User not found with ID: " + id));
}
```

In the **Controller layer**, keep it clean:
```java
@GetMapping("/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
    User user = userService.getUser(id);
    return ResponseEntity.ok(UserResponse.fromEntity(user));
}
```
The `GlobalExceptionHandler` will automatically intercept the exception and return the correct HTTP status and JSON body.
