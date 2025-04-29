package com.jwt.implementation.config;

import com.jwt.implementation.model.User;
import com.jwt.implementation.repository.UserRepository;
import com.jwt.implementation.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String username = email.split("@")[0];

        // Find or create the user in the database
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(username);
            user.setName(name); // If User has a name field
            user.setRole("USER");  // Set default role
            userRepository.save(user);
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getEmail(), user.getRole());

        // Redirect the user to the frontend (Angular) with the token
        String redirectUrl = "http://localhost:4200?token=" + URLEncoder.encode(token, String.valueOf(StandardCharsets.UTF_8));
        response.sendRedirect(redirectUrl);  // This redirects to the Angular app
    }
}
