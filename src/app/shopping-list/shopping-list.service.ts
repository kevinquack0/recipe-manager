import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";


export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    ingredients: Ingredient[] = [];

    updateIngredient(index: number, newIngridient: Ingredient) {
        this.ingredients[index] = newIngridient
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    addIngredient(newIngridient) {
        this.ingredients.push(newIngridient)
        this.ingredientsChanged.next(this.ingredients.slice())
    }
    getIngredients() {
        return this.ingredients.slice()
    }
    getIngredient(index: number) {
        return this.ingredients[index]
    }
    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1)
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients)
        this.ingredientsChanged.next(this.ingredients.slice())
    }
}