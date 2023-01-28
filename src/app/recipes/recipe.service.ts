import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  recipeSelected = new Subject<Recipe>()
  selectedID: number;

  private recipes: Recipe[] = [];

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes
    this.recipesChanged.next(this.recipes.slice())
  }

  constructor(private slService: ShoppingListService) { }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients)
  }
  getRecipeByID(id: string) {
    return (this.recipes[parseInt(id)])
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.recipes.slice())
  }
}