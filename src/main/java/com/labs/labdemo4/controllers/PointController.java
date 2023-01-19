package com.labs.labdemo4.controllers;

import com.labs.labdemo4.model.Point;
import com.labs.labdemo4.repo.PointRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("point")
public class PointController {
    private final PointRepo pointRepo;

    @Autowired
    public PointController(PointRepo pointRepo) {
        this.pointRepo = pointRepo;
    }

    @GetMapping
    public List<Point> list(){
        return pointRepo.findAll();
    }
    @GetMapping("{id}")
    public Point getOne(@PathVariable("id") Point point){
        return point;
    }

    @GetMapping("{user}/points")
    public List<Point> findByLogin(@PathVariable("user") String login) {
        return pointRepo.findByLogin(login);
    }
    @PostMapping
    public Point create(@RequestBody Point point){
        point.setCreationDate(LocalDateTime.now());
        point.setResult(isInArea(point.getX(), point.getY(), point.getR()));
        return pointRepo.save(point);
    }

    @PutMapping("{id}")
    public Point update(@PathVariable("id") Point pointFromDB, @RequestBody Point point){
        BeanUtils.copyProperties(point, pointFromDB, "id");
        return pointRepo.save(pointFromDB);
    }

    @DeleteMapping
    public void delete(){
        pointRepo.deleteAll();
    }

    public boolean isInArea(double x, double y, double r){
        if(x >= 0 && y >= 0){
            return x <= r && y <= r;
        }
        else if(x <= 0 && y >= 0){
            return x*x + y*y <= r*r/4;
        }
        else if(x <= 0 && y <= 0){
            return y >= -2*x - r;
        }
        else return false;
    }
}
