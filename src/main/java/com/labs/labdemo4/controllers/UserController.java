package com.labs.labdemo4.controllers;

import com.labs.labdemo4.model.UserR;
import com.labs.labdemo4.repo.UserRepo;
import com.labs.labdemo4.service.AuthService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
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

    @PostMapping("register")
    public UserR create(@RequestBody UserR user){
        user.setPassword(AuthService.codePassword(user.getPassword()));
        return userRepo.save(user);
    }

    @PutMapping("{id}")
    public UserR update(@PathVariable("id") UserR userFromDB, @RequestBody UserR user){
        BeanUtils.copyProperties(user, userFromDB, "id");
        return userRepo.save(userFromDB);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") UserR user){
        userRepo.delete(user);
    }
}
