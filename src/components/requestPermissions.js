import * as MediaLibrary from "expo-media-library";
import * as Camera from "expo-camera";

export const requestGalleryPermission = async () => {
	const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
	const cameraPermission = await Camera.requestCameraPermissionsAsync();

	if (
		mediaLibraryPermission.status !== "granted" ||
		cameraPermission.status !== "granted"
	) {
		alert("Lo sentimos, necesitamos permisos de la galería para continuar.");
		return false;
	}

	return true;
};
