// playground/__mocks__/tailrix.ts

export const createAccount = jest.fn();
export const deleteAccount = jest.fn();
export const updateAccount = jest.fn();

// If Account or AccountInfo are used as values (e.g. classes) they might need mocks too.
// For now, assuming they are interfaces/types, so runtime mocks are not needed.
// Example if they were classes:
// export class Account {}
// export class AccountInfo {}

// To provide default mock implementations:
// createAccount.mockResolvedValue({ id: 'mockId', ... });
// deleteAccount.mockResolvedValue(undefined);
// updateAccount.mockResolvedValue({ id: 'mockId', ... });

console.log('Mocking tailrix module'); // For debugging if the mock is picked up
