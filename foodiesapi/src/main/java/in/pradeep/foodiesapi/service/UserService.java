package in.pradeep.foodiesapi.service;

import in.pradeep.foodiesapi.io.UserRequest;
import in.pradeep.foodiesapi.io.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
