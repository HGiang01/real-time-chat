import { z } from "zod"

const updateProfileSchema = z.object({
  username: z.string().optional(),
  bio: z.string().optional(),
  avatar: z
    .file()
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image must smaller than 5MB"
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be image"
    ),
})

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

export { updateProfileSchema, type UpdateProfileFormValues }
