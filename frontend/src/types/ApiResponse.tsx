export interface ApiResponse<T = any> {
    success: boolean; // Indicates if the operation was successful
    data: T; // The data returned by the API (generic type)
    message: string; // A message describing the result
    statusCode: number; // The HTTP status code
}