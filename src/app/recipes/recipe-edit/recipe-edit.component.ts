import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormArray, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit {
  id: string;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  private initForm() {
    let recipeName: string = "";
    let recipeImagePath: string = "";

    let recipeDescription: string = "";
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe: Recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe.ingredients.length > 0) {
        for (let i = 0; i < recipe.ingredients.length; i++) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(
                recipe.ingredients[i].name,
                Validators.required
              ),
              amount: new FormControl(recipe.ingredients[i].amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  get controls() {
    return (<FormArray>this.recipeForm.get("ingredients")).controls;
  }

  onSubmit() {
    const newId = uuidv4();
    const newRecipe = new Recipe(
      this.editMode ? this.id : newId,
      this.recipeForm.value["name"],
      this.recipeForm.value["description"],
      this.recipeForm.value["imagePath"],
      this.recipeForm.value["ingredients"]
    );
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
      this.router.navigate([`recipes/${this.id}`]);
    } else {
      this.recipeService.addRecipe(newRecipe);
      this.router.navigate([`recipes/${newId}`]);
    }
    console.log(this.recipeForm);
  }

  onCancel() {
    this.router.navigate([`../`], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }

  onDeleteAllIngredients() {
    (<FormArray>this.recipeForm.get("ingredients")).clear();
  }
}
