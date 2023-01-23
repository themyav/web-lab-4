package com.labs.labdemo4.controllers;

import com.labs.labdemo4.service.AuthService;
import lombok.RequiredArgsConstructor;
import com.labs.labdemo4.model.JwtAuthentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("api")
@RequiredArgsConstructor
public class HelloController {

    private final AuthService authService;

    //@PreAuthorize("hasAuthority('USER')")
    @CrossOrigin
    @GetMapping("hello/user")
    public ResponseEntity<String> helloUser() {
        final JwtAuthentication authInfo = authService.getAuthInfo();
        //System.out.println(authInfo);
        return ResponseEntity.ok("Hello user " + authInfo.getPrincipal() + "!");
    }

}