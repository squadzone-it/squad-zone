import React from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

export default function StartScreen({ navigation }) {
	return (
		<Background>
			<Logo />
			<Header>
				SQUAD Z<Ionic name="football-outline" style={{ fontSize: 28 }} />
				NE
			</Header>
			<Paragraph></Paragraph>
			<Button
				mode="contained"
				onPress={() => navigation.navigate("LoginScreen")}
			>
				LOG IN
			</Button>
			<Button
				mode="outlined"
				onPress={() => navigation.navigate("RegisterScreen")}
			>
				SIGN UP
			</Button>
		</Background>
	);
}
