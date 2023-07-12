import { DefaultTheme } from "react-native-paper";

export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "#000000", // set background color to black
		text: "#ffffff", // set text color to white
		primary: "#5EA780",
		midwayPrimSecon: "#6A9480",
		secondary: "#797D81",
		secondaryBackground: "#1a1a1a",
		error: "#f13a59",
		surface: "#000000",
	},
};

export const lightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "#ffffff", // establece el color de fondo a blanco
		text: "#000000", // establece el color del texto a negro
		primary: "#5EA780",
		midwayPrimSecon: "#6A9480",
		secondary: "#797D81",
		secondaryBackground: "#E5E5E5",
		error: "#f13a59",
		surface: "#ffffff",
	},
};
