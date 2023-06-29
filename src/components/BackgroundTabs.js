import React, { useState } from "react";
import {
	ImageBackground,
	StyleSheet,
	View,
	StatusBar,
	RefreshControl,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../core/theme";

export default function BackgroundTabs({ children, onRefresh }) {
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = useState(false);

	const route = useRoute().name;

	const internalOnRefresh = () => {
		setRefreshing(true);

		if (typeof onRefresh === "function") {
			onRefresh();
		} else {
			navigation.reset({
				index: 0,
				routes: [{ name: route }],
			});
		}

		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	};
	return (
		<ImageBackground
			/*source={require("../assets/background_dot.png")}
			resizeMode="repeat"*/

			style={styles.background}
		>
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
			<KeyboardAwareScrollView
				behavior="padding"
				contentContainerStyle={styles.scrollViewContent}
				keyboardShouldPersistTaps="never"
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={internalOnRefresh}
					/>
				}
			>
				<View style={styles.container}>{children}</View>
			</KeyboardAwareScrollView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: "100%",
		backgroundColor: theme.colors.surface,
	},
	container: {
		flex: 1,
		//padding: 20,
		paddingVertical: 20,
		width: "100%",
		//maxWidth: 350,
		alignSelf: "center",
		alignItems: "flex-start",
		justifyContent: "center",
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
