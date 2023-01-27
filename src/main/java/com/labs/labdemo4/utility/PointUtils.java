package com.labs.labdemo4.utility;

import com.labs.labdemo4.model.Point;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PointUtils {

    private static final double MAX = 5;
    private static final double MIN = -3;

    public static boolean isValid(Point point){
        return (point.getX() >= MIN && point.getX() <= MAX && point.getY() >= MIN && point.getY() <= MAX && point.getR() > 0 && point.getR() <= MAX);
    }
    public static boolean isInArea(double x, double y, double r){
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
