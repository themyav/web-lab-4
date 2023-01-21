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
    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("hello/user")
    public String main(Model model){
        model.addAttribute("authorized", true);
        return "index";
    }
    /*public ResponseEntity<String> helloUser() {
        final JwtAuthentication authInfo = authService.getAuthInfo();
        return ResponseEntity.ok("Hello user " + authInfo.getPrincipal() + "!");
    }*/

}