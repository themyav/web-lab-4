package com.labs.labdemo4.controllers;

import com.labs.labdemo4.model.Point;
import com.labs.labdemo4.repo.PointRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import static com.labs.labdemo4.utility.PointUtils.isInArea;
import static com.labs.labdemo4.utility.PointUtils.isValid;

@RestController
@RequestMapping("api/point")
@CrossOrigin
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

    @GetMapping("{user}")
    public List<Point> findByLogin(@PathVariable("user") String login) {
        return pointRepo.findByLogin(login);
    }
    @PostMapping
    public Point create(@RequestBody Point point){
        if(!isValid(point)) return null; //is okay?
        double currentTime = System.nanoTime();
        point.setCreationDate(LocalDateTime.now());
        point.setResult(isInArea(point.getX(), point.getY(), point.getR()));
        point.setTime((System.nanoTime() - currentTime) / 1e6);
        return pointRepo.save(point);
    }

    /*@PutMapping("{id}")
    public Point update(@PathVariable("id") Point pointFromDB, @RequestBody Point point){
        BeanUtils.copyProperties(point, pointFromDB, "id");
        return pointRepo.save(pointFromDB);
    }*/

    @DeleteMapping
    public void delete(){
        pointRepo.deleteAll();
    }


}
