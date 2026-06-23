package in.pradeep.foodiesapi.service;
import in.pradeep.foodiesapi.io.FoodRecommendationResponse;
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
import in.pradeep.foodiesapi.entity.FoodEntity;
import in.pradeep.foodiesapi.entity.OrderEntity;
import in.pradeep.foodiesapi.repository.FoodRepository;
import in.pradeep.foodiesapi.repository.OrderRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AiGenerationService {

    private final RestTemplate restTemplate;
    private final FoodRepository foodRepository;
private final OrderRepository orderRepository;
private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

   public AiGenerationService(
        RestTemplate restTemplate,
        FoodRepository foodRepository,
        OrderRepository orderRepository,
        UserService userService
) {
    this.restTemplate = restTemplate;
    this.foodRepository = foodRepository;
    this.orderRepository = orderRepository;
    this.userService = userService;
}

    public AiSuggestionResponse generateSuggestions(String foodName, String category) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

       String prompt =
        "You are a professional restaurant menu copywriter and food marketing expert.\n" +
        "Dish Name: " + foodName + "\n" +
        "Category: " + category + "\n\n" +

        "Generate exactly 3 unique menu descriptions.\n" +
        "Descriptions must be specific to the given dish name and category.\n" +
        "Do not invent other dishes.\n" +
        "Do not mix cuisines.\n" +
        "Make descriptions realistic, appetizing and restaurant-quality.\n" +
        "Each description should be 20-35 words.\n" +
        "Highlight taste, texture, ingredients and serving experience.\n" +
        "Avoid repetition between descriptions.\n\n" +

        "Also generate:\n" +
        "- 5 SEO tags\n" +
        "- 5 SEO keywords\n\n" +

        "Return ONLY valid JSON in this format:\n" +
        "{\n" +
        "  \"descriptions\": [\"desc1\", \"desc2\", \"desc3\"],\n" +
        "  \"tags\": [\"tag1\", \"tag2\", \"tag3\", \"tag4\", \"tag5\"],\n" +
        "  \"keywords\": [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\", \"keyword5\"]\n" +
        "}\n" +
        "Do not return markdown, explanations or extra text.";
        
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
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

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
public FoodRecommendationResponse getFoodRecommendations() {

    String userId = userService.findByUserId();

    List<OrderEntity> orders = orderRepository.findByUserId(userId);

    if (orders.isEmpty()) {
        return FoodRecommendationResponse.builder()
                .recommendations(List.of())
                .build();
    }

    StringBuilder orderedFoods = new StringBuilder();

    for (OrderEntity order : orders) {
        order.getOrderedItems().forEach(item ->
                orderedFoods.append(item.getName()).append("\n"));
    }

    List<FoodEntity> allFoods = foodRepository.findAll();

    StringBuilder availableFoods = new StringBuilder();

    allFoods.forEach(food ->
            availableFoods.append(food.getName()).append("\n"));

    String prompt =
            "User previously ordered:\n" +
            orderedFoods +
            "\n\nAvailable menu items:\n" +
            availableFoods +
            "\n\n" +
            "Recommend 6 foods.\n" +
            "Rules:\n" +
            "1. Recommend similar variants.\n" +
            "2. Recommend complementary foods.\n" +
            "3. Do not recommend exact same foods.\n" +
            "4. Recommend only from available menu.\n" +
            "5. Return JSON only.\n\n" +
            "Format:\n" +
            "{ \"recommendations\": [\"food1\",\"food2\"] }";

    try {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key="
                        + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts",
                Collections.singletonList(textPart));
        Map<String, Object> requestBody = Map.of("contents",
                Collections.singletonList(content));

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        String response =
                restTemplate.postForObject(url, entity, String.class);

        JsonNode rootNode = objectMapper.readTree(response);

        JsonNode textNode =
                rootNode.at("/candidates/0/content/parts/0/text");

        String rawText = textNode.asText();

        String cleanJson =
                rawText.replace("```json", "")
                        .replace("```", "")
                        .trim();

        return objectMapper.readValue(
                cleanJson,
                FoodRecommendationResponse.class
        );

    } catch (Exception e) {

        return FoodRecommendationResponse.builder()
                .recommendations(List.of())
                .build();
    }
}


}