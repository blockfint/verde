import { rpInterface } from '../../../blockchain/build/lib/interface_lib';

export const getId = async (namespace,userId) => {
  return {
    id: await rpInterface.findUserAddress(namespace,userId)
  }
  /*return {
    name: 'Foo',
    lastname: 'Bar',
    id: '0x3355',
    condition: process.env.CONDITION_CONTRACT_ADDR
  };*/
};
