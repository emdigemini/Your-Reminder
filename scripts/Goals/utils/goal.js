export function ifUnitsMoney(target, unit){
  const moneySymbols = [
    '$',  // US Dollar
    '₱',  // Philippine Peso
    '€',  // Euro
    '£',  // British Pound
    '¥',  // Japanese Yen / Chinese Yuan
    '₩',  // South Korean Won
    '₹',  // Indian Rupee
    '₫',  // Vietnamese Dong
    '₭',  // Lao Kip
    '₦',  // Nigerian Naira
    '₮',  // Mongolian Tögrög
    '₲',  // Paraguayan Guaraní
    '₴',  // Ukrainian Hryvnia
    '₺',  // Turkish Lira
    '₼',  // Azerbaijani Manat
    '₡',  // Costa Rican Colón
    '₸',  // Kazakhstani Tenge
    '₵',  // Ghanaian Cedi
    '₺',  // Turkish Lira
    '₳',  // Argentine Austral (historic)
    '₰',  // German Pfennig (historic)
    '₾',  // Georgian Lari
    '៛',  // Cambodian Riel
    '₠',  // ECU (European Currency Unit, historic)
    '₢',  // Brazilian Cruzeiro (historic)
    '₣',  // French Franc (historic)
    '₧',  // Spanish Peseta (historic)
    '₯',  // Greek Drachma (historic)
    '₨',  // Generic Rupee Symbol (used in multiple countries)
    '₪',  // Israeli Shekel
    '₤',  // Italian Lira (historic)
    '₶',  // Livre Tournois (historic)
    '₷',  // Spesmilo (unofficial)
    '₸',  // Kazakhstan Tenge
    '៛',  // Cambodian Riel
  ];

  if(unit == 'money' || unit == 'Money' || unit == 'MONEY'){
    const money = Number(target).toLocaleString('en-US');
    unit = '$';
    return `${unit}${money}`;
  }

  if(moneySymbols.includes(unit)){
    const money = Number(target).toLocaleString('en-US');
    return `${unit}${money}`
  } else {
    return `${target}${unit}`;
  }
}