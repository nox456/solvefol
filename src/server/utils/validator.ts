type Data = Record<string, any>;

export function validateFields(data: Data): string {
	for (const key of Object.keys(data)) {
		if (!data[key]) return `${key} field is missing`;
	}
	return "";
}
