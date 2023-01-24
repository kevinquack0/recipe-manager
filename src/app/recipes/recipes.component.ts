import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  selectedRecipe: Recipe;
  clicked = false;
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.recipeSelected.subscribe(
      (recipe: Recipe) => {
        this.selectedRecipe = recipe
      }
    )
  }

  handleClick() {
    this.clicked = !this.clicked
  }

  onSelectRecipe(eventData) {
    this.selectedRecipe = eventData.recipe;

  }

}
