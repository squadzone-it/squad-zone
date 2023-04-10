import { DefaultTheme } from "react-native-paper";

export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "#000000", // set background color to black
		text: "#ffffff", // set text color to white
		primary: "#5EA780",
		secondary: "#797D81",
		error: "#f13a59",
		surface: "#202124",
	},
};
