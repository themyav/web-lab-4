package com.labs.labdemo4.controllers;

import com.labs.labdemo4.service.AuthService;
import lombok.RequiredArgsConstructor;
import com.labs.labdemo4.model.JwtAuthentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("api")
@RequiredArgsConstructor
public class HelloController {

    private final AuthService authService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("hello/user")
    public String helloUser(){
        return "main";
    }
    /*public ResponseEntity<String> helloUser() {
        final JwtAuthentication authInfo = authService.getAuthInfo();
        return ResponseEntity.ok("Hello user " + authInfo.getPrincipal() + "!");
    }*/

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("hello/admin")
    public ResponseEntity<String> helloAdmin() {
        final JwtAuthentication authInfo = authService.getAuthInfo();
        return ResponseEntity.ok("Hello admin " + authInfo.getPrincipal() + "!");
    }

}