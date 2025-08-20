import { RequesterRole, PropertyType, Objective, Occupancy } from './types';

export const REQUESTER_ROLE_OPTIONS = [
  { value: RequesterRole.PROPRIETARIO, label: 'Proprietário' },
  { value: RequesterRole.CORRETOR_CNAI, label: 'Corretor (com CNAI)' },
  { value: RequesterRole.CORRETOR_SEM_CNAI, label: 'Corretor (sem CNAI)' },
  { value: RequesterRole.ADVOGADO, label: 'Advogado' },
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: PropertyType.URBANO, label: 'Urbano' },
  { value: PropertyType.RURAL, label: 'Rural' },
];

export const OBJECTIVE_OPTIONS = [
  { value: Objective.VENDA, label: 'Venda' },
  { value: Objective.PARTILHA, label: 'Partilha de Bens' },
  { value: Objective.JUDICIAL, label: 'Processo Judicial' },
  { value: Objective.OUTRO, label: 'Outro' },
];

export const OCCUPANCY_OPTIONS = [
  { value: Occupancy.OCUPADO, label: 'Ocupado' },
  { value: Occupancy.DESOCUPADO, label: 'Desocupado' },
];

export const DOCUMENT_OPTIONS = [
  { id: 'matricula', value: 'Matrícula', label: 'Matrícula' },
  { id: 'iptu', value: 'IPTU', label: 'IPTU' },
  { id: 'planta', value: 'Planta', label: 'Planta' },
  { id: 'nenhum', value: 'Nenhum', label: 'Nenhum' },
];

export const DOCUMENT_STATUS_OPTIONS = [
  { value: 'Regularizada', label: 'Regularizada' },
  { value: 'Pendente de averbação', label: 'Pendente de averbação' },
  { value: 'Em processo de usucapião', label: 'Em processo de usucapião' },
  { value: 'Escritura pública pendente de registro', label: 'Escritura pública pendente de registro' },
  { value: 'Contrato de gaveta', label: 'Contrato de gaveta' },
  { value: 'Em inventário', label: 'Em inventário' },
  { value: 'Financiamento ativo', label: 'Financiamento ativo' },
  { value: 'Outro / Não sei informar', label: 'Outro / Não sei informar' },
];

export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', 'label': 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];