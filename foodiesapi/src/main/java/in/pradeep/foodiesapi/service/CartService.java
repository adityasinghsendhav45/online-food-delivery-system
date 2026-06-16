package in.pradeep.foodiesapi.service;

import in.pradeep.foodiesapi.io.CartRequest;
import in.pradeep.foodiesapi.io.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
