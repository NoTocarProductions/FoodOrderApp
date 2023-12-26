import { useEffect, useState } from "react";
import MealItem from "./MealItem";
import useHttp from "../hooks/useHttp";
import Error from "./UI/error";

const requestConfig = {}; // we need to create this outside the function so this empty object doesn't get recreated everytime the meals commpoonent loads, it creates an infinite loop. 

export default function Meals() {
  // BEFORE CONFIGURING THE CUSTOM HOOK (useHttp.js)
  // ___________________________________________________
  // const [loadedMeals, setLoadedMeals] = useState([]);

  // useEffect(() => {
  //   async function fetchMeals() {
  //     const response = await fetch("http://localhost:3000/meals");

  //     if (!response.ok) {
  //       console.log("not okay");
  //     }

  //     const meals = await response.json();
  //     setLoadedMeals(meals);
  //   }
  //   fetchMeals();

  // }, []);
  // ___________________________________________________

  const {
    data: loadedMeals,
    isLoading,
    error
  } = useHttp("http://localhost:3000/meals", requestConfig, []); // empty object for the config parameter

  console.log('hello, I am here, read this: ' + loadedMeals);

  if (isLoading) {
    return <p className="center">Fetching meals...</p>
  }

  if (error) {
    return <Error title='Failed to fetch meals' message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
