package com.labs.labdemo4.model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.time.LocalDateTime;
import java.util.Objects;

@JsonAutoDetect
@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
//вместо аннотации Data, тк IDEA ругается
//part-4 можно убрать видимость полей, но мне не нужно
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private double x;
    private double y;

    private double r;

    private double time;

    private boolean result;

    private String login;

    @Column(updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime creationDate;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Point point = (Point) o;
        return id != null && Objects.equals(id, point.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
