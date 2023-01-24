import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent {
  selectedRecipe: Recipe
  id: number;
  constructor(private recipeServices: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.selectedRecipe = this.recipeServices.getRecipeByID(params.id)
      }
    )

  }
  onAddToShoppingList() {
    this.recipeServices.addIngredientToShoppingList(this.selectedRecipe.ingredients)
  }
  onEditRecipe() {
    this.router.navigate(["edit"], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.recipeServices.deleteRecipe(this.id);
    this.router.navigate(['/recipes'])
  }
}
