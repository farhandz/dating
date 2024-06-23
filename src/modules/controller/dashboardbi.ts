import * as service from '../service/dashboardbi';

export const charter = async () => {
  const data = await service.getCharter();
  return { message: `sukses get charter `, data, code: 200 };
};

export const organizations = async () => {
  const data = await service.getOrganizations();
  return { message: `sukses get organisation`, data, code: 200 };
};

export const stakeholder = async () => {
  const data = await service.getStakeholder();
  return { message: `sukses get stakeholder`, data, code: 200 };
};

export const contract = async () => {
  const data = await service.getContract();
  return { message: `sukses get contract`, data, code: 200 };
};

export const risk = async () => {
  const data = await service.getRisk();
  return { message: `sukses get risk`, data, code: 200 };
};

export const deliverable = async () => {
  const data = await service.getDeliverable();
  return { message: `sukses get deliverable`, data, code: 200 };
};

export const top = async () => {
  const data = await service.getTop();
  return { message: `sukses get top`, data, code: 200 };
};

export const topTelpro = async () => {
  const data = await service.getTopTelpro();
  return { message: `sukses get top`, data, code: 200 };
};
