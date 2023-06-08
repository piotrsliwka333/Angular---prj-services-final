import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  addIngredientForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.pattern("^[1-9]+[0-9]*$"),
    ]),
  });

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.addIngredientForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.addIngredientForm.get("name").markAsTouched();
    this.addIngredientForm.get("amount").markAsTouched();

    if (!this.addIngredientForm.valid) return;

    const formValues = this.addIngredientForm.value;
    const newIngredient = new Ingredient(formValues.name, formValues.amount);

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;

    this.addIngredientForm.reset();
  }

  onDeleteItem() {
    this.onClearForm();
    this.slService.deleteIngredient(this.editedItemIndex);
  }

  onClearForm() {
    this.editMode = false;
    this.addIngredientForm.reset();
  }
}
