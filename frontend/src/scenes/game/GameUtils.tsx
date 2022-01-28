function RandomRGB(): [number, number, number] {
	return [ Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256) ];
}

export {
	RandomRGB,
}