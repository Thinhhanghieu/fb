package com.fbclone.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Đọc header Authorization
        final String authHeader = request.getHeader("Authorization");

        // 2. Bỏ qua nếu không có token hoặc không đúng format "Bearer ..."
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Lấy token (bỏ chữ "Bearer " ở đầu)
        final String jwt = authHeader.substring(7);

        try {
            // 4. Rút email ra từ token
            final String email = jwtProvider.extractUsername(jwt);

            // 5. Chỉ xử lý nếu email hợp lệ và chưa có auth trong context
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 6. Lấy thông tin user từ DB
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // 7. Kiểm tra token có còn hợp lệ không
                if (jwtProvider.isTokenValid(jwt, userDetails)) {

                    // 8. Tạo Authentication token và đưa vào SecurityContext
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token bị giả mạo hoặc hết hạn → Spring Security tự từ chối request
            logger.warn("JWT validation failed: " + e.getMessage());
        }

        // 9. Tiếp tục chuỗi filter
        filterChain.doFilter(request, response);
    }
}
