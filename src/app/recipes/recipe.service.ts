import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { v4 as uuidv4 } from "uuid";
import { Subject } from "rxjs/Subject";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      "6eda8fb8-d01a-48c2-ab70-69ae4e2e8622",
      "Tasty Schnitzel",
      "A super-tasty Schnitzel - just awesome!",
      "https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG",
      [new Ingredient("Meat", 1), new Ingredient("French Fries", 20)]
    ),
    new Recipe(
      "9f54b054-d500-47dc-925c-467b7ba2f5b7",
      "Big Fat Burger",
      "What else you need to say?",
      "https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg",
      [new Ingredient("Buns", 2), new Ingredient("Meat", 1)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: string): Recipe {
    return this.recipes.find((recipe: Recipe) => recipe.id === id);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: string, newRecipe: Recipe) {
    const foundIndex: number = this.recipes.findIndex(
      (recipe: Recipe) => recipe.id === id
    );

    if (foundIndex !== -1) {
      this.recipes[foundIndex] = newRecipe;
      this.recipesChanged.next(this.recipes.slice());
    }
  }

  deleteRecipe(id: string) {
    const foundIndex: number = this.recipes.findIndex(
      (recipe: Recipe) => recipe.id === id
    );

    if (foundIndex !== -1) {
      const newArray = this.recipes.slice();
      newArray.splice(foundIndex, 1);
      this.recipes = newArray;
      this.recipesChanged.next(newArray);
    }
  }
}
