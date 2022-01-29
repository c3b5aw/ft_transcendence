function randomRGB(): [number, number, number] {
	return [ Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256) ];
}

function RandomBG(): string {
	const [r, g, b] = randomRGB();
	return `rgb(${r}, ${g}, ${b})`;
}

export {
	RandomBG,
}