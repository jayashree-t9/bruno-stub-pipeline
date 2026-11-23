@mock
Feature: E-commerce Flow - Product to Cart

  Scenario: View product and add to cart
    Given I navigate to the homepage
    When I click on "Combination Pliers" product
    Then I should see the product name "Combination Pliers"
    And I should see the product price "14.15"
    And I should see the product description
    And I should see the brand name "ForgeFlex Tools"
    And I should see the category "Pliers"
    When I add the product to cart
    When I navigate to the cart page
    Then I should see "Combination Pliers" in the cart
    And I should see cart total
    When I update the quantity to "2"
    Then I should see updated cart total
    When I update the quantity to "1"
    Then I should see updated cart total
    When I remove "Combination Pliers" from cart
