// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
	countStatBons();
	countFinStats();
	fillStatTable();
	fillJewTable();
});
// -->
// <-- Активатор изменений
var form = document.querySelector('form');
form.addEventListener('change',main);
for(let input of document.querySelectorAll('input')){
input.addEventListener('input', ({ target: t }) => {
t.value = Math.max(t.min, Math.min(t.max, t.value));
});}

// -->
// <-- Объявление "глобальных" переменных
const charClass = {
	lvl: 1,
	sp: 48,
}
const jewelry = {
	r1: {rank: 0, stat: 'no', bon: 0},
	r2: {rank: 0, stat: 'no', bon: 0},
	neck: {rank: 0, bon: 0,
		n1: {stat: 'no', bon: 0},
		n2: {stat: 'no', bon: 0},
		},
}
const charStats = {
	svit: {base: 0, bon: 0, fin: 0, sp: 0},
	sstr: {base: 0, bon: 0, fin: 0, sp: 0},
	sdex: {base: 0, bon: 0, fin: 0, sp: 0},
	sint: {base: 0, bon: 0, fin: 0, sp: 0},
	sagi: {base: 0, bon: 0, fin: 0, sp: 0},
	sluk: {base: 0, bon: 0, fin: 0, sp: 0},
}
const statPairs = [['Нет','no'],['VIT','svit'], ['STR','sstr'], ['DEX','sdex'], ['INT','sint'], ['AGI','sagi'], ['LUK','sluk'],]
const noBonPair = [['+0', 0],];
const statSuf = '_stat';
const bonSuf = '_bon';
const idSuf = '_id';
const finSuf = '_fin';
const spSuf = '_sp';
const charSpId = 'sp_counter';
const lessSpSymId = 'less_sp_sym';
const lessSpValId = 'less_sp_val';
const htmlClasses = ['stats', 'jew_ranks', 'jew_stat', 'jew_bon']; //Справочник для заполнения функции main

var usedSp = 0;
// объявление переменных-->
// <-- Функции пересчёта статов
function changeJewRank(jewType, newRank){
	jewelry[jewType].rank = newRank;
	let jewBon =0;

	if(jewType == 'neck'){
		jewBon = countJewBon(newRank, true);
		jewelry.neck.bon = jewBon;
		jewType = 'n1';
		changeJewBon(jewType, jewBon, true);
		changeJewStat('n1', 'no', true);
		changeJewStat('n2', 'no', true);
	}
	else{
		jewBon = countJewBon(newRank, false);
		changeJewBon(jewType, jewBon, false);
		changeJewStat(jewType, 'no');
	}	
	reqJewStats(jewType, newRank, jewBon);
	countStatBons();
}
function changeJewStat(jewType, newStat, isNeck=false){
	if(isNeck){jewelry.neck[jewType].stat = newStat;}
	else{jewelry[jewType].stat = newStat;}
	countStatBons();
}
function changeJewBon(jewType, newBon, isNeck=false){
	if(isNeck){
		jewelry.neck.n1.bon = parseInt(newBon);
		let n2Bon = jewelry.neck.bon - newBon;
		jewelry.neck.n2.bon = parseInt(n2Bon);
		}
	else{jewelry[jewType].bon = parseInt(newBon);}
	countStatBons();
}
function changeCharLvl(lvl){
	charClass.lvl = parseInt(lvl);
	charClass.sp = countCharSp(lvl);
}
function countBaseStat(chStat){ 
	let statVal = getTagIntValue(chStat);
	if(statVal > 119){statVal = 119}
	charStats[chStat].base = statVal;
}
function countStatBons(){
	for(let chStat of Object.keys(charStats)){
		charStats[chStat].bon = 0;
		let bonSum = 0;					
		for(let jewType of Object.keys(jewelry)){
			if(jewType == 'neck'){
				if(jewelry[jewType].n1.stat == chStat){bonSum += jewelry[jewType].n1.bon;}
				if(jewelry[jewType].n2.stat == chStat){bonSum += jewelry[jewType].n2.bon;}
			}
			else if(jewelry[jewType].stat == chStat){
				bonSum += jewelry[jewType].bon;
			}
		}
		charStats[chStat].bon = bonSum;
	fillStatTable();
	}
}
function countFinStats(){
	for(let chStat of Object.keys(charStats)){
		charStats[chStat].fin = charStats[chStat].base + charStats[chStat].bon + 1;
	}
}	
function countStatPts(chStat){
	let spCost = 0;
	let value = charStats[chStat].base;
	let iter = 1;
	let cost = 2;
	for(let i=1; i<=value; i++){
		spCost += cost;
		console.log("cost:", cost);
		iter += 1;
		if(i < 80 && iter == 10){
			cost += 1;
			iter = 0;
		}
	}
	charStats[chStat].sp = spCost;
}
function countCharSp(lvl){
	let sp = 45;
	let spBon = 0;
	for(i=1;i<=lvl;i++){
		if((i % 5) == 0){
			spBon += 1;
			if (i>=90){spBon += 1}
			if (i>=100){spBon += 1}
		}
		if(i==130){sp += 80}
		else {
			sp += (3+spBon);
		}
	}
	return sp;
}	
function countUsedSp(){
	let spSum = 0;
	for(let chStat of Object.keys(charStats)){
		let baseStat = charStats[chStat].base;
		let spStat = charStats[chStat].sp;
		if(baseStat > 0){				
			spSum += spStat;
		}
	}
	return spSum;
}
function countJewBon(jewRank, isNeck){
	if(jewRank==0){return 0;}
	if(isNeck){
		let bonVal = jewRank*3 - 3;
		if(bonVal == 0){bonVal = 2}
		return bonVal;
	}
	else{
		let bonVal = jewRank*2 - 2;
		if(bonVal == 0){bonVal = 1}
		return bonVal;
	}
}
function reqJewStats(jewType, newRank, neckBon){
	let noStat = [statPairs[0],];
	let statArr = statPairs;
	let noBon = noBonPair;
	let bonArr = [];
	let statId = '';
	let stat2Id = '';
	let bonId = '';
	if(jewType == 'n1'){
		statId = jewType + statSuf;
		bonId = jewType + bonSuf;
		stat2Id = 'n2' + statSuf;
		for(i=0; i <= neckBon; i++){
			bonArr.push([`+${i}`, i]);
		}
	}
	else{statId = jewType + statSuf;}
	
	if(newRank != 0){
		fillSelect(statId, statArr);
		fillSelect(stat2Id, statArr);
		fillSelect(bonId, bonArr, false);
		changeTagStatus(statId, true);	
		changeTagStatus(stat2Id, true);
		changeTagStatus(bonId, true);
	}
	else{
		fillSelect(statId, noStat);
		fillSelect(stat2Id, noStat);
		fillSelect(bonId, noBon);
		changeTagStatus(statId, false);
		changeTagStatus(stat2Id, false);
		changeTagStatus(bonId, false);
	}
}
// пересчёт статов -->
// <-- функции заполнения UI
function fillStatTable(){
	let charSp = charClass.sp;
	// Итого, сп у стата
	for(let chStat of Object.keys(charStats)){
		let baseStat = charStats[chStat].base;
		let finStat = charStats[chStat].fin;
		let spStat = charStats[chStat].sp;
		let bonStat = charStats[chStat].bon;
		let spCost = 2;
		changeTagText(chStat+bonSuf, '+'+bonStat);
		changeTagText(chStat+finSuf, finStat);
		if(baseStat > 0){
			if(baseStat >= 79){spCost = 10}
			else{spCost = Math.floor((baseStat+1)/10) + 2}
			changeTagText(chStat+spSuf, `${spStat}  \u{2191}${spCost}`);
		}
		else{
			changeTagText(chStat+spSuf, `0  \u{2191}2`);
		}
	}
	// Сумма сп
	usedSp = countUsedSp();
	let content = usedSp +'/'+ charSp;
	changeTagText(charSpId, content);
	// Недостаточно сп
	let spDif = charSp - usedSp;
	if(spDif < 0){
		changeTagVis(lessSpSymId, true);
		changeTagText(lessSpValId, Math.abs(spDif));
	}
	else{
		changeTagVis(lessSpSymId, false);
		changeTagText(lessSpValId, Math.abs(spDif));
	}
}
function fillJewTable(){
	// Бонусы бижи
	for(let jewType of Object.keys(jewelry)){
		if(jewType === 'neck'){
			let n2Bon = jewelry[jewType].n2.bon;
			let bon2Id = 'n2' + bonSuf;
			let content = [[`+${n2Bon}`, n2Bon],];
			fillSelect(bon2Id, content);
		}
		else{
			let content = '+' + jewelry[jewType].bon;
			let bonId = jewType + bonSuf;
			changeTagText(bonId, content);
		}
	}
	// Атрибуты бижи?
}
// заполнение UI-->
// <-- Функции html разметки
function changeTag(tagId, newContent){
	if(tagId){document.getElementById(tagId).innerHTML = newContent;}
}
function changeTagText(tagId, newText){
	if(tagId&&(newText === 0 || newText === '0' || newText)){document.getElementById(tagId).textContent = newText;}
}
function changeTagStatus(tagId, tagStatus){
	if(!tagId){return 0}
	else if(tagStatus){document.getElementById(tagId).removeAttribute("disabled");}
	else{document.getElementById(tagId).setAttribute("disabled","")}
}
function changeTagVis(tagId, tagStatus){
	if(tagStatus){document.getElementById(tagId).removeAttribute("hidden");}
	else{document.getElementById(tagId).setAttribute("hidden","")}
}
function getTagIntValue(tagId){
	let value = parseInt(document.getElementById(tagId).value);
	if(isNaN(value)){value=0}
	return value;
}
function fillSelect(tagId, optArr, first=true){
	if(!tagId){return 0}
	let content = '';
	for(let pair of optArr){
		content += `<option value="${pair[1]}">${pair[0]}</option>\n`;
	}
	changeTag(tagId, content);
	if(first){document.getElementById(tagId).firstChild.setAttribute("selected","");}
	else{document.getElementById(tagId).lastElementChild.setAttribute("selected","");}
}

// функции разметки-->

// <-- TODO про параметры -->
// <-- Main. Только вызов функций, больше ничего! TODO рефакторить 

function main(tag){
	let elem = tag.target;
	let tagId = elem.id;
	let value = elem.value;
	let classes = elem.classList;
	
	switch(true){
		case classes.contains('stats'):
			countBaseStat(tagId);
			countStatPts(tagId);
			break;
		case classes.contains('jew_ranks'):
			tagId = tagId.split('_')[0];
			changeJewRank(tagId, value);
			break;
		case classes.contains('jew_stats'):
			let jewType = tagId.split('_')[0];
			if(jewType == 'r1' || jewType == 'r2'){
				changeJewStat(jewType, value);
			}
			else{changeJewStat(jewType, value, true);}
			break;
		case classes.contains('jew_bons'):
			tagId = tagId.split('_')[0];
			changeJewBon(tagId, value, true);
			break;
		case classes.contains('lvl'):
			changeCharLvl(value);
			break;
	}
	countStatBons();
	countFinStats();
	fillStatTable();
	fillJewTable();

	//console.log('target.id: '+elem); //target.id: [object HTMLInputElement]  или [object HTMLSelectElement]
	//console.log('value: '+elem.value); //значение выбора/ввода
	//console.dir(elem); //полный список в консоли  https://learn.javascript.ru/basic-dom-node-properties
}
// main -->
			
			
// ----------------------------------------------------------------------------------------------------------
/* функции: 			
	1. main. Все реакции прослушки сюда
	2. countFin. Подсчёт суммы статов.
	3. ввод данных о ранге колец
	4. ввод данных о ранге ожерелки (?)
	5. внесение в объект каждого украшения
	6. суммирование бонусов бижи
*/			
