package edu.university.utils;

        import org.springframework.http.HttpStatus;
        import org.springframework.http.ResponseEntity;
        import java.util.function.Supplier;

        public class ServiceExecutor {

            public static <T> ResponseEntity<ApiResponse<T>> executeService(
                    Supplier<T> operation,
                    String errorMessage,
                    HttpStatus successStatus
            ) {
                try {
                    T result = operation.get();
                    return ResponseEntity.ok(new ApiResponse<>(
                            true,
                            "Operation completed successfully.",
                            result,
                            successStatus.value()
                    ));
                } catch (Exception ex) {
                    System.err.println("Error occurred: " + ex.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new ApiResponse<>(
                                    false,
                                    errorMessage != null ? errorMessage : ex.getMessage(),
                                    null,
                                    HttpStatus.INTERNAL_SERVER_ERROR.value()
                            ));
                }
            }

            public static <T> ResponseEntity<ApiResponse<T>> executeService(Supplier<T> operation) {
                return executeService(operation, null, HttpStatus.OK);
            }
        }