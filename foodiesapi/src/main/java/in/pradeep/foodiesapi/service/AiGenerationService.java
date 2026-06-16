package in.pradeep.foodiesapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.pradeep.foodiesapi.io.AiSuggestionResponse;
import in.pradeep.foodiesapi.io.RecipeDTO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AiGenerationService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public AiGenerationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AiSuggestionResponse generateSuggestions(String foodName, String category) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey;

        String prompt = "You are an expert food content writer.\n" +
                "Generate 3 short, attractive, and mouth-watering menu descriptions for a dish.\n" +
                "Make them unique, creative, and under 40 words each.\n" +
                "Dish Name: " + foodName + "\n" +
                "Category: " + category + "\n" +
                "Also, provide 5 SEO-friendly tags and 5 keywords.\n" +
                "Format the entire response as a single, valid JSON object with three keys: 'descriptions', 'tags', and 'keywords'. Each key should have an array of strings as its value.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", Collections.singletonList(textPart));
        Map<String, Object> requestBody = Map.of("contents", Collections.singletonList(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(url, entity, String.class);
            return parseGeminiResponse(response);
        } catch (Exception e) {
            // In a real application, you'd use a proper logger
            System.err.println("Error calling Gemini API: " + e.getMessage());
            // Return a default or error response
            return AiSuggestionResponse.builder()
                    .descriptions(List.of("Error: Could not generate suggestions."))
                    .tags(Collections.emptyList())
                    .keywords(Collections.emptyList())
                    .build();
        }
    }

    private AiSuggestionResponse parseGeminiResponse(String jsonResponse) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode textNode = rootNode.at("/candidates/0/content/parts/0/text");

        if (textNode.isMissingNode()) {
            throw new JsonProcessingException("Could not find text in Gemini response") {};
        }

        String rawText = textNode.asText();
        // Clean the raw text by removing markdown backticks for JSON
        String cleanJson = rawText.replace("```json", "").replace("```", "").trim();

        return objectMapper.readValue(cleanJson, AiSuggestionResponse.class);
    }


    public RecipeDTO generateRecipe(String dishName) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey;

        String prompt = "You are a helpful cooking assistant named ChefAI.\n" +
                "Provide a recipe for the dish: " + dishName + ".\n" +
                "Your response MUST be a single, valid JSON object with the following keys:\n" +
                "- 'ingredients' (an array of strings)\n" +
                "- 'instructions' (an array of strings)\n" +
                "- 'cookingTime' (a string, e.g., '30-45 minutes')\n" +
                "- 'calories' (a string, e.g., 'Approx. 550 kcal')\n" +
                "- 'dietType' (a string, e.g., 'Non-Vegetarian')\n" +
                "Do not include any text, greetings, or markdown formatting outside of the JSON object.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", Collections.singletonList(textPart));
        Map<String, Object> requestBody = Map.of("contents", Collections.singletonList(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(url, entity, String.class);
            // We'll reuse the parsing logic, but for a different DTO
            return parseGeminiResponseForRecipe(response);
        } catch (Exception e) {
            System.err.println("Error calling Gemini API for recipe: " + e.getMessage());
            return null; // Or handle the error as you see fit
        }
    }

    private RecipeDTO parseGeminiResponseForRecipe(String jsonResponse) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode textNode = rootNode.at("/candidates/0/content/parts/0/text");

        if (textNode.isMissingNode()) {
            throw new JsonProcessingException("Could not find text in Gemini response") {};
        }

        String rawText = textNode.asText();
        String cleanJson = rawText.replace("```json", "").replace("```", "").trim();

        return objectMapper.readValue(cleanJson, RecipeDTO.class);
    }





    public byte[] generateRecipePdf(String dishName, RecipeDTO recipe) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Title
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 20);
                contentStream.newLineAtOffset(150, 750);
                contentStream.showText(dishName);
                contentStream.endText();

                // Subtitle
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(240, 735);
                contentStream.showText("Generated by ChefAI");
                contentStream.endText();

                // Ingredients
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText("Ingredients");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.setLeading(14.5f); // Line spacing
                contentStream.newLineAtOffset(60, 660);
                for (String ingredient : recipe.getIngredients()) {
                    contentStream.showText("- " + ingredient);
                    contentStream.newLine();
                }
                contentStream.endText();

                // Instructions
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.newLineAtOffset(50, 500);
                contentStream.showText("Instructions");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.setLeading(14.5f);
                contentStream.newLineAtOffset(60, 480);
                int step = 1;
                for (String instruction : recipe.getInstructions()) {
                    contentStream.showText(step + ". " + instruction);
                    contentStream.newLine();
                    step++;
                }
                contentStream.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }



}