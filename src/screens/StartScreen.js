import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

export default function StartScreen({ navigation }) {
	return (
		<Background>
			<Logo />
			<Header>SQUAD ZONE</Header>
			<Paragraph>
				Ave María cuando serás mía, si me quisieras todo te daría!
			</Paragraph>
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
