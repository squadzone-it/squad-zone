import React from "react";
import { Text, View } from "react-native";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/core/theme";
import { useFonts } from "expo-font";
import {
	StartScreen,
	LoginScreen,
	RegisterScreen,
	ResetPasswordScreen,
	Dashboard,
} from "./src/screens";

const App = () => {
	const [fontsLoaded] = useFonts({
		"CODE-Bold": require("./src/assets/fonts/CODE-Bold.otf"),
		"CODE-Light": require("./src/assets/fonts/CODE-Light.otf"),
		"SF-Pro": require("./src/assets/fonts/SF-Pro.ttf"),
		"SF-Pro-Italic": require("./src/assets/fonts/SF-Pro-Italic.ttf"),
	});

	const Stack = createStackNavigator();

	if (!fontsLoaded) {
		return (
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Text>Loading fonts...</Text>
			</View>
		);
	}

	return (
		<Provider theme={theme}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="StartScreen"
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="StartScreen" component={StartScreen} />
					<Stack.Screen name="LoginScreen" component={LoginScreen} />
					<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
					<Stack.Screen name="Dashboard" component={Dashboard} />
					<Stack.Screen
						name="ResetPasswordScreen"
						component={ResetPasswordScreen}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default App;
