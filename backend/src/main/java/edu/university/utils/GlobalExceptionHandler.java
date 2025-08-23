package edu.university.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllExceptions(Exception ex) {
        ex.printStackTrace(); // log for debugging

        int status = HttpStatus.INTERNAL_SERVER_ERROR.value();
        String message = ex.getMessage() != null ? ex.getMessage() : "Something went wrong.";

        // Handle specific Spring exceptions if needed
        if (ex instanceof ResponseStatusException rse) {
            status = rse.getStatusCode().value();
            message = rse.getReason();
        } else if (ex instanceof AccessDeniedException) {
            status = HttpStatus.FORBIDDEN.value();
            message = "Access denied.";
        } else if (ex instanceof MethodArgumentNotValidException manve) {
            status = HttpStatus.BAD_REQUEST.value();
            message = "Validation failed: " + manve.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        }

        return ResponseEntity.status(status)
                .body(new ApiResponse<>(false, message, null, status));
    }

}
