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
