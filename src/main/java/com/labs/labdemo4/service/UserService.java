package com.labs.labdemo4.service;

import com.labs.labdemo4.model.UserR;
import com.labs.labdemo4.repo.UserRepo;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;

    }

    public Optional<UserR> getByLogin(@NonNull String login) {
        return userRepo.findById(login);
    }

}