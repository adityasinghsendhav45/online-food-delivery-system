package in.pradeep.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List; // <-- Import this

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodRequest {

    private String name;
    private String description;
    private double price;
    private String category;
    private List<String> tags;      // <-- Add this line
    private List<String> keywords;  // <-- Add this line
}