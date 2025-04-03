export const getPersonaImage = (personaId: number | undefined): string => {
	if (!personaId || personaId < 1 || personaId > 24) {
		return "/icons/character/default.png";
	}

	return `/icons/character/${personaId}.png`;
};
