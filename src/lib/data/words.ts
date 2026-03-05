export interface WordEntry {
	word: string;
	hint: string;
	source: string;
}

export const WORDS: WordEntry[] = [
	{ word: 'HEGEMONI', hint: 'Dominans eller overherredømme, særlig om kulturell eller politisk makt.', source: 'Analyse: USAs hegemoni i en multipolar verden' },
	{ word: 'KONSESJON', hint: 'Offentlig tillatelse til å drive en bestemt virksomhet eller utnytte en ressurs.', source: 'Nye konsesjoner for havvind: hvem får tilslaget?' },
	{ word: 'PARADIGME', hint: 'Grunnleggende tenkemåte eller vitenskapelig referanseramme.', source: 'Et paradigmeskifte i norsk klimapolitikk?' },
	{ word: 'DIKOTOMI', hint: 'Todeling eller skarpt motsetningsforhold mellom to begreper.', source: 'Dikotomien mellom by og land i norsk politikk' },
	{ word: 'RETORIKK', hint: 'Talekunst, argumentasjonsteknikk eller overtalelseskunst.', source: 'Krigsretorikken har nådd den europeiske debatten' },
	{ word: 'OLIGARKI', hint: 'Styreform der makten er konsentrert hos et fåtall mennesker.', source: 'Oligarkene: hvem styrer egentlig Europas økonomi?' },
	{ word: 'EMBARGO', hint: 'Handelsblokade eller forbud mot handel med en bestemt stat.', source: 'EU vurderer utvidet embargo mot Russland' },
	{ word: 'NARRATIV', hint: 'En fortellingsramme eller overordnet virkelighetsforståelse.', source: 'Kampen om det politiske narrativet før valget' },
	{ word: 'SANKSJON', hint: 'Straffetiltak mot en stat, eller formell godkjenning.', source: 'Nye sanksjoner: virker de etter hensikten?' },
	{ word: 'ANNEKTERING', hint: 'Ensidig innlemmelse av et landområde under en stats suverenitet.', source: 'Folkerettseksperter: annekteringen bryter internasjonal lov' }
];

export const MAX_WRONG = 6;

function getISOWeek(d: Date): number {
	const date = new Date(d.getTime());
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
	const week1 = new Date(date.getFullYear(), 0, 4);
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export interface WeeklyWord extends WordEntry {
	weekNum: number;
	year: number;
}

export function getWordForWeek(): WeeklyWord {
	const now = new Date();
	const week = getISOWeek(now);
	const year = now.getFullYear();
	const idx = ((year * 53) + week) % WORDS.length;
	return { ...WORDS[idx], weekNum: week, year };
}
