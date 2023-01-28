import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DataStorageService } from '../shared/data-storage.service';
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
  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
    this.recipeService.recipeSelected.subscribe(
      (recipe: Recipe) => {
        this.selectedRecipe = recipe
      }
    )

    this.dataStorageService.fetchRecipes().subscribe();
  }

  handleClick() {
    this.clicked = !this.clicked
  }

  onSelectRecipe(eventData) {
    this.selectedRecipe = eventData.recipe;

  }

}
