import {
  TermOfPaymentBuilder,
  TermOfPaymentBuilderTelpro,
  charterBuilder,
  contractBuilder,
  deliverableBuilder,
  getTotalRowCount,
  orginisationBuilder,
  riskBuilder,
  stakeholderBuilder,
} from '../sql/dashboardbi';

export const getCharter = async (): Promise<any[]> => {
  return await charterBuilder();
};

export const getOrganizations = async () => {
  return await orginisationBuilder();
};

export const getStakeholder = async () => {
  return await stakeholderBuilder();
};

export const getContract = async () => {
  return await contractBuilder();
};

export const getRisk = async () => {
  return await riskBuilder();
};

export const getTop = async () => {
  return await TermOfPaymentBuilder();
};

export const getTopTelpro = async () => {
  return await TermOfPaymentBuilderTelpro();
};

export const getDeliverable = async () => {
  const totalRows = await getTotalRowCount(); // Example total number of rows
  const batchSize = 1000; // Example batch size
  const numBatches = Math.ceil(totalRows / batchSize);
  const offsets = Array.from({ length: numBatches }, (_, i) => i * batchSize);

  // Fetch data for all batches concurrently
  const promises = offsets.map((offset) =>
    deliverableBuilder(offset, batchSize),
  );

  // Wait for all promises to resolve
  const batches = await Promise.all(promises);

  // Flatten the array of batches
  return batches.flat();
};
