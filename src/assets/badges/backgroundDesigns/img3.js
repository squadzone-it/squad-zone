import React from "react";
import Svg, { Path } from "react-native-svg";

const Img3 = ({ fill1, fill2, width = "100%", height = "100%" }) => (
	<Svg width={width} height={height} viewBox="0 0 800 800" fill="none">
		<Path fill={fill1} d=" M 0 0 L 800 0 L 800 800 L 0 800 L 0 0 Z" />
	</Svg>
);

export default Img3;
