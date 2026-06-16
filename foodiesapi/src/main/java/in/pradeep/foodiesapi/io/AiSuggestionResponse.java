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
public class AiSuggestionResponse {
    private List<String> descriptions;
    private List<String> tags;
    private List<String> keywords;
}