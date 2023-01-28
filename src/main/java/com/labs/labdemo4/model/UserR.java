package com.labs.labdemo4.model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@JsonAutoDetect
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserR {

    @Id
    private String login;
    private String password;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UserR userR = (UserR) o;
        return login != null && Objects.equals(login, userR.login);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
