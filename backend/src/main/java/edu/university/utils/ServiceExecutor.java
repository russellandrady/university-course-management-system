package edu.university.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.function.Supplier;

public class ServiceExecutor {

    public static <T> ApiResponse<T> executeService(
            Supplier<T> operation,
            String errorMessage,
            HttpStatus successStatus
    ) {
        try {
            T result = operation.get();
            return new ApiResponse<>(
                    true,
                    "Operation completed successfully.",
                    result,
                    successStatus.value()
            );
        } catch (Exception ex) {
            // Log the error to the console
            System.err.println("Error occurred: " + ex.getMessage());

            // Return the error message in the ApiResponse
            return new ApiResponse<>(
                    false,
                    errorMessage != null ? errorMessage : ex.getMessage(),
                    null,
                    HttpStatus.INTERNAL_SERVER_ERROR.value()
            );
        }
    }

    public static <T> ApiResponse<T> executeService(Supplier<T> operation) {
        return executeService(operation, null, HttpStatus.OK);
    }
}

