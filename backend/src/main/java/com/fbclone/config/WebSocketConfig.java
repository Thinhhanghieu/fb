package com.fbclone.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE + 99) // Đảm bảo chạy trước các bộ lọc bảo mật khác của Spring
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue", "/user");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Ưu tiên lấy token từ Header "Authorization"
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    String jwt = null;

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        jwt = authHeader.substring(7);
                    } else {
                        // Dự phòng: Lấy token từ Query Parameter (nếu cần thiết cho một số trình duyệt)
                        jwt = accessor.getFirstNativeHeader("token"); 
                    }
                    
                    if (jwt != null) {
                        try {
                            String userEmail = jwtProvider.extractUsername(jwt);
                            if (userEmail != null) {
                                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                                if (jwtProvider.isTokenValid(jwt, userDetails)) {
                                    UsernamePasswordAuthenticationToken auth = 
                                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                    
                                    // ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT: Gắn danh tính vào Session
                                    accessor.setUser(auth);
                                    log.info("[WebSocket] Linked Session to User: {}", userEmail);
                                }
                            }
                        } catch (Exception e) {
                            log.error("[WebSocket] Auth failed: {}", e.getMessage());
                        }
                    } else {
                        log.warn("[WebSocket] Connection attempt without token");
                    }
                }
                return message;
            }
        });
    }
}
