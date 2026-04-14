package com.legaleyes.exception;
public class AiServiceException extends RuntimeException {
    public AiServiceException(String msg) { super(msg); }
    public AiServiceException(String msg, Throwable cause) { super(msg, cause); }
}
