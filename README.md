# SUNRISE ORDERS CONTROL
-	Frontend developed using React functional components with Typescript
-	Backend developed using NodeJS with Typescript
-	MongoDB was used as Data Base 
-	The project is meant to make easy to the Chef guarantee that the products ordered were delivered by the Suppliers. The Chef has a admin login (using JWT) and has specific pages to insert new products, suppliers and categories. Once the Chef insert a new Order, it will be visible when the hosts users access the initial page, but the list has no quantities. When the supplier deliver the order, the employee who receive the order have to insert the quantities received. If the quantities doesn’t match with the Original Order list it shows a warning. The checker may check the products again or do a note and confirm it has received with missing items. If the order is correct the Order is closed, in other hand if the order has inconsistences it will be showed to the chef at front page to confer and be aware of the missing Items. 
-	It uses CSS Modules and SASS.
-	The library Js-Cookie was used to manage Tokens and user Id. 
-	The React Router Dom v6 is used to manage routes and private routes.
-	Unit Tests using Jest

