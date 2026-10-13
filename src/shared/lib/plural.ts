const rules = new Intl.PluralRules("ru");

type PluralForms = {
  one: string;
  few: string;
  many: string;
};

export function plural(count: number, forms: PluralForms): string {
  const category = rules.select(count);
  if (category === "one") return forms.one;
  if (category === "few") return forms.few;
  return forms.many;
}

export function tokensLabel(count: number): string {
  return `${count} ${plural(count, { one: "токен", few: "токена", many: "токенов" })}`;
}

export function roomsLabel(count: number): string {
  return `${count} ${plural(count, { one: "комната", few: "комнаты", many: "комнат" })}`;
}
