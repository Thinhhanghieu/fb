package com.fbclone.features.auth;

import com.fbclone.features.user.User;

public interface AuthService {
    User register(User user);
    User authenticate(String email, String password);
}
