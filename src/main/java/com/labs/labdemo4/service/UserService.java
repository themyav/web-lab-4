package com.labs.labdemo4.service;

import com.labs.labdemo4.model.Role;
import com.labs.labdemo4.model.UserR;
import com.labs.labdemo4.repo.UserRepo;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final List<UserR> users;
    private final UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
        this.userRepo.save(new UserR("anton", "1234", "Антон", "Иванов", Collections.singleton(Role.USER)));
        this.userRepo.save(new UserR("myav", "1234", "Myavook", "Myav", Collections.singleton(Role.USER)));

        this.users = userRepo.findAll();
    }

    public Optional<UserR> getByLogin(@NonNull String login) {
        return userRepo.findById(login);
    }

}