import type { TypedDataDomain, TypedDataField } from 'ethers';

export interface EIP712 {
  primaryType: string;
  domain: TypedDataDomain;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: Record<string, any>;
  types: Record<string, Array<TypedDataField>>;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const abbreviateAddress = (address: string, first = 4, last = 4) => {
  return `${address.slice(0, Math.max(0, first))}...${address.slice(Math.max(0, address.length - last))}`;
};
