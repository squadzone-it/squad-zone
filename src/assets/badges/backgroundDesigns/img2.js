import React from "react";
import Svg, { Path } from "react-native-svg";

const Img2 = ({ fill1, fill2, width = "100%", height = "100%" }) => (
	<Svg width={width} height={height} viewBox="0 0 800 800" fill="none">
		<Path
			fill={fill2}
			d=" M 0 0 L 800 0 L 800 400 C 533.33 400 266.67 400 0 400 L 0 0 Z"
		/>

		<Path
			fill={fill1}
			d=" M 0 400 C 266.67 400 533.33 400 800 400 L 800 800 L 0 800 L 0 400 Z"
		/>
	</Svg>
);

export default Img2;
