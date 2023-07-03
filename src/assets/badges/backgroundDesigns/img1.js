import React from "react";
import Svg, { Path } from "react-native-svg";

const Img1 = ({ fill1, fill2, width = "100%", height = "100%" }) => (
	<Svg width={width} height={height} viewBox="0 0 800 800" fill="none">
		<Path d="M0 0H400V800H0V0Z" fill={fill1} />
		<Path d="M400 0H800V800H400V0Z" fill={fill2} />
	</Svg>
);

export default Img1;
