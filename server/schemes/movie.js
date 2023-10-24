import z from 'zod'

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    year: z.number().int().min(1900),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).optional(),
    poster: z.string().url(),
    genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Crime']),
    {
        required_error: 'Movie genre is required',
        invalid_type_error: 'Movie genre must be an array of enum genre'
    })
})

export function validateMovie(object) {
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}
