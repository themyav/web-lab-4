package com.labs.labdemo4.repo;

import com.labs.labdemo4.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointRepo extends JpaRepository<Point, Long> {
    List<Point> findByLogin(String str);
}
