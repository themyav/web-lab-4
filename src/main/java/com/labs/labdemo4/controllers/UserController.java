package com.labs.labdemo4.controllers;

import com.labs.labdemo4.model.UserR;
import com.labs.labdemo4.repo.UserRepo;
import com.labs.labdemo4.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:8080")
public class UserController {
    private final UserRepo userRepo;

    @Autowired
    public UserController(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<UserR> list(){
        return userRepo.findAll();
    }
    @GetMapping("{id}")
    public UserR getOne(@PathVariable("id") UserR user){
        return user;
    }

    @PostMapping
    public UserR create(@RequestBody UserR user){
        user.setPassword(AuthService.codePassword(user.getPassword()));
        return userRepo.save(user);
    }
}
