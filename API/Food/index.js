import express from "express";
import passport from "passport";

//database
import {FoodModel} from "../../database/allModels";

//validation
import {ValidateRestaurantId, ValidateCategory} from "../../validation/food";

const Router = express.Router();

/*
Router     /signup
descrip     get all the food base on restaurant
params      _id
access      public
method      get
*/

Router.get("/:_id", async(req,res) => {
  try {

    await ValidateRestaurantId(req.params);

    const {_id} = req.params;
    const foods = await FoodModel.find({ restaurant: _id });

    return res.json({ foods });
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
});

/*
Router     /r
descrip     get all the foods based on category
params      _id
access      public
method      get
*/

Router.get("/r/:category", async(req,res) => {
  try {

    await ValidateCategory(req.params);

    const {category} = req.params;
    const foods = await FoodModel.find({
      category: { $regex: category, $options: "i"}
    });

    return res.json({foods});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
});

export default Router;
