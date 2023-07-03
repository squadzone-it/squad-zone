import React from "react";
import Svg, { Path } from "react-native-svg";

const Img7 = ({ fill1, fill2, width = "100%", height = "100%" }) => (
	<Svg width={width} height={height} viewBox="0 0 800 800" fill="none">
		<Path
			fill={fill1}
			d=" M 0 0 L 80 0 C 80 266.67 80 533.33 80 800 L 0 800 L 0 0 Z"
		/>
		<Path
			fill={fill1}
			d=" M 160 0 L 240 0 C 240 266.67 240 533.33 240 800 L 160 800 C 160 533.33 160 266.67 160 0 Z"
		/>
		<Path
			fill={fill1}
			d=" M 320 0 L 400 0 C 400 266.67 400 533.33 400 800 L 320 800 C 320 533.33 320 266.67 320 0 Z"
		/>
		<Path
			fill={fill1}
			d=" M 480 0 L 560 0 C 560 266.67 560 533.33 560 800 L 480 800 C 480 533.33 480 266.67 480 0 Z"
		/>
		<Path
			fill={fill1}
			d=" M 640 0 L 720 0 C 720 266.67 720 533.33 720 800 L 640 800 C 640 533.33 640 266.67 640 0 Z"
		/>

		<Path
			fill={fill2}
			d=" M 80 0 L 160 0 C 160 266.67 160 533.33 160 800 L 80 800 C 80 533.33 80 266.67 80 0 Z"
		/>
		<Path
			fill={fill2}
			d=" M 240 0 L 320 0 C 320 266.67 320 533.33 320 800 L 240 800 C 240 533.33 240 266.67 240 0 Z"
		/>
		<Path
			fill={fill2}
			d=" M 400 0 L 480 0 C 480 266.67 480 533.33 480 800 L 400 800 C 400 533.33 400 266.67 400 0 Z"
		/>
		<Path
			fill={fill2}
			d=" M 560 0 L 640 0 C 640 266.67 640 533.33 640 800 L 560 800 C 560 533.33 560 266.67 560 0 Z"
		/>
		<Path
			fill={fill2}
			d=" M 720 0 L 800 0 L 800 800 L 720 800 C 720 533.33 720 266.67 720 0 Z"
		/>
	</Svg>
);

export default Img7;
