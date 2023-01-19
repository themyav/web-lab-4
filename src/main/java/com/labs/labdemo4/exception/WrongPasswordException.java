package com.labs.labdemo4.exception;

/**
 * Исключение используется для ошибок аутентификации и авторизациит.
 *
 * @author upagge 21.06.2022
 */
public class WrongPasswordException extends RuntimeException {

    public WrongPasswordException(String message) {
        super(message);
    }

}
