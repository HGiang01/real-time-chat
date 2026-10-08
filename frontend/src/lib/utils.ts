import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Cloudinary } from "@cloudinary/url-gen"

const cloudinary = new Cloudinary({
  cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCloudinaryImageUrl(publicId: string): string {
  return cloudinary.image(publicId).toURL()
}

export function extractAvatarFallback(username: string | undefined): string {
  if (!username) return "null"

  username = username.trim()
  let result: string = ""

  for (let i = 0; i < username.length; i++) {
    if (i == 0 || username.charAt(i - 1) == " ") {
      result = result + username[i]
    }
  }

  return result.toUpperCase()
}