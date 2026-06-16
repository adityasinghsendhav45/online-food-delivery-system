package in.pradeep.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeDTO {
    private List<String> ingredients;
    private List<String> instructions;
    private String cookingTime;
    private String calories;
    private String dietType;
}