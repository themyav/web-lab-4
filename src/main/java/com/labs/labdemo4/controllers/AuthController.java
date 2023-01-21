package com.labs.labdemo4.controllers;

import com.labs.labdemo4.exception.UserNotFoundException;
import com.labs.labdemo4.exception.WrongPasswordException;
import com.labs.labdemo4.model.JwtResponse;
import com.labs.labdemo4.model.RefreshJwtRequest;
import com.labs.labdemo4.service.AuthService;
import lombok.RequiredArgsConstructor;
import com.labs.labdemo4.model.JwtRequest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest authRequest) {
        try{
            final JwtResponse token = authService.login(authRequest);
            return ResponseEntity.ok(token);
        }catch(WrongPasswordException e){
            return new ResponseEntity<>(HttpStatusCode.valueOf(403));
        }catch (UserNotFoundException e){
            return new ResponseEntity<>(HttpStatusCode.valueOf(404));
        }
    }
    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("token")
    public ResponseEntity<JwtResponse> getNewAccessToken(@RequestBody RefreshJwtRequest request) {
        final JwtResponse token = authService.getAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(token);
    }
    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("refresh")
    public ResponseEntity<JwtResponse> getNewRefreshToken(@RequestBody RefreshJwtRequest request) {
        final JwtResponse token = authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(token);
    }

}
