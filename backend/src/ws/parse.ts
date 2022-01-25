export async function WS_parse(message: string): Promise<any> {
	try {
		return JSON.parse(message);
	} catch (e) {
		return null;
	}
}