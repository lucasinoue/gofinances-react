const formatDate = (value: number | Date): string =>
  Intl.DateTimeFormat('pt-BR').format(value);

export default formatDate;
