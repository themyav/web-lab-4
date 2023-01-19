package com.labs.labdemo4.repo;

import com.labs.labdemo4.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<UserR, String> {
}
