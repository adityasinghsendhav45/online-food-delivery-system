package in.pradeep.foodiesapi.controller;

import in.pradeep.foodiesapi.io.AiSuggestionResponse;
import in.pradeep.foodiesapi.io.RecipeDTO;
import in.pradeep.foodiesapi.service.AiGenerationService;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai")
@AllArgsConstructor
public class AiController {

    private final AiGenerationService aiGenerationService;

    // This is a simple Data Transfer Object (DTO) for the request body
    @Data
    static class GenerateRequest {
        private String foodName;
        private String category;
    }

    @PostMapping("/generate-suggestions")
    public ResponseEntity<AiSuggestionResponse> generateSuggestions(@RequestBody GenerateRequest request) {
        AiSuggestionResponse response = aiGenerationService.generateSuggestions(request.getFoodName(), request.getCategory());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recipe")
    public ResponseEntity<RecipeDTO> generateRecipe(@RequestParam String dishName) {
        if (dishName == null || dishName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        RecipeDTO recipe = aiGenerationService.generateRecipe(dishName);
        if (recipe != null) {
            return ResponseEntity.ok(recipe);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/recipe/pdf") // Changed from GetMapping to PostMapping
    public ResponseEntity<byte[]> downloadRecipePdf(@RequestParam String dishName, @RequestBody RecipeDTO recipe) throws IOException {
        if (dishName == null || dishName.trim().isEmpty() || recipe == null) {
            return ResponseEntity.badRequest().build();
        }

        // The recipe is now passed directly, so we don't need to generate it again.
        byte[] pdfBytes = aiGenerationService.generateRecipePdf(dishName, recipe);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String filename = dishName.replaceAll("\\s+", "_") + "_recipe.pdf";
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}