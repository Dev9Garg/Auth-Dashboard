import * as z from "zod"

export const emailOrUsername = z.union([z.email(), z.string()])