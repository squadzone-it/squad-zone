import React from "react";
import Svg, { Path } from "react-native-svg";

const Img6 = ({ fill1, fill2, width = "100%", height = "100%" }) => (
	<Svg width={width} height={height} viewBox="0 0 800 800" fill="none">
		<Path
			fill={fill1}
			d=" M 0 0 L 800 0 L 800 80 C 533.33 80 266.67 80 0 80 L 0 0 Z"
		/>
		<Path
			fill={fill1}
			d=" M 0 160 C 266.67 160 533.33 160 800 160 L 800 240 C 533.33 240 266.67 240 0 240 L 0 160 Z"
		/>
		<Path
			fill={fill1}
			d=" M 0 320 C 266.67 320 533.33 320 800 320 L 800 400 C 533.33 400 266.67 400 0 400 L 0 320 Z"
		/>
		<Path
			fill={fill1}
			d=" M 0 480 C 266.67 480 533.33 480 800 480 L 800 560 C 533.33 560 266.67 560 0 560 L 0 480 Z"
		/>
		<Path
			fill={fill1}
			d=" M 0 640 C 266.67 640 533.33 640 800 640 L 800 720 C 533.33 720 266.67 720 0 720 L 0 640 Z"
		/>

		<Path
			fill={fill2}
			d=" M 0 80 C 266.67 80 533.33 80 800 80 L 800 160 C 533.33 160 266.67 160 0 160 L 0 80 Z"
		/>
		<Path
			fill={fill2}
			d=" M 0 240 C 266.67 240 533.33 240 800 240 L 800 320 C 533.33 320 266.67 320 0 320 L 0 240 Z"
		/>
		<Path
			fill={fill2}
			d=" M 0 400 C 266.67 400 533.33 400 800 400 L 800 480 C 533.33 480 266.67 480 0 480 L 0 400 Z"
		/>
		<Path
			fill={fill2}
			d=" M 0 560 C 266.67 560 533.33 560 800 560 L 800 640 C 533.33 640 266.67 640 0 640 L 0 560 Z"
		/>
		<Path
			fill={fill2}
			d=" M 0 720 C 266.67 720 533.33 720 800 720 L 800 800 L 0 800 L 0 720 Z"
		/>
	</Svg>
);

export default Img6;
