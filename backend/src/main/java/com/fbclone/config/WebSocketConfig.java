package com.fbclone.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Kích hoạt broker cho các tin nhắn từ Server xuống Client
        config.enableSimpleBroker("/topic", "/queue", "/user");
        // Prefix cho các tin nhắn từ Client gửi lên Server
        config.setApplicationDestinationPrefixes("/app");
        // Prefix cho các tin nhắn gửi riêng cho 1 user
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint kết nối WebSocket từ Frontend
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Có thể giới hạn domain nếu cần bảo mật
                .withSockJS();
    }
}
