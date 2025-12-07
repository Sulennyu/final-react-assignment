Set Up Instructions: 

Start by creating a new Expo project with a blank template.
- npx create-expo-app final-react-assignment --template
- select blank 

Run the starter app with Expo Go
- In the terminal: cd final-react-assignment 
- Then: npx expo start 

Install expo-sqlite
- npx expo install expo-sqlite

Copilot Reflection:

I used copilot to help me create a chart that would display data that was already inside of my expo app. Therefore, it shows a chart that updates with every new expense added and deleted. I decided to create a new file for the category chart that would be imported through the ExpenseScreen.js to make things organized and easier to fix. 

I prompted the Github Copilot to create a horizontal bar chart that shows expenses based on category data that is already present in the app state. I would also have to prompt it for adjustments if there were errors in the app or ask it to explain if something didn't make sense.

One suggestion that I rejected was rendering "Highest" in the labeling rather than the actual highest amount, as it didn't make sense in the display. 

Copilot helped me save time by helping create a general structure that I could then edit based on my preferences. 