package me.giangnguyen.backend.common.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import me.giangnguyen.backend.common.exception.ImageOperationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Component
public class ImageUtils {
    Dotenv dotenv = Dotenv.load();
    Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
    @Value("${app.cloudinary.folder}")
    private String folder;

    public String upload(MultipartFile file) {
        try {
            validateImage(file);

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "public_id", UUID.randomUUID().toString(), // random name to avoid collisions
                            "resource_type", "image",
                            "unique_filename", true,
                            "use_filename", false,
                            "allowed_formats", new String[]{"jpg", "jpeg", "png", "webp"},
                            "transformation", new Transformation<>()
                                    .width(1280).height(1280)
                                    .crop("limit")           // resize only if larger, never upscale
                                    .quality("auto:good")    // auto-compress while keeping visual quality
                    )
            );

            return result.get("public_id").toString();
        } catch (IOException e) {
            throw new ImageOperationException("Error occurred while uploading image" + e.getMessage());
        }
    }

    private void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ImageOperationException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ImageOperationException("File is not an image");
        }

        long maxSize = 5 * 1024 * 1024; // 5MB limit
        if (file.getSize() > maxSize) {
            throw new ImageOperationException("Image exceeds 5MB limit");
        }
    }

    // Build a delivery URL with auto format (WebP/AVIF) and auto quality
    public String getImageUrl(String publicId) {
        return cloudinary.url()
                         .transformation(new Transformation<>()
                                                 .fetchFormat("auto")   // browser gets the lightest supported format
                                                 .quality("auto:good"))
                         .secure(true)              // force https
                         .generate(publicId);
    }

    // Build a thumbnail URL for avatars
    public String getThumbnailUrl(String publicId) {
        return cloudinary.url()
                         .transformation(new Transformation<>()
                                                 .width(150).height(150)
                                                 .crop("thumb")
                                                 .gravity("face")       // keep face centered when cropping
                                                 .fetchFormat("auto")
                                                 .quality("auto:good"))
                         .secure(true)
                         .generate(publicId);
    }

    public void deleteImage(String publicId) {
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "image")
            );

            String status = result.get("result").toString();
            if (!"ok".equals(status)) {
                throw new ImageOperationException("Failed to delete image: " + status);
            }
        } catch (IOException e) {
            throw new ImageOperationException("Error occurred while deleting image: " + e.getMessage());
        }
    }
}
