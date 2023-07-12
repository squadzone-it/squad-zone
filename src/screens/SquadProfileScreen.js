import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	StatusBar,
	TouchableOpacity,
	Modal,
	ScrollView,
	RefreshControl,
} from "react-native";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../core/theme";
import Ionic from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ConfirmModal from "../components/ConfirmModal";
import NotificationModal from "../components/NotificationModal";

import { UserContext } from "../contexts/UserContext";
import {
	getSquadData,
	leaveOrKickSquad,
	changeUserRole,
	handleSquadRequest,
	getUserData,
	requestToJoinSquad,
} from "../components/ApiService";

const SquadProfileScreen = ({ route }) => {
	const { user } = useContext(UserContext);
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		//navigation.setParams({ disableAnimation: true });
		navigation.replace("SquadProfileScreen", {
			squadId: route.params.squadId ? route.params.squadId : squadData.squadId,
		});
		setRefreshing(false);
	}, [navigation, route.params]);

	const navigation = useNavigation();

	const [userData, setUserData] = useState(null);
	const [squadData, setSquadData] = useState(route.params.squadData);
	const squadId = route.params.squadId;
	const [showModal, setShowModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [optionModalVisible, setOptionModalVisible] = useState(false);
	const [showRequestsModal, setShowRequestsModal] = useState(false);
	const [requestSent, setRequestSent] = useState(false);

	//confirm modal
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState({
		title: "",
		message: "",
		action: null,
	});
	//notification modal
	const [notificationModalVisible, setNotificationModalVisible] =
		useState(false);
	const [notificationModalContent, setNotificationModalContent] = useState({
		title: "",
		message: "",
	});

	useEffect(() => {
		const fetchSquadData = async () => {
			if (squadId) {
				const data = await getSquadData(squadId);
				setSquadData(data);
			}
		};

		fetchSquadData();
	}, [squadId]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!route.params.userData) {
				const data = await getUserData(user.uid);
				setUserData(data);
			} else {
				setUserData(route.params.userData);
			}
		};

		fetchUserData();
	}, [squadData, user.uid]);

	const onOptionsPressed = () => {
		setShowModal(true);
	};

	const onClosePressed = () => {
		setShowModal(false);
	};

	const handleJoinRequest = async () => {
		try {
			await requestToJoinSquad(squadData.squadId, user.uid);
			setRequestSent(true); // Marcar que la solicitud se ha enviado
		} catch (error) {
			console.error("Error requesting to join squad:", error);
		}
	};

	const handleRequestAcceptance = async (userId, squadId) => {
		try {
			console.log(userId, squadId);
			await handleSquadRequest(userId, squadId, true);
			refreshRequests();
			setNotificationModalContent({
				title: "Invitación aceptada",
				message: "Has aceptado la invitación para que se una al equipo.",
			});
			setNotificationModalVisible(true);
		} catch (error) {
			console.error("Error accepting request:", error);
		}
	};

	const handleRequestRejection = async (userId, squadId) => {
		try {
			console.log(userId, squadId);
			await handleSquadRequest(userId, squadId, false);
			if (squadData && squadData.requests) {
				const updatedRequests = squadData.requests.filter(
					(requestId) => requestId !== userId
				);
				setSquadData({ ...squadData, requests: updatedRequests });
			}
			refreshRequests();
			setNotificationModalContent({
				title: "Solicitud rechazada",
				message: "Has rechazado la solicitud para unirte al equipo.",
			});
			setNotificationModalVisible(true);
		} catch (error) {
			console.error("Error rejecting request:", error);
		}
	};

	const refreshRequests = async () => {
		setShowRequestsModal(false);
		const data = await getSquadData(squadId);
		setSquadData(data);
	};

	const Miembros = () => (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{typeof squadData.members[0] === "object" &&
				squadData.members.map((item) => (
					<View style={styles.userContainer} key={item.username}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("OtherUserProfileScreen", {
									user: item,
									squadData: squadData,
								})
							}
						>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={styles.userContainer2}>
									{item.photoUrl && (
										<Image
											source={{ uri: item.photoUrl }}
											style={styles.userImage}
										/>
									)}
									<View style={styles.userSubContainer}>
										<View style={styles.usernameContainer}>
											<Text style={styles.usernameText}>{item.username}</Text>
											{item.verified && (
												<Image
													source={require("../assets/verified.png")}
													style={{
														width: 16,
														height: 16,
														marginLeft: 5,
													}}
												/>
											)}
											{item.userId === squadData.captain ||
											squadData.veterans.includes(item.userId) ? (
												<Image
													source={
														item.userId === squadData.captain
															? require("../assets/cap.png")
															: require("../assets/vet.png")
													}
													style={{
														width: 20,
														height: 14,
														borderRadius: 1,
														marginLeft: 10,
													}}
												/>
											) : (
												<></>
											)}
										</View>
										<View style={styles.nameContainer}>
											<Text style={styles.nameText}>{item.name}</Text>
											<Text style={styles.lastnameText}>{item.lastName}</Text>
										</View>
									</View>
								</View>
							</View>
						</TouchableOpacity>
						{user &&
						user.uid === squadData.captain &&
						item.userId !== squadData.captain ? (
							<TouchableOpacity
								style={{ right: 10, position: "absolute" }}
								onPress={() => {
									setSelectedUser(item);
									setOptionModalVisible(true);
								}}
							>
								<Ionic
									name="ellipsis-vertical-sharp"
									style={{ fontSize: 32, color: theme.colors.text }}
								/>
							</TouchableOpacity>
						) : (
							<></>
						)}
					</View>
				))}
			{userData &&
				!userData.team && ( //CONDICION A CAMBIAR
					<View style={{ flexDirection: "column", alignSelf: "center" }}>
						<TouchableOpacity
							style={
								requestSent ||
								userData.squadRequests.includes(squadData.squadId)
									? styles.blockedButton
									: styles.inviteOrRequestsButton
							}
							onPress={handleJoinRequest}
							disabled={
								requestSent ||
								userData.squadRequests.includes(squadData.squadId)
							}
						>
							<Ionic
								name="person-add-outline"
								style={{ fontSize: 25, color: theme.colors.secondary }}
							/>
						</TouchableOpacity>
						<Text
							style={{
								fontFamily: "SF-Pro",
								alignSelf: "center",
								marginTop: 5,
								color: theme.colors.secondary,
							}}
						>
							{requestSent || userData.squadRequests.includes(squadData.squadId)
								? "¡Solicitado!"
								: "¡Solicita unirte!"}
						</Text>
					</View>
				)}

			{squadData.veterans &&
				(user.uid === squadData.captain ||
					squadData.veterans.includes(user.uid)) && (
					<View>
						<View style={{ flexDirection: "row", alignSelf: "center" }}>
							<TouchableOpacity
								style={styles.inviteOrRequestsButton}
								onPress={() =>
									navigation.navigate("Search", { screen: "Usuarios" })
								}
							>
								<Ionic
									name="person-add-outline"
									style={{ fontSize: 25, color: theme.colors.secondary }}
								/>
							</TouchableOpacity>
							{squadData.requests.length > 0 && (
								<View>
									<TouchableOpacity
										style={styles.inviteOrRequestsButton}
										onPress={() => setShowRequestsModal(true)}
									>
										<Ionic
											name="file-tray-outline"
											style={{ fontSize: 25, color: theme.colors.secondary }}
										/>
										{showRequestsModal && (
											<Modal
												animationType="slide"
												transparent={true}
												visible={showRequestsModal}
												onRequestClose={() => setShowRequestsModal(false)}
											>
												<TouchableOpacity
													style={styles.modalBackground}
													onPress={() => setShowRequestsModal(false)}
												>
													<View style={styles.modalContent}>
														<Text
															style={{
																fontFamily: "SF-Pro-Bold",
																fontSize: 20,
																color: theme.colors.text,
																borderBottomWidth: 1,
																borderBottomColor: theme.colors.secondary,
															}}
														>
															Solicitudes
														</Text>
														{squadData.requests.map((request, index) => (
															<View style={styles.requestContainer} key={index}>
																<TouchableOpacity
																	onPress={() =>
																		navigation.navigate(
																			"OtherUserProfileScreen",
																			{ user: request }
																		)
																	}
																>
																	<View
																		style={{
																			flexDirection: "row",
																			alignItems: "center",
																		}}
																	>
																		<Image
																			source={{
																				uri: request.photoUrl,
																			}}
																			style={styles.requestBadge}
																		/>

																		<View style={styles.requestSubContainer}>
																			<View style={styles.requestNameContainer}>
																				<Text style={styles.requestNameText}>
																					{request.username}
																				</Text>
																			</View>
																			<View
																				style={
																					styles.requestDescriptionContainer
																				}
																			>
																				<Text
																					style={styles.requestDecriptionText}
																				>
																					{request.name}{" "}
																					{/*{request.lastName}*/}
																				</Text>
																			</View>
																		</View>
																	</View>
																</TouchableOpacity>
																<View style={{ flexDirection: "row" }}>
																	<TouchableOpacity
																		style={{ paddingHorizontal: 5 }}
																		onPress={() =>
																			handleRequestRejection(
																				request.userId,
																				squadId
																			)
																		}
																	>
																		<Ionic
																			name="close-sharp"
																			style={{
																				fontSize: 25,
																				color: theme.colors.text,
																			}}
																		/>
																	</TouchableOpacity>
																	<TouchableOpacity
																		style={{ paddingHorizontal: 5 }}
																		onPress={() =>
																			handleRequestAcceptance(
																				request.userId,
																				squadId
																			)
																		}
																	>
																		<Ionic
																			name="checkmark-sharp"
																			style={{
																				fontSize: 25,
																				color: theme.colors.text,
																			}}
																		/>
																	</TouchableOpacity>
																</View>
															</View>
														))}
													</View>
												</TouchableOpacity>
											</Modal>
										)}
									</TouchableOpacity>
									<View
										style={{
											position: "absolute",
											right: 15,
											bottom: 0,
											backgroundColor: "red",
											borderRadius: 50,
											width: 20,
											height: 20,
											alignItems: "center",
											justifyContent: "center",
											zIndex: 20,
										}}
									>
										<Text style={{ color: "#fff" }}>
											{squadData.requests.length}
										</Text>
									</View>
								</View>
							)}
						</View>

						<Text
							style={{
								fontFamily: "SF-Pro",
								alignSelf: "center",
								marginTop: 5,
								color: theme.colors.secondary,
							}}
						>
							Invita a tus amigos!
						</Text>
					</View>
				)}
		</ScrollView>
	);

	const Estadisticas = () => (
		<View>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Estadisticas
			</Text>
		</View>
	);

	const Partidos = () => (
		<View>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Datos Personales
			</Text>
		</View>
	);

	const changeRole = async (role) => {
		console.log(
			`Cambiar el rol de ${selectedUser && selectedUser.name} a ${role}`
		);
		try {
			const userId = selectedUser.userId;
			const squadId = selectedUser.team;
			await changeUserRole(squadId, userId, role);
			console.log("Role changed successfully");

			// Actualizar el estado local del equipo
			if (role === "veteran") {
				if (!squadData.veterans.includes(userId)) {
					setSquadData({
						...squadData,
						veterans: [...squadData.veterans, userId],
					});
				}
			} else if (role === "down") {
				setSquadData({
					...squadData,
					veterans: squadData.veterans.filter(
						(veteranId) => veteranId !== userId
					),
				});
			}
		} catch (error) {
			console.error("Error changing user role:", error);
		} finally {
			setOptionModalVisible(false); // Cerrar el modal al finalizar
		}
	};

	const kickUser = () => {
		setModalContent({
			title: "Confirmación",
			message: `¿Estás seguro de que quieres expulsar a ${
				selectedUser && selectedUser.name
			} ${selectedUser.lastName}?`,
			action: async () => {
				try {
					const userId = selectedUser.userId;
					const squadId = selectedUser.team;
					await leaveOrKickSquad(userId, squadId);
					console.log(
						`Expulsado con éxito a ${selectedUser && selectedUser.name}`
					);

					let updatedMembers = squadData.members.filter(
						(member) => member.userId !== userId
					);
					let updatedVeterans = squadData.veterans.filter(
						(veteranId) => veteranId !== userId
					);

					setSquadData({
						...squadData,
						members: updatedMembers,
						veterans: updatedVeterans,
					});
				} catch (error) {
					console.error("Error al expulsar al usuario:", error);
				} finally {
					setModalVisible(false);
				}
			},
		});
		setModalVisible(true);
	};

	const leaveSquad = () => {
		setModalContent({
			title: "Confirmación",
			message: `¿Estás seguro de que quieres abandonar ${squadData.displayname}?`,
			action: async () => {
				try {
					const userId = user.uid;
					const squadId = squadData.squadId;
					await leaveOrKickSquad(userId, squadId);
					console.log("Se ha salido del squad con éxito");

					navigation.goBack();
				} catch (error) {
					console.error("Error al salir del squad:", error);
				} finally {
					setModalVisible(false);
				}
			},
		});
		setModalVisible(true);
	};

	const createSquadBadgeHandler = () => {
		navigation.navigate("CreateSquadBadge", {
			squadId: route.params.squadId ? route.params.squadId : squadData.squadId,
		});
	};

	const tempButton = () => {};

	const Tab = createMaterialTopTabNavigator();

	return squadData && userData ? (
		<BackgroundNoScroll>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButtonLeft}
					onPress={navigation.goBack}
				>
					<Ionic
						name="arrow-back"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>
					SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
					NE
				</Text>
				{userData && squadData && userData.team === squadData.squadId ? (
					<TouchableOpacity
						onPress={onOptionsPressed}
						style={styles.headerButtonRight}
					>
						<Ionic
							name="menu-sharp"
							style={{ fontSize: 25, color: theme.colors.text }}
						/>
					</TouchableOpacity>
				) : (
					<Ionic
						name="menu-sharp"
						style={[
							styles.headerButtonRight,
							{ fontSize: 25, color: "transparent" },
						]}
					/>
				)}

				<Modal visible={showModal} animationType="slide" transparent={true}>
					<TouchableOpacity
						style={styles.modalBackground}
						onPress={onClosePressed}
					>
						<View style={styles.modalContent}>
							<TouchableOpacity onPress={tempButton}>
								<Text style={styles.modalOption}>Opcion 1</Text>
							</TouchableOpacity>
							{squadData.captain && user.uid === squadData.captain && (
								<TouchableOpacity onPress={createSquadBadgeHandler}>
									<Text style={styles.modalOption}>Editar Escudo</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity onPress={leaveSquad}>
								<Text style={styles.modalOptionR}>Abandonar Squad</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
			</View>

			{/* Body */}
			<View
				style={{
					backgroundColor: theme.colors.surface,
					height: "100%",
					width: "100%",
				}}
			>
				<StatusBar
					backgroundColor={theme.colors.surface}
					barStyle="light-content"
					animated={true}
				/>
				{/* ProfileInfo */}
				<View
					style={{
						flexDirection: "column",
						alignItems: "center",
						width: "100%",
						paddingLeft: 10,
						backgroundColor: theme.colors.surface,
					}}
				>
					<Image
						source={{ uri: squadData.squadBadgeUrl }}
						style={styles.squadImage}
					/>
					<View style={{ alignItems: "center" }}>
						<Text style={styles.squadName}>{squadData.displayname}</Text>
						<Text style={styles.squadDescription}>{squadData.description}</Text>
					</View>
				</View>

				{/* Pestañas */}
				<Tab.Navigator
					screenOptions={{
						tabBarActiveTintColor: theme.colors.text,
						tabBarInactiveTintColor: theme.colors.secondary,
						tabBarPressColor: "transparent",
						tabBarShowLabel: false,
						tabBarIndicatorStyle: {
							backgroundColor: theme.colors.primary,
						},
						tabBarStyle: {
							backgroundColor: theme.colors.surface,
							borderBottomWidth: 1,
							borderBottomColor: theme.colors.primary,
							paddingTop: 0,
							height: 50,
							borderColor: theme.colors.primary,
						},
					}}
				>
					<Tab.Screen
						name="Miembros"
						component={Miembros}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="people-sharp" color={color} size={25} />
								) : (
									<Ionic name="people-outline" color={color} size={23} />
								),
						}}
					/>
					<Tab.Screen
						name="Estadisticas"
						component={Estadisticas}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="stats-chart-sharp" color={color} size={25} />
								) : (
									<Ionic name="stats-chart-outline" color={color} size={23} />
								),
						}}
					/>
					<Tab.Screen
						name="Partidos"
						component={Partidos}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="calendar" color={color} size={25} />
								) : (
									<Ionic name="calendar-outline" color={color} size={23} />
								),
						}}
					/>
				</Tab.Navigator>
			</View>
			<Modal
				visible={optionModalVisible}
				animationType="slide"
				transparent={true}
			>
				<TouchableOpacity
					style={styles.modalBackground}
					onPress={() => setOptionModalVisible(false)}
				>
					<View style={styles.modalContent}>
						{selectedUser &&
						squadData.veterans.includes(selectedUser.userId) ? (
							<>
								<TouchableOpacity onPress={() => changeRole("down")}>
									<Text style={styles.modalOption}>Descender a miembro</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => changeRole("captain")}>
									<Text style={[styles.modalOption, { marginBottom: 5 }]}>
										Pasar capitan a {selectedUser && selectedUser.name}
									</Text>
								</TouchableOpacity>
							</>
						) : (
							<>
								<TouchableOpacity onPress={() => changeRole("veteran")}>
									<Text style={styles.modalOption}>Ascender a veterano</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={kickUser}>
									<Text style={styles.modalOptionR}>
										Expulsar a {selectedUser && selectedUser.name}
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</TouchableOpacity>
			</Modal>
			<ConfirmModal
				visible={modalVisible}
				title={modalContent.title}
				message={modalContent.message}
				onConfirm={modalContent.action}
				onCancel={() => setModalVisible(false)}
			/>
			<NotificationModal
				visible={notificationModalVisible}
				title={notificationModalContent.title}
				message={notificationModalContent.message}
				onConfirm={() => setNotificationModalVisible(false)}
			/>
		</BackgroundNoScroll>
	) : (
		<></>
	);
};

export default SquadProfileScreen;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 15,
		backgroundColor: theme.colors.surface,
		width: "100%",
		position: "relative",
		top: 0,
	},
	headerText: {
		fontFamily: "CODE-Bold",
		fontSize: 24,
		fontWeight: "500",
		color: theme.colors.text,
	},
	headerButtonRight: {
		padding: 10,
		marginLeft: "auto",
	},
	headerButtonLeft: {
		padding: 10,
		marginRight: "auto",
	},
	modalBackground: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: theme.colors.secondaryBackground,
		borderRadius: 10,
		padding: 10,
		width: "80%",
		alignItems: "center",
	},
	modalOption: {
		marginBottom: 15,
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 16,
		color: theme.colors.text,
		textAlign: "center",
	},
	modalOptionR: {
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 16,
		color: theme.colors.error,
		textAlign: "center",
	},
	squadImage: {
		width: 100,
		height: 100,
		borderRadius: 20,
	},
	squadName: {
		fontSize: 24,
		fontFamily: "SF-Pro-Bold",
		color: theme.colors.text,
	},
	squadDescription: {
		fontSize: 16,
		fontFamily: "SF-Pro",
		color: theme.colors.secondary,
		textAlign: "center",
		paddingHorizontal: 25,
	},
	squadCaptain: {
		fontSize: 16,
		color: theme.colors.text,
		marginBottom: 10,
	},
	squadMembers: {
		fontSize: 16,
		color: theme.colors.text,
	},
	loadingText: {
		fontSize: 18,
		color: theme.colors.text,
	},
	userContainer: {
		flexDirection: "row",
		padding: 10,
		alignItems: "center",
		backgroundColor: theme.colors.surface,
		borderBottomColor: theme.colors.secondaryBackground,
		borderBottomWidth: 1,
	},
	userContainer2: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: theme.colors.surface,
	},
	userImage: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	userSubContainer: {
		flexDirection: "column",
	},
	usernameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	usernameText: {
		color: theme.colors.text,
		fontSize: 16,
		fontWeight: "bold",
	},
	nameContainer: {
		flexDirection: "row",
	},
	nameText: {
		color: theme.colors.secondary,
		fontSize: 14,
		fontFamily: "SF-Pro",
	},
	lastnameText: {
		color: theme.colors.secondary,
		marginLeft: 4,
		fontSize: 14,
		fontFamily: "SF-Pro",
	},
	inviteOrRequestsButton: {
		alignItems: "center",
		alignSelf: "center",
		justifyContent: "center",
		marginTop: 20,
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.secondary,
		borderWidth: 1,
		borderRadius: 50,
		width: 50,
		height: 50,
		marginHorizontal: 20,
	},
	blockedButton: {
		alignItems: "center",
		alignSelf: "center",
		justifyContent: "center",
		marginTop: 20,
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.secondaryBackground,
		borderWidth: 1,
		borderRadius: 50,
		width: 50,
		height: 50,
		marginHorizontal: 20,
	},
	requestContainer: {
		flexDirection: "row",
		padding: 10,
		alignItems: "center",
		borderBottomColor: theme.colors.secondary,
		borderBottomWidth: 1,
		width: "100%",
		justifyContent: "space-between",
	},
	requestBadge: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	requestSubContainer: {
		flexDirection: "column",
	},
	requestNameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	requestNameText: {
		color: theme.colors.text,
		fontSize: 16,
		fontWeight: "bold",
	},
	requestDescriptionContainer: {
		flexDirection: "row",
	},
	requestDecriptionText: {
		color: theme.colors.secondary,
		fontSize: 14,
	},
});
