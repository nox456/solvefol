export function validateFields(data: object): String {
	for (const key of Object.keys(data)) {
		if (!data[key]) return `${key} field is missing`;
	}
	return "";
}
