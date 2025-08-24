export interface TranslationResponse {
    0: "SUCCESS" | "ERROR";
    1: Array<[
        string,              // Input text
        string[],           // Suggestions array
        any[],             // Empty array
        {
            candidate_type: number[] // Array of candidate types
        }
    ]>;
}
