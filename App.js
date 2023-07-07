import React from "react";
import { Provider } from "react-native-paper";
import {
	NavigationContainer,
	DarkTheme,
	LightTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "./src/core/theme";
import { useFonts } from "expo-font";
import Ionic from "react-native-vector-icons/Ionicons";
import * as NavigationBar from "expo-navigation-bar";
import {
	StartScreen,
	LoginScreen,
	RegisterScreen,
	ResetPasswordScreen,
	HomeScreen,
	SearchScreen,
	NewsScreen,
	ProfileScreen,
	EditProfile,
	OtherUserProfileScreen,
	CreateSquadScreen,
	SquadProfileScreen,
	CreateSquadBadge,
	CreatePickupMatchScreen,
	CreateTeamsMatchScreen,
	MatchDetailsScreen,
} from "./src/screens";
import Background from "./src/components/Background";
import Logo from "./src/components/Logo";
import { UserProvider } from "./src/contexts/UserContext";

const App = () => {
	const [fontsLoaded] = useFonts({
		"CODE-Bold": require("./src/assets/fonts/CODE-Bold.otf"),
		"CODE-Light": require("./src/assets/fonts/CODE-Light.otf"),
		"SF-Pro": require("./src/assets/fonts/SF-Pro.ttf"),
		"SF-Pro-Italic": require("./src/assets/fonts/SF-Pro-Italic.ttf"),
		"SF-Pro-Bold": require("./src/assets/fonts/SF-Pro-Bold.ttf"),
		"SF-Pro-Semibold": require("./src/assets/fonts/SF-Pro-Semibold.ttf"),
	});

	const Stack = createStackNavigator();
	const Tab = createBottomTabNavigator();

	NavigationBar.setBackgroundColorAsync(theme.colors.surface);

	if (!fontsLoaded) {
		return (
			<Background>
				<Logo />
			</Background>
		);
	}

	const TabNavigator = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarShowLabel: false,
					headerShown: false,
					tabBarStyle: {
						height: 50,
					},

					tabBarIcon: ({ focused, size, color }) => {
						let iconName;
						if (route.name === "Home") {
							iconName = focused ? "home-sharp" : "ios-home-outline";
							size = focused ? size + 8 : size + 2;
							color = focused ? theme.colors.text : theme.colors.secondary;
						} else if (route.name === "News") {
							iconName = focused ? "megaphone-sharp" : "ios-megaphone-outline";
							size = focused ? size + 8 : size + 2;
							color = focused ? theme.colors.text : theme.colors.secondary;
						} else if (route.name === "Search") {
							iconName = focused ? "search" : "search-outline";
							size = focused ? size + 8 : size + 2;
							color = focused ? theme.colors.text : theme.colors.secondary;
						} else if (route.name === "Profile") {
							iconName = focused ? "person-sharp" : "ios-person-outline";
							size = focused ? size + 8 : size + 2;
							color = focused ? theme.colors.text : theme.colors.secondary;
						}

						return <Ionic name={iconName} size={size} color={color} />;
					},
					tabBarActiveBackgroundColor: theme.colors.surface,
					tabBarInactiveBackgroundColor: theme.colors.surface,
				})}
			>
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Search" component={SearchScreen} />
				<Tab.Screen name="News" component={NewsScreen} />
				<Tab.Screen name="Profile" component={ProfileScreen} />
			</Tab.Navigator>
		);
	};

	return (
		<UserProvider>
			<Provider theme={theme}>
				<NavigationContainer theme={DarkTheme}>
					<Stack.Navigator
						initialRouteName="StartScreen"
						screenOptions={{
							headerShown: false,
							presentation: "modal",
						}}
					>
						<Stack.Screen name="StartScreen" component={StartScreen} />
						<Stack.Screen name="LoginScreen" component={LoginScreen} />
						<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
						<Stack.Screen name="Dashboard" component={TabNavigator} />
						<Stack.Screen
							name="ResetPasswordScreen"
							component={ResetPasswordScreen}
						/>
						<Stack.Screen name="EditProfile" component={EditProfile} />
						<Stack.Screen
							name="OtherUserProfileScreen"
							component={OtherUserProfileScreen}
						/>
						<Stack.Screen
							name="CreateSquadScreen"
							component={CreateSquadScreen}
						/>
						<Stack.Screen
							name="SquadProfileScreen"
							component={SquadProfileScreen}
						/>
						<Stack.Screen
							name="CreateSquadBadge"
							component={CreateSquadBadge}
						/>
						<Stack.Screen
							name="CreatePickupMatchScreen"
							component={CreatePickupMatchScreen}
						/>
						<Stack.Screen
							name="CreateTeamsMatchScreen"
							component={CreateTeamsMatchScreen}
						/>
						<Stack.Screen
							name="MatchDetailsScreen"
							component={MatchDetailsScreen}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		</UserProvider>
	);
};

export default App;
